import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, message, Spin, Space,
  Popconfirm, Descriptions, Card, DatePicker
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined,
  InfoCircleOutlined, UserOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/nhanvien');
      setEmployees(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhân viên');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsEditModalOpen(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditingEmployee(record);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      ...record,
      ngay_sinh: record.ngay_sinh ? dayjs(record.ngay_sinh) : null,
      ngay_vao_lam: record.ngay_vao_lam ? dayjs(record.ngay_vao_lam) : null,
    });
  };

  const handleViewDetails = (record) => {
    setSelectedEmployee(record);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/nhanvien/${id}`);
      message.success('Xóa nhân viên thành công!');
      fetchEmployees();
    } catch (error) {
      message.error(error.response?.data?.error || 'Lỗi khi xóa nhân viên');
    }
  };

  const handleOk = async () => {
    setModalLoading(true);
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        ngay_sinh: values.ngay_sinh ? values.ngay_sinh.format("YYYY-MM-DD") : null,
        ngay_vao_lam: values.ngay_vao_lam ? values.ngay_vao_lam.format("YYYY-MM-DD") : null,
        trang_thai: values.trang_thai === true || values.trang_thai === "true"
      };

      if (editingEmployee) {
        await api.put(`/nhanvien/${editingEmployee.id}`, formattedValues);
        message.success('Cập nhật nhân viên thành công!');
      } else {
        await api.post('/auth/register', formattedValues);
        message.success('Thêm nhân viên thành công!');
      }

      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error(error);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => message.error(err));
      } else {
        message.error(error.response?.data?.error || 'Lỗi khi lưu nhân viên');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Họ tên', dataIndex: 'ho_ten', key: 'ho_ten' },
    { title: 'Tài khoản', dataIndex: 'tai_khoan', key: 'tai_khoan' },
    {
      title: 'Vai trò', dataIndex: 'vai_tro', key: 'vai_tro',
      render: (role) => {
        const color = role === 'quan_ly' ? 'red' : role === 'thu_ngan' ? 'green' : 'blue';
        return <span style={{ color, fontWeight: 'bold' }}>{role}</span>;
      }
    },
    { title: 'Số điện thoại', dataIndex: 'so_dien_thoai', key: 'so_dien_thoai' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Ngày vào làm',
      dataIndex: 'ngay_vao_lam',
      key: 'ngay_vao_lam',
      render: (date) => (date ? dayjs(date).format('DD/MM/YYYY') : 'N/A'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      render: (status) => (
        <span style={{ color: status ? '#1890ff' : '#ff4d4f', fontWeight: 'bold' }}>
          {status ? 'Đang làm' : 'Đã nghỉ'}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<InfoCircleOutlined />} onClick={() => handleViewDetails(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '24px',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <h2 style={{ margin: 0, fontSize: '24px', color: '#262626' }}>Quản lý Nhân viên</h2>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAdd}
          >
            Thêm Nhân viên
          </Button>
        </div>

        <Card>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={employees}
              rowKey="id"
              bordered
              size="middle"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} mục`,
              }}
            />
          </Spin>
        </Card>
      </div>

      <Modal
        title={editingEmployee ? 'Sửa Nhân viên' : 'Thêm Nhân viên'}
        open={isEditModalOpen}
        onOk={handleOk}
        onCancel={() => setIsEditModalOpen(false)}
        confirmLoading={modalLoading}
        destroyOnClose
        width={700}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true }]} style={{ flex: '1 1 48%' }}>
              <Input />
            </Form.Item>
            <Form.Item name="tai_khoan" label="Tài khoản" rules={[{ required: true }]} style={{ flex: '1 1 48%' }}>
              <Input disabled={editingEmployee !== null} />
            </Form.Item>
            <Form.Item name="mat_khau" label="Mật khẩu"
              rules={!editingEmployee ? [{ required: true }] : []}
              style={{ flex: '1 1 48%' }}>
              <Input.Password placeholder={editingEmployee ? "Để trống nếu không thay đổi" : ""} />
            </Form.Item>
            <Form.Item name="vai_tro" label="Vai trò" rules={[{ required: true }]} style={{ flex: '1 1 48%' }}>
              <Select placeholder="Chọn vai trò">
                <Option value="quan_ly">Quản lý</Option>
                <Option value="thu_ngan">Thu ngân</Option>
                <Option value="nhan_vien_kho">Nhân viên kho</Option>
              </Select>
            </Form.Item>
            <Form.Item name="so_dien_thoai" label="Số điện thoại" style={{ flex: '1 1 48%' }}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ type: 'email' }]} style={{ flex: '1 1 48%' }}>
              <Input />
            </Form.Item>
            <Form.Item name="dia_chi" label="Địa chỉ" style={{ flex: '1 1 100%' }}>
              <Input />
            </Form.Item>
            <Form.Item name="ngay_sinh" label="Ngày sinh" style={{ flex: '1 1 48%' }}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="ngay_vao_lam" label="Ngày vào làm" style={{ flex: '1 1 48%' }}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="trang_thai" label="Trạng thái" rules={[{ required: true }]} style={{ flex: '1 1 48%' }}>
              <Select placeholder="Chọn trạng thái">
                <Option value={true}>Đang làm</Option>
                <Option value={false}>Đã nghỉ</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Thông tin chi tiết Nhân viên"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedEmployee && (
          <Descriptions bordered column={1} size="middle" style={{ marginTop: '20px', fontSize: '16px' }}>
            <Descriptions.Item label="ID">{selectedEmployee.id}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{selectedEmployee.ho_ten}</Descriptions.Item>
            <Descriptions.Item label="Tài khoản">{selectedEmployee.tai_khoan}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">{selectedEmployee.vai_tro}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selectedEmployee.trang_thai ? 'Đang làm' : 'Đã nghỉ'}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedEmployee.so_dien_thoai || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedEmployee.dia_chi || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedEmployee.email || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {selectedEmployee.ngay_sinh ? dayjs(selectedEmployee.ngay_sinh).format('DD/MM/YYYY') : 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày vào làm">
              {selectedEmployee.ngay_vao_lam ? dayjs(selectedEmployee.ngay_vao_lam).format('DD/MM/YYYY') : 'Chưa cập nhật'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </MainLayout>
  );
};

export default EmployeeManagement;
