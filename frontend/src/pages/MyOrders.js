import React, { useEffect, useMemo, useState } from "react";
import {
  DatePicker,
  Table,
  Button,
  Space,
  message,
  Typography,
  Modal,
} from "antd";
import dayjs from "dayjs";
import api from "../utils/api";

const { Text } = Typography;

const MyOrders = () => {
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
    { title: "Mã", dataIndex: "id", width: 90 },
    {
      title: "Thời gian",
      dataIndex: "ngay_ban",
      width: 180,
      render: (v) => new Date(v).toLocaleString(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tong_tien",
      align: "right",
      width: 140,
      render: (v) => Number(v).toLocaleString(),
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, r) => (
        <Space>
          <Button
            onClick={() => {
              setDetailOrder(r);
              setDetailOpen(true);
            }}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <DatePicker
          value={date}
          onChange={(d) => {
            setDate(d);
            load(d);
          }}
        />
        <Button onClick={() => load(date)}>Làm mới</Button>
        <Text type="secondary">
          Đơn: <b>{totals.count}</b> • Doanh thu:{" "}
          <b>{totals.sum.toLocaleString()} đ</b>
        </Text>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={rows}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal chi tiết hóa đơn (không có nút in) */}
      <Modal
        title={
          detailOrder
            ? `Chi tiết hóa đơn #${detailOrder.id}`
            : "Chi tiết hóa đơn"
        }
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setDetailOrder(null);
        }}
        footer={null}
        width={720}
      >
        {detailOrder ? (
          <>
            <p>
              <b>Thu ngân:</b> {detailOrder.nhan_vien?.ho_ten || ""}
            </p>
            <p>
              <b>Thời gian:</b>{" "}
              {new Date(detailOrder.ngay_ban).toLocaleString()}
            </p>

            <Table
              rowKey={(r) => `${r.id}-${r.id_san_pham}`}
              dataSource={detailOrder.chi_tiet_hoa_don_ban || []}
              pagination={false}
              size="small"
              columns={[
                { title: "Sản phẩm", dataIndex: ["san_pham", "ten_san_pham"] },
                {
                  title: "SL",
                  dataIndex: "so_luong",
                  align: "right",
                  width: 80,
                },
                {
                  title: "Đơn giá",
                  dataIndex: "don_gia",
                  align: "right",
                  width: 120,
                  render: (v) => Number(v).toLocaleString(),
                },
                {
                  title: "Thành tiền",
                  align: "right",
                  width: 140,
                  render: (_, r) =>
                    (Number(r.don_gia) * r.so_luong).toLocaleString(),
                },
              ]}
            />

            <div style={{ marginTop: 10, textAlign: "right" }}>
              <b>Tổng tiền:</b> {Number(detailOrder.tong_tien).toLocaleString()}{" "}
              đ
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default MyOrders;
