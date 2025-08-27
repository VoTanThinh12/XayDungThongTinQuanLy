import React, { useEffect, useMemo, useState } from "react";
import {
  Input,
  Table,
  Button,
  Card,
  InputNumber,
  message,
  Space,
  Modal,
  Typography,
} from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const { Text } = Typography;
const plusSteps = [10000, 20000, 50000, 100000, 200000, 500000];
const minusSteps = [-10000, -20000, -50000, -100000, -200000, -500000];

// chuẩn hoá chuỗi để tìm kiếm không dấu
const norm = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const Pos = () => {
  const [q, setQ] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cash, setCash] = useState(0);
  const [successModal, setSuccessModal] = useState({
    open: false,
    invoice: null,
    cash: 0,
    change: 0,
  });

  const navigate = useNavigate();
  const hoTen =
    localStorage.getItem("ho_ten") ||
    localStorage.getItem("tai_khoan") ||
    "Nhân viên";

  // Lấy toàn bộ sản phẩm một lần (không phân trang)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/sanpham");
        setProducts(res.data || []);
      } catch {
        message.error("Không tải được danh sách sản phẩm");
      }
    })();
  }, []);

  // Lọc theo từ khóa (có hỗ trợ không dấu)
  const filtered = useMemo(() => {
    const key = norm(q.trim());
    if (!key) return products;
    return products.filter(
      (p) =>
        norm(p.ten_san_pham).includes(key) || norm(p.ma_san_pham).includes(key)
    );
  }, [q, products]);

  const addToCart = (sp) => {
    setCart((prev) => {
      const exist = prev.find((x) => x.id === sp.id);
      if (exist)
        return prev.map((x) =>
          x.id === sp.id ? { ...x, so_luong: x.so_luong + 1 } : x
        );
      return [
        ...prev,
        {
          id: sp.id,
          ten: sp.ten_san_pham,
          don_gia: Number(sp.gia_ban),
          so_luong: 1,
        },
      ];
    });
  };
  const updateQty = (id, qty) =>
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, so_luong: qty || 1 } : x))
    );
  const removeItem = (id) => setCart((prev) => prev.filter((x) => x.id !== id));
  const total = useMemo(
    () => cart.reduce((s, x) => s + x.don_gia * x.so_luong, 0),
    [cart]
  );
  const change = useMemo(
    () => Math.max(0, Number(cash) - total),
    [cash, total]
  );
  const addMoney = (m) => setCash((prev) => Math.max(0, Number(prev || 0) + m));

  const checkout = async () => {
    if (!cart.length) return message.warning("Chưa có hàng trong giỏ");
    try {
      const nvId = localStorage.getItem("nvId");
      const body = {
        id_nhan_vien: Number(nvId) || 0, // BE sẽ override nếu role là thu_ngan
        danhSachSanPham: cart.map((x) => ({
          id_san_pham: x.id,
          so_luong: x.so_luong,
          don_gia: x.don_gia,
        })),
      };
      const res = await api.post("/hoadonban/tao", body);
      const invoice = res.data; // include nhan_vien + chi_tiet_hoa_don_ban[{san_pham}]

      // Hiện hóa đơn (không in)
      setSuccessModal({
        open: true,
        invoice,
        cash: Number(cash),
        change: Number(change),
      });

      // Reset giỏ
      setCart([]);
      setCash(0);
    } catch (e) {
      message.error(e.response?.data?.error || "Tạo hoá đơn thất bại");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", // ✅ tránh tràn ngang
        gap: 16,
        overflowX: "hidden", // ✅ chặn cuộn ngang vô hạn
      }}
    >
      {/* CỘT TRÁI: Sản phẩm + nút Đơn hôm nay */}
      <Card
        title={
          <Space align="center" style={{ width: "100%" }}>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên / mã SP (gõ không dấu được)"
              allowClear
              style={{ maxWidth: 360 }}
            />
            <Text type="secondary">
              Tìm thấy: <b>{filtered.length}</b>/<b>{products.length}</b> SP
            </Text>
          </Space>
        }
      >
        <Table
          tableLayout="fixed" // ✅ bảng cố định, không đẩy rộng ngoài khung
          rowKey="id"
          size="small"
          dataSource={filtered}
          columns={[
            { title: "Mã", dataIndex: "ma_san_pham", width: 120 },
            { title: "Tên", dataIndex: "ten_san_pham", ellipsis: true }, // ✅ tên dài sẽ …, không kéo rộng
            {
              title: "Giá",
              dataIndex: "gia_ban",
              render: (v) => Number(v).toLocaleString(),
              align: "right",
              width: 120,
            },
            {
              title: "",
              render: (_, sp) => (
                <Button onClick={() => addToCart(sp)}>Chọn</Button>
              ),
              width: 80,
            },
          ]}
          pagination={false} // ✅ không phân trang
          scroll={{ y: 420, x: "max-content" }} // ✅ cuộn dọc ổn định
          style={{ width: "100%" }}
        />

        {/* Nút Đơn hôm nay ở dưới danh sách sản phẩm */}
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <Button type="default" onClick={() => navigate("/pos/orders")}>
            Đơn hôm nay
          </Button>
        </div>
      </Card>

      {/* CỘT PHẢI: Giỏ hàng */}
      <Card
        title={
          <Space>
            <UserOutlined />
            <b>{hoTen}</b>
          </Space>
        }
        extra={
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Đăng xuất
          </Button>
        }
      >
        <Table
          tableLayout="fixed"
          rowKey="id"
          size="small"
          dataSource={cart}
          columns={[
            { title: "Sản phẩm", dataIndex: "ten", ellipsis: true },
            {
              title: "SL",
              render: (_, x) => (
                <InputNumber
                  min={1}
                  value={x.so_luong}
                  onChange={(v) => updateQty(x.id, v)}
                />
              ),
              width: 120,
              align: "right",
            },
            {
              title: "Đơn giá",
              dataIndex: "don_gia",
              render: (v) => Number(v).toLocaleString(),
              width: 120,
              align: "right",
            },
            {
              title: "Thành tiền",
              render: (_, x) => (x.so_luong * x.don_gia).toLocaleString(),
              width: 140,
              align: "right",
            },
            {
              title: "",
              render: (_, x) => (
                <Button danger onClick={() => removeItem(x.id)}>
                  Xoá
                </Button>
              ),
              width: 80,
            },
          ]}
          pagination={false}
        />

        <div style={{ marginTop: 12, textAlign: "right" }}>
          <div>
            <b>Tổng:</b> {total.toLocaleString()} đ
          </div>

          <div style={{ marginTop: 8 }}>
            Tiền khách đưa:{" "}
            <InputNumber value={cash} onChange={setCash} min={0} step={10000} />
          </div>

          {/* Nút tiền nhanh: âm */}
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {minusSteps.map((m) => (
              <Button key={m} onClick={() => addMoney(m)}>
                -{Math.abs(m).toLocaleString()}
              </Button>
            ))}
          </div>

          {/* Nút tiền nhanh: dương */}
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {plusSteps.map((m) => (
              <Button key={m} onClick={() => addMoney(m)}>
                +{m.toLocaleString()}
              </Button>
            ))}
          </div>

          <div style={{ marginTop: 8 }}>
            <b>Tiền thối:</b> {change.toLocaleString()} đ
          </div>
          <Button type="primary" style={{ marginTop: 12 }} onClick={checkout}>
            THANH TOÁN
          </Button>
        </div>
      </Card>

      {/* MODAL HÓA ĐƠN (chỉ hiển thị thông tin, không có nút in) */}
      <Modal
        title="Hóa đơn"
        open={successModal.open}
        onCancel={() =>
          setSuccessModal({ open: false, invoice: null, cash: 0, change: 0 })
        }
        footer={[
          <Button
            key="orders"
            onClick={() => {
              setSuccessModal({
                open: false,
                invoice: null,
                cash: 0,
                change: 0,
              });
              navigate("/pos/orders");
            }}
          >
            Xem Đơn hôm nay
          </Button>,
        ]}
        width={720}
      >
        {successModal.invoice && (
          <>
            <p>
              <b>Mã HĐ:</b> #{successModal.invoice.id}
            </p>
            <p>
              <b>Thu ngân:</b> {successModal.invoice.nhan_vien?.ho_ten || hoTen}
            </p>
            <p>
              <b>Ngày:</b>{" "}
              {new Date(successModal.invoice.ngay_ban).toLocaleString()}
            </p>

            {/* BẢNG SẢN PHẨM ĐÃ MUA */}
            <Table
              tableLayout="fixed"
              rowKey={(r) => `${r.id}-${r.id_san_pham}`}
              dataSource={successModal.invoice.chi_tiet_hoa_don_ban || []}
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Sản phẩm",
                  dataIndex: ["san_pham", "ten_san_pham"],
                  ellipsis: true,
                },
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
              <div>
                <b>Tổng tiền:</b>{" "}
                {Number(successModal.invoice.tong_tien).toLocaleString()} đ
              </div>
              <div>
                <b>Tiền khách đưa:</b>{" "}
                {Number(successModal.cash).toLocaleString()} đ
              </div>
              <div>
                <b>Tiền thối:</b> {Number(successModal.change).toLocaleString()}{" "}
                đ
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Pos;
