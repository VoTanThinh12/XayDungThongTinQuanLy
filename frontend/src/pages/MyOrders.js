import React, { useEffect, useMemo, useState } from "react";
import {
  DatePicker,
  Table,
  Button,
  Space,
  message,
  Typography,
  Modal,
  Card,
  Statistic,
  Badge,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  ReloadOutlined,
  EyeOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../utils/api";

const { Text } = Typography;

const MyOrders = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(dayjs());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  const load = async (d) => {
    const theDate = d || date;
    setLoading(true);
    try {
      const res = await api.get("/hoadonban/cua-toi", {
        params: { date: theDate.format("YYYY-MM-DD") },
      });
      setRows(res.data || []);
    } catch (e) {
      message.error(e.response?.data?.error || "Không tải được danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date); /* eslint-disable-next-line */
  }, []);

  const totals = useMemo(() => {
    const count = rows.length;
    const sum = rows.reduce((s, r) => s + Number(r.tong_tien || 0), 0);
    return { count, sum };
  }, [rows]);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      width: 100,
      render: (text) => (
        <Badge count={`#${text}`} style={{ backgroundColor: "#1890ff" }} />
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "ngay_ban",
      width: 180,
      render: (v) => (
        <div>
          <div style={{ fontWeight: "600", color: "#1890ff" }}>
            {new Date(v).toLocaleDateString()}
          </div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
            {new Date(v).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tong_tien",
      align: "right",
      width: 140,
      render: (v) => (
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#52c41a" }}>
          {Number(v).toLocaleString()}₫
        </div>
      ),
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, r) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setDetailOrder(r);
            setDetailOpen(true);
          }}
          style={{
            borderRadius: "6px",
            backgroundColor: "#1890ff",
            border: "none",
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Card */}
        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid #d9d9d9",
            marginBottom: "24px",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <div
            style={{
              background: "#1890ff",
              margin: "-24px -24px 24px -24px",
              padding: "16px 24px",
              borderRadius: "8px 8px 0 0",
              color: "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button
                type="text"
                onClick={() => navigate("/pos")}
                style={{ color: "white", padding: 0 }}
              >
                <ArrowLeftOutlined style={{ fontSize: 18, marginRight: 6 }} />{" "}
                Quay lại
              </Button>
              <h2
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                <FileTextOutlined style={{ marginRight: "12px" }} />
                📋 Đơn hàng của tôi
              </h2>
            </div>
          </div>

          <Space
            size="large"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Space size="middle">
              <div>
                <CalendarOutlined
                  style={{
                    fontSize: "16px",
                    color: "#1890ff",
                    marginRight: "8px",
                  }}
                />
                <DatePicker
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                    load(d);
                  }}
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => load(date)}
                size="large"
                style={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%)",
                  border: "none",
                  color: "#8b4513",
                  fontWeight: "500",
                }}
              >
                Làm mới
              </Button>
            </Space>

            {/* Statistics */}
            <Space size="large">
              <Statistic
                title={
                  <span style={{ color: "#722ed1", fontWeight: "500" }}>
                    <ShoppingOutlined /> Số đơn
                  </span>
                }
                value={totals.count}
                valueStyle={{
                  color: "#722ed1",
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              />
              <Divider type="vertical" style={{ height: "60px" }} />
              <Statistic
                title={
                  <span style={{ color: "#52c41a", fontWeight: "500" }}>
                    <DollarOutlined /> Doanh thu
                  </span>
                }
                value={totals.sum}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "24px",
                  fontWeight: "700",
                }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₫"
                }
              />
            </Space>
          </Space>
        </Card>

        {/* Table Card */}
        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "none",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <Table
            rowKey="id"
            loading={loading}
            dataSource={rows}
            columns={columns}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          />
        </Card>
      </div>

      {/* Modal chi tiết hóa đơn hiện đại */}
      <Modal
        title={
          <div
            style={{
              background: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)",
              margin: "-24px -24px 24px -24px",
              padding: "20px 24px",
              color: "white",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            <TrophyOutlined style={{ marginRight: "12px", fontSize: "24px" }} />
            {detailOrder
              ? `🧾 Chi tiết đơn #${detailOrder.id}`
              : "Chi tiết hóa đơn"}
          </div>
        }
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setDetailOrder(null);
        }}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ padding: "24px" }}
      >
        {detailOrder ? (
          <div
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              padding: "24px",
              borderRadius: "12px",
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  backgroundColor: "white",
                  padding: "16px",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <Text strong style={{ color: "#722ed1" }}>
                    👤 Thu ngân:
                  </Text>
                  <br />
                  <Text style={{ fontSize: "16px" }}>
                    {detailOrder.nhan_vien?.ho_ten || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ color: "#722ed1" }}>
                    🕐 Thời gian:
                  </Text>
                  <br />
                  <Text style={{ fontSize: "16px" }}>
                    {new Date(detailOrder.ngay_ban).toLocaleString()}
                  </Text>
                </div>
              </div>

              <Table
                rowKey={(r) => `${r.id}-${r.id_san_pham}`}
                dataSource={detailOrder.chi_tiet_hoa_don_ban || []}
                pagination={false}
                size="middle"
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                columns={[
                  {
                    title: "Sản phẩm",
                    dataIndex: ["san_pham", "ten_san_pham"],
                    render: (text) => (
                      <Text strong style={{ color: "#1890ff" }}>
                        {text}
                      </Text>
                    ),
                  },
                  {
                    title: "SL",
                    dataIndex: "so_luong",
                    align: "center",
                    width: 80,
                    render: (text) => (
                      <Badge
                        count={text}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    ),
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "don_gia",
                    align: "right",
                    width: 120,
                    render: (v) => (
                      <Text style={{ color: "#fa8c16", fontWeight: "500" }}>
                        {Number(v).toLocaleString()}₫
                      </Text>
                    ),
                  },
                  {
                    title: "Thành tiền",
                    align: "right",
                    width: 140,
                    render: (_, r) => (
                      <Text
                        style={{
                          color: "#52c41a",
                          fontWeight: "600",
                          fontSize: "15px",
                        }}
                      >
                        {(Number(r.don_gia) * r.so_luong).toLocaleString()}₫
                      </Text>
                    ),
                  },
                ]}
              />

              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "right",
                }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div style={{ fontSize: "18px" }}>
                    <Text strong style={{ color: "#1890ff" }}>
                      💰 Tổng tiền:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#f5222d",
                      }}
                    >
                      {Number(detailOrder.tong_tien).toLocaleString()}₫
                    </Text>
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    <Text strong style={{ color: "#52c41a" }}>
                      💵 Tiền khách đưa:{" "}
                    </Text>
                    <Text style={{ fontWeight: "600" }}>
                      {Number(detailOrder.tien_khach_dua).toLocaleString()}₫
                    </Text>
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      padding: "12px",
                      backgroundColor: "#f6ffed",
                      borderRadius: "6px",
                      border: "1px solid #b7eb8f",
                    }}
                  >
                    <Text strong style={{ color: "#389e0d" }}>
                      💸 Tiền thối:{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#389e0d",
                      }}
                    >
                      {Number(detailOrder.tien_thoi).toLocaleString()}₫
                    </Text>
                  </div>
                </Space>
              </div>
            </Space>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            Không có chi tiết
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOrders;
