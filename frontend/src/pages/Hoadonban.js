import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  message,
  Spin,
  Card,
  Statistic,
  Space,
  Button,
  Typography,
  Badge,
  Divider
} from 'antd';
import {
  ReloadOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';

const { Title, Text } = Typography;
dayjs.locale('vi');

const Hoadonban = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = useCallback((amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '0₫';
    return `${new Intl.NumberFormat('vi-VN').format(amount)}₫`;
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hoadonban');
      setBills(response.data);
      message.success('✅ Đã tải danh sách hóa đơn thành công!');
    } catch (error) {
      console.error('Lỗi khi tải danh sách hóa đơn:', error);
      message.error('❌ Lỗi khi tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Tính toán thống kê
  const statistics = {
    totalBills: bills.length,
    totalRevenue: bills.reduce((sum, bill) => sum + (Number(bill.tong_tien) || 0), 0),
    todayBills: bills.filter(bill => 
      dayjs(bill.ngay_ban).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
    ).length,
    todayRevenue: bills
      .filter(bill => dayjs(bill.ngay_ban).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
      .reduce((sum, bill) => sum + (Number(bill.tong_tien) || 0), 0)
  };

  const columns = [
    { 
      title: 'Mã HĐ', 
      dataIndex: 'id', 
      key: 'id',
      width: 100,
      render: (text) => (
        <Badge 
          count={`#${text}`} 
          style={{ backgroundColor: "#1890ff" }}
        />
      )
    },
    {
      title: 'Ngày bán',
      dataIndex: 'ngay_ban',
      key: 'ngay_ban',
      width: 180,
      render: (date) => (
        <div>
          <div style={{ fontWeight: "600", color: "#1890ff" }}>
            {dayjs(date).format('DD/MM/YYYY')}
          </div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
            {dayjs(date).format('HH:mm:ss')}
          </div>
        </div>
      ),
    },
    {
      title: 'Thu ngân',
      dataIndex: ['nhan_vien', 'ho_ten'],
      key: 'nhan_vien',
      width: 200,
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          <Text strong style={{ color: '#722ed1' }}>
            {name || 'N/A'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tong_tien',
      key: 'tong_tien',
      render: (amount) => (
        <div style={{ 
          fontSize: "16px", 
          fontWeight: "700",
          color: "#52c41a",
          textAlign: "right"
        }}>
          {formatCurrency(amount)}
        </div>
      ),
      align: 'right',
      width: 150,
    },
  ];

  return (
    <MainLayout>
      <div style={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        margin: "-24px",
        padding: "24px"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header Card */}
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "1px solid #d9d9d9",
              marginBottom: "24px"
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div style={{
              background: "#1890ff",
              margin: "-24px -24px 24px -24px",
              padding: "16px 24px",
              borderRadius: "8px 8px 0 0",
              color: "white"
            }}>
              <Title level={2} style={{ 
                color: "white", 
                margin: 0, 
                fontSize: "20px",
                fontWeight: "600"
              }}>
                <FileTextOutlined style={{ marginRight: "12px" }} />
                📊 Quản lý Hóa đơn Bán
              </Title>
            </div>

            {/* Statistics Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "24px"
            }}>
              <Card
                style={{
                  backgroundColor: "#1890ff",
                  borderRadius: "8px",
                  border: "none"
                }}
                bodyStyle={{ padding: "20px", textAlign: "center" }}
              >
                <Statistic
                  title={
                    <span style={{ color: "white", fontWeight: "500" }}>
                      <FileTextOutlined style={{ marginRight: "8px" }} />
                      Tổng hóa đơn
                    </span>
                  }
                  value={statistics.totalBills}
                  valueStyle={{ color: "white", fontSize: "32px", fontWeight: "700" }}
                />
              </Card>

              <Card
                style={{
                  backgroundColor: "#52c41a",
                  borderRadius: "8px",
                  border: "none"
                }}
                bodyStyle={{ padding: "20px", textAlign: "center" }}
              >
                <Statistic
                  title={
                    <span style={{ color: "white", fontWeight: "500" }}>
                      <DollarOutlined style={{ marginRight: "8px" }} />
                      Tổng doanh thu
                    </span>
                  }
                  value={statistics.totalRevenue}
                  valueStyle={{ color: "white", fontSize: "28px", fontWeight: "700" }}
                  formatter={value => formatCurrency(value)}
                />
              </Card>

              <Card
                style={{
                  backgroundColor: "#fa8c16",
                  borderRadius: "8px",
                  border: "none"
                }}
                bodyStyle={{ padding: "20px", textAlign: "center" }}
              >
                <Statistic
                  title={
                    <span style={{ color: "white", fontWeight: "500" }}>
                      <CalendarOutlined style={{ marginRight: "8px" }} />
                      Hôm nay
                    </span>
                  }
                  value={statistics.todayBills}
                  valueStyle={{ color: "white", fontSize: "32px", fontWeight: "700" }}
                  suffix="đơn"
                />
              </Card>

              <Card
                style={{
                  backgroundColor: "#722ed1",
                  borderRadius: "8px",
                  border: "none"
                }}
                bodyStyle={{ padding: "20px", textAlign: "center" }}
              >
                <Statistic
                  title={
                    <span style={{ color: "white", fontWeight: "500" }}>
                      <TrophyOutlined style={{ marginRight: "8px" }} />
                      DT hôm nay
                    </span>
                  }
                  value={statistics.todayRevenue}
                  valueStyle={{ color: "white", fontSize: "28px", fontWeight: "700" }}
                  formatter={value => formatCurrency(value)}
                />
              </Card>
            </div>

            <div style={{ textAlign: "right" }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchBills}
                size="large"
                loading={loading}
                style={{
                  borderRadius: "6px",
                  backgroundColor: "#1890ff",
                  border: "none",
                  color: "white",
                  fontWeight: "500"
                }}
              >
                🔄 Làm mới dữ liệu
              </Button>
            </div>
          </Card>

          {/* Table Card */}
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "1px solid #d9d9d9"
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Spin spinning={loading} tip="Đang tải dữ liệu...">
              <Table 
                columns={columns} 
                dataSource={bills} 
                rowKey="id"
                pagination={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} của ${total} hóa đơn`,
                  pageSizeOptions: ['10', '15', '25', '50']
                }}
                style={{
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
                scroll={{ x: "max-content" }}
              />
            </Spin>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Hoadonban;