// import React from 'react';
// import { Layout, Menu, theme } from 'antd';
// import {
//   UserOutlined,
//   ShoppingOutlined,
//   BarChartOutlined,
//   FileTextOutlined,
//   DashboardOutlined
// } from '@ant-design/icons';
// import { useNavigate, useLocation } from 'react-router-dom';

// const { Sider, Content } = Layout;

// const MainLayout = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation(); // ✅ để biết đường dẫn hiện tại
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   const menuItems = [
//     { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
//     { key: '/sanpham', icon: <ShoppingOutlined />, label: 'Quản lý Sản phẩm' },
//     { key: '/nhanvien', icon: <UserOutlined />, label: 'Quản lý Nhân viên' },
//     {
//       key: 'baocao-sub',
//       icon: <BarChartOutlined />,
//       label: 'Báo cáo & Thống kê',
//       children: [
//         { key: '/baocao/doanhthu', label: 'Doanh thu' },
//         { key: '/baocao/tonkho', label: 'Tồn kho' },
//         { key: '/baocao/hieusuatnhanvien', label: 'Hiệu suất nhân viên' },
//       ],
//     },
//     { key: '/hoadonban', icon: <FileTextOutlined />, label: 'Hóa đơn bán' },
//     { key: '/logout', label: 'Đăng xuất', onClick: handleLogout },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider collapsible>
//         <div className="demo-logo-vertical" />
//         <Menu
//           theme="dark"
//           mode="inline"
//           selectedKeys={[location.pathname]} // ✅ luôn highlight đúng mục đang mở
//           items={menuItems}
//           onClick={({ key }) => {
//             if (key !== 'baocao-sub' && key !== '/logout') {
//               navigate(key);
//             }
//           }}
//         />
//       </Sider>
//       <Layout>
//         <Content style={{ margin: '24px 16px' }}>
//           <div
//             style={{
//               padding: 24,
//               minHeight: 360,
//               background: colorBgContainer,
//               borderRadius: borderRadiusLG,
//             }}
//           >
//             {children}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default MainLayout;
import React from "react";
import { Layout, Menu, theme } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const role = localStorage.getItem("role");
  const menuItems =
    role === "thu_ngan"
      ? [
          { key: "/pos", icon: <ShoppingOutlined />, label: "Bán hàng (POS)" },
          {
            key: "/pos/orders",
            icon: <BarChartOutlined />,
            label: "Đơn của tôi",
          },
          { key: "/logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
        ]
      : [
          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
          {
            key: "/sanpham",
            icon: <ShoppingOutlined />,
            label: "Quản lý Sản phẩm",
          },
          {
            key: "/nhanvien",
            icon: <UserOutlined />,
            label: "Quản lý Nhân viên",
          },
          {
            key: "/hoadonban",
            icon: <FileTextOutlined />,
            label: "Hóa đơn bán",
          },
          {
            key: "/baocao",
            icon: <BarChartOutlined />,
            label: "Báo cáo & Thống kê",
          },
          { key: "/logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
        ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            padding: "12px 0",
            fontWeight: 600,
          }}
        >
          CỬA HÀNG
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            if (key === "/logout") return handleLogout();
            if (key !== "baocao-sub") navigate(key);
          }}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "24px 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
