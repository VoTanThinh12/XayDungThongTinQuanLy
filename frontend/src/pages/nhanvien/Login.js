import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
// import api from "../../utils/api"; // không dùng backend nữa
import MainLayout from "../../components/MainLayout";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // fake login demo
      if (values.tai_khoan === "admin" && values.mat_khau === "admin") {
        const fakeUser = {
          token: "demo-token",
          nhanVien: {
            id: 1,
            ho_ten: "Admin Demo",
            tai_khoan: "admin",
            vai_tro: "quan_ly",
          },
        };

        localStorage.setItem("token", fakeUser.token);
        localStorage.setItem("role", fakeUser.nhanVien.vai_tro);
        localStorage.setItem("nvId", fakeUser.nhanVien.id);
        localStorage.setItem("ho_ten", fakeUser.nhanVien.ho_ten);
        localStorage.setItem("tai_khoan", fakeUser.nhanVien.tai_khoan);

        message.success("Đăng nhập thành công");

        const role = fakeUser.nhanVien.vai_tro.toLowerCase();
        navigate(role === "thu_ngan" ? "/pos" : "/dashboard");
      } else {
        message.error("Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      message.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card title="Đăng nhập hệ thống" style={{ width: 400 }}>
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="tai_khoan"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input placeholder="Tài khoản" />
          </Form.Item>

          <Form.Item
            name="mat_khau"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;