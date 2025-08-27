import React, { useState, useEffect, useCallback } from 'react';
import { Table, message, Spin } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';

dayjs.locale('vi');

const Hoadonban = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = useCallback((amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hoadonban');
      setBills(response.data);
      message.success('Đã tải danh sách hóa đơn thành công!');
    } catch (error) {
      console.error('Lỗi khi tải danh sách hóa đơn:', error);
      message.error('Lỗi khi tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const columns = [
    { title: 'ID Hóa đơn', dataIndex: 'id', key: 'id' },
    {
      title: 'Ngày bán',
      dataIndex: 'ngay_ban',
      key: 'ngay_ban',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Nhân viên',
      dataIndex: ['nhan_vien', 'ho_ten'],
      key: 'nhan_vien',
      render: (name) => name || 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tong_tien',
      key: 'tong_tien',
      render: (amount) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          {formatCurrency(amount)}
        </span>
      ),
      align: 'right',
    },
  ];

  return (
    <MainLayout>
      <h2>Quản lý Hóa đơn Bán</h2>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={bills} rowKey="id" />
      </Spin>
    </MainLayout>
  );
};

export default Hoadonban;