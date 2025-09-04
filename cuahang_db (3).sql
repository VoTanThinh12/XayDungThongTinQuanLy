-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 04, 2025 lúc 03:47 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cuahang_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ca_lam`
--

CREATE TABLE `ca_lam` (
  `id` int(11) NOT NULL,
  `id_nhan_vien` int(11) NOT NULL,
  `start_time` datetime DEFAULT current_timestamp(),
  `end_time` datetime DEFAULT NULL,
  `total_orders` int(11) DEFAULT 0,
  `total_revenue` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_hoa_don_ban`
--

CREATE TABLE `chi_tiet_hoa_don_ban` (
  `id` int(11) NOT NULL,
  `id_hoa_don` int(11) DEFAULT NULL,
  `id_san_pham` int(11) DEFAULT NULL,
  `so_luong` int(11) DEFAULT NULL,
  `don_gia` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_hoa_don_ban`
--

INSERT INTO `chi_tiet_hoa_don_ban` (`id`, `id_hoa_don`, `id_san_pham`, `so_luong`, `don_gia`) VALUES
(208, 77, 37, 1, 36000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_phieu_nhap`
--

CREATE TABLE `chi_tiet_phieu_nhap` (
  `id` int(11) NOT NULL,
  `id_phieu_nhap` int(11) DEFAULT NULL,
  `id_san_pham` int(11) DEFAULT NULL,
  `so_luong_nhap` int(11) DEFAULT NULL,
  `gia_nhap` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoa_don_ban`
--

CREATE TABLE `hoa_don_ban` (
  `id` int(11) NOT NULL,
  `id_nhan_vien` int(11) DEFAULT NULL,
  `ngay_ban` datetime DEFAULT current_timestamp(),
  `tong_tien` decimal(10,2) DEFAULT NULL,
  `tien_khach_dua` decimal(15,2) DEFAULT 0.00,
  `tien_thoi` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hoa_don_ban`
--

INSERT INTO `hoa_don_ban` (`id`, `id_nhan_vien`, `ngay_ban`, `tong_tien`, `tien_khach_dua`, `tien_thoi`) VALUES
(77, 2, '2025-09-04 13:26:35', 36000.00, 100000.00, 64000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhan_vien`
--

CREATE TABLE `nhan_vien` (
  `id` int(11) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `tai_khoan` varchar(50) NOT NULL,
  `mat_khau` varchar(100) NOT NULL,
  `vai_tro` enum('quan_ly','thu_ngan','nhan_vien_kho') NOT NULL DEFAULT 'quan_ly',
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `ngay_vao_lam` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nhan_vien`
--

INSERT INTO `nhan_vien` (`id`, `ho_ten`, `tai_khoan`, `mat_khau`, `vai_tro`, `trang_thai`, `so_dien_thoai`, `dia_chi`, `email`, `ngay_sinh`, `ngay_vao_lam`) VALUES
(1, 'Quản Lý Chính', 'admin', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '0987654321', NULL, 'admin@example.com', NULL, NULL),
(2, 'Trần Thu Ngân', 'thungan', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '0912345679', NULL, 'thungan@example.com', NULL, NULL),
(3, 'Lê Khoa Học', 'nhanvienkho', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '0912345680', NULL, 'nhanvienkho@example.com', NULL, NULL),
(4, 'Phạm Hải Yến 4', 'nv4', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09514525588', '68 Đường d, Hà Nội', 'nv4@example.com', '1981-01-14', '2023-12-28'),
(5, 'Lê Văn Thành 5', 'nv5', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09603375987', '43 Đường e, Cần Thơ', 'nv5@example.com', '1996-04-08', '2023-04-20'),
(6, 'Vũ Hoàng Long 6', 'nv6', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09797199711', '42 Đường f, Hải Phòng', 'nv6@example.com', '1995-02-20', '2021-03-02'),
(7, 'Trần Thu Hằng 7', 'nv7', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09783121668', '54 Đường g, Đà Nẵng', 'nv7@example.com', '1992-10-18', '2021-12-21'),
(8, 'Bùi Duy Nam 8', 'nv8', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09448443210', '21 Đường h, Hà Nội', 'nv8@example.com', '1995-10-27', '2024-09-18'),
(9, 'Hoàng Thúy Nga 9', 'nv9', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09462828433', '100 Đường i, TP.HCM', 'nv9@example.com', '1991-03-22', '2021-09-23'),
(10, 'Đặng Quang Huy 10', 'nv10', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09624334072', '50 Đường j, Hà Nội', 'nv10@example.com', '1990-11-06', '2022-10-16'),
(11, 'Ngô Đức Minh 11', 'nv11', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09308862563', '78 Đường k, Đà Nẵng', 'nv11@example.com', '1992-12-19', '2022-05-10'),
(12, 'Bùi Duy Nam 12', 'nv12', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09459617954', '85 Đường l, Hà Nội', 'nv12@example.com', '1984-12-30', '2020-07-08'),
(13, 'Tạ Lan Anh 13', 'nv13', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09489056840', '60 Đường m, Đà Nẵng', 'nv13@example.com', '1980-09-16', '2020-04-27'),
(14, 'Phạm Hải Yến 14', 'nv14', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09663749409', '58 Đường n, TP.HCM', 'nv14@example.com', '1988-10-23', '2025-05-15'),
(15, 'Đặng Quang Huy 15', 'nv15', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09594785897', '54 Đường o, TP.HCM', 'nv15@example.com', '1997-05-24', '2023-08-25'),
(16, 'Phạm Hải Yến 16', 'nv16', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09832645671', '29 Đường p, Đà Nẵng', 'nv16@example.com', '1987-09-02', '2021-02-17'),
(17, 'Bùi Duy Nam 17', 'nv17', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09806993167', '81 Đường q, Đà Nẵng', 'nv17@example.com', '1988-02-13', '2022-04-22'),
(18, 'Phạm Hải Yến 18', 'nv18', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09202686305', '83 Đường r, Đà Nẵng', 'nv18@example.com', '1991-07-15', '2021-08-26'),
(19, 'Đặng Quang Huy 19', 'nv19', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 0, '09226057517', '75 Đường s, Cần Thơ', 'nv19@example.com', '1993-12-14', '2022-04-14'),
(20, 'Bùi Duy Nam 20', 'nv20', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09637446520', '99 Đường t, Hải Phòng', 'nv20@example.com', '1986-05-19', '2024-04-14'),
(21, 'Tạ Lan Anh 21', 'nv21', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09253561889', '30 Đường u, Cần Thơ', 'nv21@example.com', '1999-10-09', '2023-05-26'),
(22, 'Hoàng Thúy Nga 22', 'nv22', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09633416694', '2 Đường v, Hà Nội', 'nv22@example.com', '1986-07-11', '2025-03-27'),
(23, 'Hoàng Thúy Nga 23', 'nv23', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09606565428', '39 Đường w, Cần Thơ', 'nv23@example.com', '1990-05-25', '2020-10-12'),
(24, 'Bùi Duy Nam 24', 'nv24', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09841709647', '97 Đường x, Cần Thơ', 'nv24@example.com', '1981-03-08', '2023-06-14'),
(25, 'Ngô Đức Minh 25', 'nv25', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09463955882', '50 Đường y, Hải Phòng', 'nv25@example.com', '1999-03-19', '2024-06-29'),
(26, 'Bùi Duy Nam 26', 'nv26', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09768742945', '34 Đường z, Hà Nội', 'nv26@example.com', '1988-08-26', '2022-04-18'),
(27, 'Hoàng Thúy Nga 27', 'nv27', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 0, '09823305106', '36 Đường {, TP.HCM', 'nv27@example.com', '1984-10-26', '2023-09-12'),
(28, 'Nguyễn Minh Thư 28', 'nv28', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09264548017', '93 Đường |, Hải Phòng', 'nv28@example.com', '1997-07-13', '2023-03-07'),
(29, 'Bùi Duy Nam 29', 'nv29', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09272725902', '40 Đường }, Đà Nẵng', 'nv29@example.com', '1982-08-18', '2021-05-28'),
(30, 'Bùi Duy Nam 30', 'nv30', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09140490172', '41 Đường ~, Hà Nội', 'nv30@example.com', '1988-08-19', '2023-03-08'),
(31, 'Tạ Lan Anh 31', 'nv31', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09777126537', '64 Đường  , Hải Phòng', 'nv31@example.com', '1997-10-23', '2022-11-08'),
(32, 'Vũ Hoàng Long 32', 'nv32', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09392128607', '99 Đường €, Cần Thơ', 'nv32@example.com', '1981-04-23', '2020-12-25'),
(33, 'Lê Văn Thành 33', 'nv33', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09672578083', '6 Đường  , Hà Nội', 'nv33@example.com', '1995-05-11', '2023-10-30'),
(34, 'Đặng Quang Huy 34', 'nv34', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09404798847', '66 Đường ‚, TP.HCM', 'nv34@example.com', '1980-03-15', '2023-06-01'),
(35, 'Nguyễn Minh Thư 35', 'nv35', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 0, '09797877313', '60 Đường ƒ, TP.HCM', 'nv35@example.com', '1994-01-06', '2024-03-29'),
(36, 'Đặng Quang Huy 36', 'nv36', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09473706066', '87 Đường „, Hải Phòng', 'nv36@example.com', '1998-09-03', '2023-07-24'),
(37, 'Đặng Quang Huy 37', 'nv37', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09825080533', '58 Đường …, Hà Nội', 'nv37@example.com', '1996-03-08', '2025-04-09'),
(38, 'Nguyễn Minh Thư 38', 'nv38', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09789666280', '78 Đường †, Cần Thơ', 'nv38@example.com', '1988-07-09', '2025-02-21'),
(39, 'Bùi Duy Nam 39', 'nv39', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09713892102', '70 Đường ‡, Hà Nội', 'nv39@example.com', '1980-10-20', '2023-05-24'),
(40, 'Trần Thu Hằng 40', 'nv40', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09285197767', '52 Đường ˆ, TP.HCM', 'nv40@example.com', '1998-12-25', '2023-07-29'),
(41, 'Nguyễn Minh Thư 41', 'nv41', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 1, '09770312872', '26 Đường ‰, Cần Thơ', 'nv41@example.com', '1981-04-04', '2020-12-29'),
(42, 'Nguyễn Minh Thư 42', 'nv42', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09732105774', '90 Đường Š, TP.HCM', 'nv42@example.com', '1997-07-15', '2022-09-07'),
(43, 'Hoàng Thúy Nga 43', 'nv43', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09902385233', '9 Đường ‹, Hải Phòng', 'nv43@example.com', '1983-03-31', '2025-05-09'),
(44, 'Phạm Hải Yến 44', 'nv44', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09811191730', '42 Đường Œ, Hải Phòng', 'nv44@example.com', '1990-02-01', '2024-06-19'),
(45, 'Nguyễn Minh Thư 45', 'nv45', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09100012097', '95 Đường  , Hà Nội', 'nv45@example.com', '1996-09-05', '2025-06-24'),
(46, 'Nguyễn Minh Thư 46', 'nv46', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09627712961', '70 Đường Ž, TP.HCM', 'nv46@example.com', '1997-08-14', '2020-02-11'),
(47, 'Đặng Quang Huy 47', 'nv47', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09177431868', '87 Đường  , Hải Phòng', 'nv47@example.com', '1992-03-28', '2020-03-13'),
(48, 'Lê Văn Thành 48', 'nv48', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'thu_ngan', 1, '09978005998', '22 Đường  , Cần Thơ', 'nv48@example.com', '1998-07-22', '2022-03-09'),
(49, 'Ngô Đức Minh 49', 'nv49', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'nhan_vien_kho', 0, '09547962233', '66 Đường ‘, TP.HCM', 'nv49@example.com', '1982-10-14', '2024-03-15'),
(50, 'Nguyễn Minh Thư 50', 'nv50', '$2b$10$fOObPF9wq9U93m/2l5y6p.pP6ZQx3iMcLC6Q1tFoe8sdcN7B8yrPm', 'quan_ly', 1, '09340227408', '14 Đường ’, Cần Thơ', 'nv50@example.com', '1988-03-16', '2023-08-20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nha_cung_cap`
--

CREATE TABLE `nha_cung_cap` (
  `id` int(11) NOT NULL,
  `ten_nha_cung_cap` varchar(100) DEFAULT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nha_cung_cap`
--

INSERT INTO `nha_cung_cap` (`id`, `ten_nha_cung_cap`, `so_dien_thoai`, `dia_chi`) VALUES
(1, 'Công ty Minh Khôi 1', '09871788284', '93 Phố A, Hà Nội'),
(2, 'Công ty Thái Bình Dương 2', '09362916572', '12 Phố B, TP.HCM'),
(3, 'Công ty Thái Bình Dương 3', '09567805235', '36 Phố C, Hải Phòng'),
(4, 'Công ty Thái Bình Dương 4', '09698268912', '88 Phố D, Cần Thơ'),
(5, 'Công ty An Phát 5', '09434319457', '1 Phố E, Đà Nẵng'),
(6, 'Công ty Thái Bình Dương 6', '09525743310', '5 Phố F, TP.HCM'),
(7, 'Công ty Minh Khôi 7', '09149947942', '9 Phố G, Hải Phòng'),
(8, 'Công ty Minh Khôi 8', '09672572959', '79 Phố H, Hải Phòng'),
(9, 'Công ty Thái Bình Dương 9', '09969037908', '46 Phố I, TP.HCM'),
(10, 'Công ty An Phát 10', '09307360901', '24 Phố J, Hải Phòng'),
(11, 'Công ty An Phát 11', '09876804839', '21 Phố K, Cần Thơ'),
(12, 'Công ty Minh Khôi 12', '09747905390', '55 Phố L, Hà Nội'),
(13, 'Công ty Việt Phát 13', '09266998675', '19 Phố M, TP.HCM'),
(14, 'Công ty Thái Bình Dương 14', '09154648647', '62 Phố N, Hải Phòng'),
(15, 'Công ty Thái Bình Dương 15', '09166936554', '93 Phố O, TP.HCM'),
(16, 'Công ty Hoàng Gia 16', '09153319842', '1 Phố P, Hải Phòng'),
(17, 'Công ty Minh Khôi 17', '09845573656', '13 Phố Q, TP.HCM'),
(18, 'Công ty An Phát 18', '09242831307', '22 Phố R, Cần Thơ'),
(19, 'Công ty Việt Phát 19', '09173504958', '47 Phố S, Cần Thơ'),
(20, 'Công ty Việt Phát 20', '09892992745', '42 Phố T, Cần Thơ'),
(21, 'Công ty An Phát 21', '09971785487', '15 Phố U, Hà Nội'),
(22, 'Công ty Minh Khôi 22', '09790561879', '31 Phố V, Đà Nẵng'),
(23, 'Công ty An Phát 23', '09133412050', '46 Phố W, TP.HCM'),
(24, 'Công ty An Phát 24', '09437752208', '64 Phố X, Cần Thơ'),
(25, 'Công ty Việt Phát 25', '09192176246', '9 Phố Y, Cần Thơ'),
(26, 'Công ty Thái Bình Dương 26', '09263498510', '6 Phố Z, TP.HCM'),
(27, 'Công ty Thái Bình Dương 27', '09733718546', '79 Phố [, Hải Phòng'),
(28, 'Công ty Việt Phát 28', '09834469125', '30 Phố \\, Hải Phòng'),
(29, 'Công ty An Phát 29', '09521750023', '35 Phố ], TP.HCM'),
(30, 'Công ty Việt Phát 30', '09167953455', '81 Phố ^, Đà Nẵng'),
(31, 'Công ty An Phát 31', '09168387863', '78 Phố _, Cần Thơ'),
(32, 'Công ty An Phát 32', '09455497109', '57 Phố `, Hà Nội'),
(33, 'Công ty An Phát 33', '09893779310', '55 Phố a, Hà Nội'),
(34, 'Công ty Minh Khôi 34', '09986052883', '27 Phố b, Đà Nẵng'),
(35, 'Công ty Việt Phát 35', '09270890772', '79 Phố c, Cần Thơ'),
(36, 'Công ty Thái Bình Dương 36', '09146112618', '17 Phố d, Hải Phòng'),
(37, 'Công ty Việt Phát 37', '09837900196', '47 Phố e, Hà Nội'),
(38, 'Công ty Hoàng Gia 38', '09164586253', '74 Phố f, TP.HCM'),
(39, 'Công ty Việt Phát 39', '09338603234', '76 Phố g, Cần Thơ'),
(40, 'Công ty An Phát 40', '09905124735', '19 Phố h, Hải Phòng'),
(41, 'Công ty Hoàng Gia 41', '09878029826', '13 Phố i, TP.HCM'),
(42, 'Công ty Thái Bình Dương 42', '09862567002', '95 Phố j, Cần Thơ'),
(43, 'Công ty Minh Khôi 43', '09355708981', '31 Phố k, Hà Nội'),
(44, 'Công ty Việt Phát 44', '09966709570', '23 Phố l, Hải Phòng'),
(45, 'Công ty Việt Phát 45', '09241886446', '62 Phố m, Hà Nội'),
(46, 'Công ty An Phát 46', '09441328184', '8 Phố n, Hà Nội'),
(47, 'Công ty Việt Phát 47', '09660226221', '62 Phố o, Đà Nẵng'),
(48, 'Công ty Thái Bình Dương 48', '09270626043', '53 Phố p, Hà Nội'),
(49, 'Công ty Hoàng Gia 49', '09322140319', '90 Phố q, Đà Nẵng'),
(50, 'Công ty Việt Phát 50', '09283291494', '6 Phố r, Đà Nẵng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_nhap`
--

CREATE TABLE `phieu_nhap` (
  `id` int(11) NOT NULL,
  `id_nha_cung_cap` int(11) DEFAULT NULL,
  `ngay_nhap` datetime DEFAULT current_timestamp(),
  `id_nhan_vien` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieu_nhap`
--

INSERT INTO `phieu_nhap` (`id`, `id_nha_cung_cap`, `ngay_nhap`, `id_nhan_vien`) VALUES
(1, 25, '2025-07-22 17:31:30', 3),
(2, 44, '2025-07-20 07:46:44', 4),
(3, 49, '2025-07-15 06:19:06', 35),
(4, 35, '2025-07-21 18:38:26', 41),
(5, 5, '2025-07-05 20:34:51', 10),
(6, 38, '2025-07-09 02:31:44', 17),
(7, 31, '2025-08-03 23:15:20', 25),
(8, 26, '2025-07-24 05:27:08', 27),
(9, 22, '2025-07-04 12:48:22', 40),
(10, 49, '2025-07-19 07:55:08', 39),
(11, 3, '2025-07-16 07:26:48', 10),
(12, 17, '2025-07-24 01:08:15', 25),
(13, 47, '2025-07-31 20:25:31', 40),
(14, 29, '2025-07-26 06:35:58', 38),
(15, 9, '2025-08-02 14:09:58', 3),
(16, 33, '2025-07-17 08:11:15', 23),
(17, 13, '2025-08-05 23:18:33', 38),
(18, 21, '2025-07-04 18:31:16', 4),
(19, 25, '2025-08-01 07:10:25', 35),
(20, 43, '2025-07-22 10:57:27', 23),
(21, 38, '2025-07-26 23:50:28', 34),
(22, 38, '2025-07-14 07:06:46', 40),
(23, 34, '2025-07-12 17:20:56', 22),
(24, 1, '2025-07-01 15:33:42', 27),
(25, 38, '2025-07-12 17:09:57', 22),
(26, 43, '2025-07-31 20:19:02', 3),
(27, 11, '2025-07-15 00:56:09', 29),
(28, 30, '2025-07-11 05:51:11', 49),
(29, 46, '2025-07-01 16:40:44', 40),
(30, 21, '2025-07-30 13:49:49', 41),
(31, 20, '2025-07-14 13:11:09', 25),
(32, 17, '2025-07-08 05:45:16', 35),
(33, 13, '2025-07-31 08:19:04', 17),
(34, 7, '2025-07-15 12:52:23', 23),
(35, 6, '2025-07-05 07:09:30', 35),
(36, 46, '2025-07-29 08:30:06', 38),
(37, 45, '2025-07-12 14:26:12', 25),
(38, 44, '2025-07-13 12:08:44', 23),
(39, 44, '2025-07-04 22:39:17', 40),
(40, 4, '2025-07-17 15:56:22', 37),
(41, 38, '2025-07-01 12:33:40', 49),
(42, 28, '2025-07-27 02:38:08', 39),
(43, 7, '2025-08-02 04:06:54', 23),
(44, 11, '2025-07-12 14:12:04', 26),
(45, 28, '2025-07-14 19:31:35', 10),
(46, 39, '2025-07-26 20:20:13', 35),
(47, 22, '2025-07-24 06:18:51', 22),
(48, 26, '2025-07-10 22:29:35', 34),
(49, 27, '2025-07-07 22:53:56', 27),
(50, 7, '2025-07-02 12:28:32', 17);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `san_pham`
--

CREATE TABLE `san_pham` (
  `id` int(11) NOT NULL,
  `ten_san_pham` varchar(100) DEFAULT NULL,
  `ma_san_pham` varchar(50) DEFAULT NULL,
  `don_vi_tinh` varchar(50) DEFAULT NULL,
  `gia_ban` decimal(10,2) DEFAULT NULL,
  `so_luong` int(11) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `san_pham`
--

INSERT INTO `san_pham` (`id`, `ten_san_pham`, `ma_san_pham`, `don_vi_tinh`, `gia_ban`, `so_luong`, `ngay_tao`) VALUES
(1, 'Bánh snack Oishi loại 1', 'SP001', 'Gói', 40000.00, 56, '2025-08-08 14:06:41'),
(2, 'Bánh snack Oishi loại 2', 'SP002', 'Chai', 10000.00, 127, '2025-08-08 14:06:41'),
(3, 'Kem đánh răng P/S loại 3', 'SP003', 'Kg', 46000.00, 171, '2025-08-08 14:06:41'),
(4, 'Bánh Orion ChocoPie loại 4', 'SP004', 'Gói', 28000.00, 196, '2025-08-08 14:06:41'),
(5, 'Nước ngọt Coca loại 5', 'SP005', 'Chai', 48000.00, 131, '2025-08-08 14:06:41'),
(6, 'Nước ngọt Coca loại 6', 'SP006', 'Gói', 40000.00, 28, '2025-08-08 14:06:41'),
(7, 'Bánh snack Oishi loại 7', 'SP007', 'Hộp', 8000.00, 127, '2025-08-08 14:06:41'),
(8, 'Bánh Orion ChocoPie loại 8', 'SP008', 'Chai', 25000.00, 41, '2025-08-08 14:06:41'),
(9, 'Bánh snack Oishi loại 9', 'SP009', 'Cái', 39000.00, 66, '2025-08-08 14:06:41'),
(10, 'Nước ngọt Coca loại 10', 'SP010', 'Cái', 9000.00, 68, '2025-08-08 14:06:41'),
(11, 'Sữa tươi Vinamilk loại 11', 'SP011', 'Lon', 34000.00, 66, '2025-08-08 14:06:41'),
(12, 'Mì tôm Hảo Hảo loại 12', 'SP012', 'Chai', 11000.00, 72, '2025-08-08 14:06:41'),
(13, 'Bánh Orion ChocoPie loại 13', 'SP013', 'Chai', 32000.00, 3, '2025-08-08 14:06:41'),
(14, 'Bánh snack Oishi loại 14', 'SP014', 'Gói', 50000.00, 193, '2025-08-08 14:06:41'),
(15, 'Bánh snack Oishi loại 15', 'SP015', 'Chai', 25000.00, 146, '2025-08-08 14:06:41'),
(16, 'Kem đánh răng P/S loại 16', 'SP016', 'Cái', 25000.00, 81, '2025-08-08 14:06:41'),
(17, 'Nước ngọt Coca loại 17', 'SP017', 'Cái', 5000.00, 16, '2025-08-08 14:06:41'),
(18, 'Bánh snack Oishi loại 18', 'SP018', 'Gói', 36000.00, 149, '2025-08-08 14:06:41'),
(19, 'Sữa tươi Vinamilk loại 19', 'SP019', 'Gói', 37000.00, 47, '2025-08-08 14:06:41'),
(20, 'Sữa tươi Vinamilk loại 20', 'SP020', 'Lon', 25000.00, 127, '2025-08-08 14:06:41'),
(21, 'Nước ngọt Coca loại 21', 'SP021', 'Kg', 6000.00, 186, '2025-08-08 14:06:41'),
(22, 'Bánh snack Oishi loại 22', 'SP022', 'Chai', 25000.00, 42, '2025-08-08 14:06:41'),
(23, 'Sữa tươi Vinamilk loại 23', 'SP023', 'Gói', 8000.00, 73, '2025-08-08 14:06:41'),
(24, 'Mì tôm Hảo Hảo loại 24', 'SP024', 'Kg', 11000.00, 18, '2025-08-08 14:06:41'),
(25, 'Nước ngọt Coca loại 25', 'SP025', 'Lon', 26000.00, 153, '2025-08-08 14:06:41'),
(26, 'Nước ngọt Coca loại 26', 'SP026', 'Lon', 30000.00, 18, '2025-08-08 14:06:41'),
(27, 'Bánh Orion ChocoPie loại 27', 'SP027', 'Cái', 21000.00, 71, '2025-08-08 14:06:41'),
(28, 'Nước ngọt Coca loại 28', 'SP028', 'Lon', 21000.00, 67, '2025-08-08 14:06:41'),
(29, 'Kem đánh răng P/S loại 29', 'SP029', 'Hộp', 39000.00, 139, '2025-08-08 14:06:41'),
(30, 'Sữa tươi Vinamilk loại 30', 'SP030', 'Hộp', 37000.00, 48, '2025-08-08 14:06:41'),
(31, 'Bánh snack Oishi loại 31', 'SP031', 'Lon', 14000.00, 195, '2025-08-08 14:06:41'),
(32, 'Sữa tươi Vinamilk loại 32', 'SP032', 'Chai', 44000.00, 18, '2025-08-08 14:06:41'),
(33, 'Sữa tươi Vinamilk loại 33', 'SP033', 'Chai', 30000.00, 109, '2025-08-08 14:06:41'),
(34, 'Bánh Orion ChocoPie loại 34', 'SP034', 'Gói', 23000.00, 98, '2025-08-08 14:06:41'),
(35, 'Kem đánh răng P/S loại 35', 'SP035', 'Cái', 11000.00, 180, '2025-08-08 14:06:41'),
(36, 'Bánh snack Oishi loại 36', 'SP036', 'Chai', 11000.00, 167, '2025-08-08 14:06:41'),
(37, 'Bánh Orion ChocoPie loại 37', 'SP037', 'Gói', 36000.00, 65, '2025-08-08 14:06:41'),
(38, 'Nước ngọt Coca loại 38', 'SP038', 'Chai', 11000.00, 182, '2025-08-08 14:06:41'),
(39, 'Mì tôm Hảo Hảo loại 39', 'SP039', 'Hộp', 40000.00, 174, '2025-08-08 14:06:41'),
(40, 'Bánh Orion ChocoPie loại 40', 'SP040', 'Chai', 22000.00, 7, '2025-08-08 14:06:41'),
(41, 'Kem đánh răng P/S loại 41', 'SP041', 'Hộp', 17000.00, 29, '2025-08-08 14:06:41'),
(42, 'Mì tôm Hảo Hảo loại 42', 'SP042', 'Gói', 5000.00, 188, '2025-08-08 14:06:41'),
(43, 'Bánh Orion ChocoPie loại 43', 'SP043', 'Lon', 20000.00, 126, '2025-08-08 14:06:41'),
(44, 'Mì tôm Hảo Hảo loại 44', 'SP044', 'Lon', 45000.00, 63, '2025-08-08 14:06:41'),
(45, 'Nước ngọt Coca loại 45', 'SP045', 'Hộp', 48000.00, 92, '2025-08-08 14:06:41'),
(46, 'Bánh snack Oishi loại 46', 'SP046', 'Hộp', 23000.00, 50, '2025-08-08 14:06:41'),
(47, 'Mì tôm Hảo Hảo loại 47', 'SP047', 'Chai', 9000.00, 109, '2025-08-08 14:06:41'),
(48, 'Bánh Orion ChocoPie loại 48', 'SP048', 'Lon', 49000.00, 124, '2025-08-08 14:06:41'),
(49, 'Kem đánh răng P/S loại 49', 'SP049', 'Chai', 20000.00, 199, '2025-08-08 14:06:41'),
(50, 'Kem đánh răng P/S loại 50', 'SP050', 'Kg', 21000.00, 69, '2025-08-08 14:06:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('c0145c7c-3f5b-4ad6-919c-1f104f01b854', 'a5eaed1871f7c091da0b166df34de8d8efafa6ffa3d4106a88e4db56be90f400', '2025-09-04 13:13:23.938', '20250808135018_init', NULL, NULL, '2025-09-04 13:13:23.300', 1),
('cf9ca181-38a3-44d8-9e89-41143bac19f3', 'a1fa3c918050cbb8e7783475ed312b6d213b2f28afbd36aebee47e3d7ce60f1a', '2025-08-08 14:06:38.247', '20250808135018_init', NULL, NULL, '2025-08-08 14:06:37.955', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ca_lam`
--
ALTER TABLE `ca_lam`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nhan_vien` (`id_nhan_vien`);

--
-- Chỉ mục cho bảng `chi_tiet_hoa_don_ban`
--
ALTER TABLE `chi_tiet_hoa_don_ban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_hoa_don` (`id_hoa_don`),
  ADD KEY `id_san_pham` (`id_san_pham`);

--
-- Chỉ mục cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_phieu_nhap` (`id_phieu_nhap`),
  ADD KEY `id_san_pham` (`id_san_pham`);

--
-- Chỉ mục cho bảng `hoa_don_ban`
--
ALTER TABLE `hoa_don_ban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nhan_vien` (`id_nhan_vien`);

--
-- Chỉ mục cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nhan_vien_tai_khoan_key` (`tai_khoan`),
  ADD UNIQUE KEY `nhan_vien_email_key` (`email`),
  ADD KEY `tai_khoan` (`tai_khoan`);

--
-- Chỉ mục cho bảng `nha_cung_cap`
--
ALTER TABLE `nha_cung_cap`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nha_cung_cap` (`id_nha_cung_cap`),
  ADD KEY `id_nhan_vien` (`id_nhan_vien`);

--
-- Chỉ mục cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_san_pham` (`ma_san_pham`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ca_lam`
--
ALTER TABLE `ca_lam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_hoa_don_ban`
--
ALTER TABLE `chi_tiet_hoa_don_ban`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT cho bảng `hoa_don_ban`
--
ALTER TABLE `hoa_don_ban`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `nha_cung_cap`
--
ALTER TABLE `nha_cung_cap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `ca_lam`
--
ALTER TABLE `ca_lam`
  ADD CONSTRAINT `ca_lam_ibfk_1` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien` (`id`);

--
-- Các ràng buộc cho bảng `chi_tiet_hoa_don_ban`
--
ALTER TABLE `chi_tiet_hoa_don_ban`
  ADD CONSTRAINT `chi_tiet_hoa_don_ban_ibfk_1` FOREIGN KEY (`id_hoa_don`) REFERENCES `hoa_don_ban` (`id`),
  ADD CONSTRAINT `chi_tiet_hoa_don_ban_ibfk_2` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id`);

--
-- Các ràng buộc cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  ADD CONSTRAINT `chi_tiet_phieu_nhap_ibfk_1` FOREIGN KEY (`id_phieu_nhap`) REFERENCES `phieu_nhap` (`id`),
  ADD CONSTRAINT `chi_tiet_phieu_nhap_ibfk_2` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id`);

--
-- Các ràng buộc cho bảng `hoa_don_ban`
--
ALTER TABLE `hoa_don_ban`
  ADD CONSTRAINT `hoa_don_ban_ibfk_1` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien` (`id`);

--
-- Các ràng buộc cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  ADD CONSTRAINT `phieu_nhap_ibfk_1` FOREIGN KEY (`id_nha_cung_cap`) REFERENCES `nha_cung_cap` (`id`),
  ADD CONSTRAINT `phieu_nhap_ibfk_2` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
