// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './Login';
// import ProductManagement from './ProductManagement';
// import EmployeeManagement from './EmployeeManagement';
// import RevenueReport from './reports/RevenueReport';
// import InventoryReport from './reports/InventoryReport';
// import EmployeePerformanceReport from './reports/EmployeePerformanceReport';
// import PrivateRoute from '../utils/PrivateRoute';
// import Hoadonban from './Hoadonban';
// import Dashboard from './Dashboard'; // ✅ import Dashboard

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* ✅ đổi mặc định sang dashboard */}

//         {/* Dashboard */}
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute roles={['quan_ly', 'thu_ngan', 'nhan_vien_kho']}>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />

//         {/* Các route báo cáo */}
//         <Route
//           path="/baocao"
//           element={
//             <PrivateRoute roles={['quan_ly']}>
//               <RevenueReport />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/baocao/doanhthu"
//           element={
//             <PrivateRoute roles={['quan_ly']}>
//               <RevenueReport />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/baocao/tonkho"
//           element={
//             <PrivateRoute roles={['quan_ly', 'nhan_vien_kho']}>
//               <InventoryReport />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/baocao/hieusuatnhanvien"
//           element={
//             <PrivateRoute roles={['quan_ly']}>
//               <EmployeePerformanceReport />
//             </PrivateRoute>
//           }
//         />

//         {/* Quản lý sản phẩm */}
//         <Route
//           path="/sanpham"
//           element={
//             <PrivateRoute roles={['quan_ly']}>
//               <ProductManagement />
//             </PrivateRoute>
//           }
//         />

//         {/* Quản lý nhân viên */}
//         <Route
//           path="/nhanvien"
//           element={
//             <PrivateRoute roles={['quan_ly']}>
//               <EmployeeManagement />
//             </PrivateRoute>
//           }
//         />

//         {/* Hóa đơn bán */}
//         <Route
//           path="/hoadonban"
//           element={
//             <PrivateRoute roles={['quan_ly']}>
//               <Hoadonban />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ProductManagement from "./ProductManagement";
import EmployeeManagement from "./EmployeeManagement";
import RevenueReport from "./reports/RevenueReport";
import InventoryReport from "./reports/InventoryReport";
import EmployeePerformanceReport from "./reports/EmployeePerformanceReport";
import PrivateRoute from "../utils/PrivateRoute";
import Hoadonban from "./Hoadonban";
import Dashboard from "./Dashboard";
import Pos from "./Pos"; // ✅ mới
import MyOrders from "./MyOrders"; // ✅ mới

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              roles={["quan_ly", "thu_ngan", "nhan_vien_kho", "nhan_vien"]}
            >
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* POS cho thu ngân */}
        <Route
          path="/pos"
          element={
            <PrivateRoute roles={["thu_ngan"]}>
              <Pos />
            </PrivateRoute>
          }
        />

        {/* Đơn của tôi */}
        <Route
          path="/pos/orders"
          element={
            <PrivateRoute roles={["thu_ngan"]}>
              <MyOrders />
            </PrivateRoute>
          }
        />

        {/* Báo cáo (quản lý) */}
        <Route
          path="/baocao"
          element={
            <PrivateRoute roles={["quan_ly"]}>
              <RevenueReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/baocao/doanhthu"
          element={
            <PrivateRoute roles={["quan_ly"]}>
              <RevenueReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/baocao/tonkho"
          element={
            <PrivateRoute roles={["quan_ly"]}>
              <InventoryReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/baocao/hieu-suat-nhan-vien"
          element={
            <PrivateRoute roles={["quan_ly"]}>
              <EmployeePerformanceReport />
            </PrivateRoute>
          }
        />

        {/* Quản lý sản phẩm / nhân viên / hóa đơn (quản lý) */}
        <Route
          path="/sanpham"
          element={
            <PrivateRoute roles={["quan_ly"]}>
              <ProductManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/nhanvien"
          element={
            <PrivateRoute roles={["quan_ly"]}>
              <EmployeeManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hoadonban"
          element={
            <PrivateRoute roles={["quan_ly"]}>
              <Hoadonban />
            </PrivateRoute>
          }
        />

        {/* Mặc định */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
