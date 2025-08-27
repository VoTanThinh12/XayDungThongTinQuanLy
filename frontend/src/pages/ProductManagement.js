import React, { memo, useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm,
  Space, Card 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';

const ProductManagement = memo(() => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Bạn cần đăng nhập để xem danh sách sản phẩm!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/sanpham');
      setProducts(response.data);
    } catch (error) {
      console.error('Fetch products error:', error);
      message.error(error.response?.data?.error || 'Lỗi khi tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = useCallback(() => {
    setEditingProduct(null);
    setIsModalVisible(true);
    form.resetFields();
  }, [form]);

  const handleEdit = useCallback((record) => {
    setEditingProduct(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...record,
      gia_ban: parseFloat(record.gia_ban),
      so_luong: parseInt(record.so_luong),
    });
  }, [form]);

  const handleDelete = useCallback(async (id) => {
    try {
      await api.delete(`/sanpham/${id}`);
      message.success('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      console.error('Delete product error:', error);
      message.error(error.response?.data?.error || 'Lỗi khi xóa sản phẩm.');
    }
  }, [fetchProducts]);

  const handleOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        await api.put(`/sanpham/${editingProduct.id}`, values);
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        await api.post('/sanpham', values);
        message.success('Thêm sản phẩm thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('Save product error:', error);
      message.error(error.response?.data?.error || 'Lỗi khi lưu sản phẩm.');
    }
  }, [form, editingProduct, fetchProducts]);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  }, [form]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }, []);

  // Lọc sản phẩm theo tìm kiếm
  const filteredProducts = products.filter(
    (p) =>
      p.ten_san_pham.toLowerCase().includes(searchText.toLowerCase()) ||
      p.ma_san_pham.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'ma_san_pham',
      key: 'ma_san_pham',
      width: 120,
      render: (text) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'ten_san_pham',
      key: 'ten_san_pham',
      ellipsis: true,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'don_vi_tinh',
      key: 'don_vi_tinh',
      width: 100,
      align: 'center',
    },
    {
      title: 'Giá bán',
      dataIndex: 'gia_ban',
      key: 'gia_ban',
      width: 140,
      align: 'right',
      sorter: (a, b) => a.gia_ban - b.gia_ban,
      render: (price) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'so_luong',
      key: 'so_luong',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.so_luong - b.so_luong,
      render: (quantity) => (
        <span style={{ 
          fontWeight: 'bold',
          color: quantity > 0 ? '#1890ff' : '#ff4d4f' 
        }}>
          {quantity}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            ghost 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <h2 style={{ margin: 0, fontSize: '24px', color: '#262626' }}>
              Quản lý Sản phẩm
            </h2>
          </div>

          {/* Ô tìm kiếm */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250, marginRight: 16 }}
          />
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAdd}
          >
            Thêm Sản phẩm
          </Button>
        </div>

        <Card>
          <Table 
            columns={columns} 
            dataSource={filteredProducts} 
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} sản phẩm`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingOutlined />
              {editingProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}
            </div>
          }
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={600}
          okText={editingProduct ? 'Cập nhật' : 'Thêm mới'}
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
            <Form.Item 
              name="ten_san_pham" 
              label="Tên sản phẩm" 
              rules={[
                { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                { min: 2, message: 'Tên sản phẩm phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item 
              name="ma_san_pham" 
              label="Mã sản phẩm" 
              rules={[
                { required: true, message: 'Vui lòng nhập mã sản phẩm!' },
                { pattern: /^[A-Z0-9]+$/, message: 'Mã sản phẩm chỉ được chứa chữ hoa và số!' }
              ]}
            >
              <Input 
                placeholder="VD: SP001" 
                style={{ fontFamily: 'monospace' }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  form.setFieldValue('ma_san_pham', value);
                }}
              />
            </Form.Item>

            <Form.Item 
              name="don_vi_tinh" 
              label="Đơn vị tính" 
              rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính!' }]}
            >
              <Input placeholder="VD: Cái, Kg, Hộp, ..." />
            </Form.Item>

            <Form.Item 
              name="gia_ban" 
              label="Giá bán (VNĐ)" 
              rules={[
                { required: true, message: 'Vui lòng nhập giá bán!' },
                { type: 'number', min: 1000, message: 'Giá bán phải lớn hơn 1.000 VNĐ!' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="Nhập giá bán"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                min={1000}
                step={1000}
              />
            </Form.Item>

            <Form.Item 
              name="so_luong" 
              label="Số lượng tồn kho" 
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng!' },
                { type: 'number', min: 0, message: 'Số lượng không được âm!' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="Nhập số lượng"
                min={0}
                precision={0}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
});

ProductManagement.displayName = 'ProductManagement';
export default ProductManagement;
