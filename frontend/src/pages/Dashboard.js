import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, message, Spin } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import { Column, Pie } from '@ant-design/plots';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [stockByType, setStockByType] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Bạn chưa đăng nhập');
          navigate('/login');
          return;
        }

        const res = await api.get('/dashboard/summary', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStats(res.data.stats);
        setDailyRevenue(res.data.charts.dailyRevenue);
        setStockByType(res.data.charts.stockByType);
      } catch (error) {
        console.error('Lỗi tải Dashboard:', error);
        if (error.response?.status === 401) {
          message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          message.error('Không thể tải dữ liệu Dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const dashboardCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts ?? 0,
      icon: <ShoppingOutlined style={{ fontSize: 36, color: '#1890ff' }} />,
      color: '#e6f7ff'
    },
    {
      title: 'Tổng nhân viên',
      value: stats.totalEmployees ?? 0,
      icon: <UserOutlined style={{ fontSize: 36, color: '#52c41a' }} />,
      color: '#f6ffed'
    },
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats.totalRevenue || 0),
      icon: <DollarOutlined style={{ fontSize: 36, color: '#faad14' }} />,
      color: '#fffbe6'
    },
    {
      title: 'Tổng hóa đơn',
      value: stats.totalInvoices ?? 0,
      icon: <FileTextOutlined style={{ fontSize: 36, color: '#722ed1' }} />,
      color: '#f9f0ff'
    }
  ];

  // Format dữ liệu trước khi truyền vào biểu đồ
  const formattedDailyRevenue = dailyRevenue.map(item => ({
    ...item,
    dateFormatted: (() => {
      try {
        const date = new Date(item.date);
        return date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit'
        });
      } catch {
        return item.date;
      }
    })()
  }));

  const columnConfig = {
    data: formattedDailyRevenue,
    xField: 'dateFormatted',
    yField: 'revenue',
    columnStyle: { fill: '#1890ff', radius: [4, 4, 0, 0] },
    label: false,
    tooltip: {
      formatter: (datum) => ({
        name: 'Doanh thu',
        value: formatCurrency(datum.revenue || 0)
      })
    }
  };

  const pieConfig = {
    // Lọc dữ liệu trước khi truyền vào biểu đồ
    data: stockByType.filter(item => (item.value ?? 0) > 0),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    // Tắt label để tránh lỗi
    label: false,
    interactions: [{ type: 'element-active' }],
    tooltip: {
      formatter: (datum) => {
        const total = stockByType.reduce((sum, item) => sum + (item.value || 0), 0);
        const percentage = total > 0 ? ((datum.value || 0) / total * 100).toFixed(1) : '0.0';
        return {
          name: datum.type || 'Không xác định',
          value: `${datum.value || 0} sản phẩm (${percentage}%)`
        };
      }
    },
    legend: {
      position: 'right'
    }
  };

  return (
    <MainLayout>
      <h2 style={{ marginBottom: 24 }}>Dashboard - Tổng quan hệ thống</h2>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {dashboardCards.map((card, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                style={{
                  backgroundColor: card.color,
                  borderRadius: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {card.icon}
                  <Statistic title={card.title} value={card.value} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Card style={{ marginTop: 24 }} title="Doanh thu theo ngày">
          <Column {...columnConfig} />
        </Card>

        <Card style={{ marginTop: 24 }} title="Tỉ lệ tồn kho theo loại sản phẩm">
          <Pie {...pieConfig} />
        </Card>
      </Spin>
    </MainLayout>
  );
};

export default Dashboard;