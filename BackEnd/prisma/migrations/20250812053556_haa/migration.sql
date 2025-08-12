-- CreateTable
CREATE TABLE `nhan_vien` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ho_ten` VARCHAR(100) NOT NULL,
    `tai_khoan` VARCHAR(50) NOT NULL,
    `mat_khau` VARCHAR(255) NOT NULL,
    `vai_tro` ENUM('thu_ngan') NOT NULL,
    `ca_lam_viec` VARCHAR(20) NULL,
    `so_dien_thoai` VARCHAR(15) NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nhan_vien_tai_khoan_key`(`tai_khoan`),
    INDEX `nhan_vien_tai_khoan_idx`(`tai_khoan`),
    INDEX `nhan_vien_vai_tro_idx`(`vai_tro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ca_lam_viec` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_nhan_vien` INTEGER NOT NULL,
    `thoi_gian_bat_dau` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `thoi_gian_ket_thuc` DATETIME(3) NULL,
    `so_don_ban` INTEGER NOT NULL DEFAULT 0,
    `doanh_thu` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `ghi_chu` TEXT NULL,
    `trang_thai` ENUM('DANG_LAM', 'DA_KET_THUC') NOT NULL DEFAULT 'DANG_LAM',

    INDEX `ca_lam_viec_id_nhan_vien_idx`(`id_nhan_vien`),
    INDEX `ca_lam_viec_thoi_gian_bat_dau_idx`(`thoi_gian_bat_dau`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_muc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_danh_muc` VARCHAR(100) NOT NULL,
    `mo_ta` TEXT NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `san_pham` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_san_pham` VARCHAR(50) NOT NULL,
    `ten_san_pham` VARCHAR(200) NOT NULL,
    `ma_vach` VARCHAR(50) NOT NULL,
    `id_danh_muc` INTEGER NULL,
    `gia_ban` DECIMAL(10, 2) NOT NULL,
    `so_luong` INTEGER NOT NULL DEFAULT 0,
    `don_vi_tinh` VARCHAR(20) NOT NULL DEFAULT 'Cái',
    `mo_ta` TEXT NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `la_san_pham_noi_bat` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `san_pham_ma_san_pham_key`(`ma_san_pham`),
    UNIQUE INDEX `san_pham_ma_vach_key`(`ma_vach`),
    INDEX `san_pham_ma_vach_idx`(`ma_vach`),
    INDEX `san_pham_ma_san_pham_idx`(`ma_san_pham`),
    INDEX `san_pham_trang_thai_idx`(`trang_thai`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoa_don_ban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ma_hoa_don` VARCHAR(50) NOT NULL,
    `id_nhan_vien` INTEGER NOT NULL,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tong_tien` DECIMAL(10, 2) NOT NULL,
    `tien_khach_dua` DECIMAL(10, 2) NOT NULL,
    `tien_thoi` DECIMAL(10, 2) NOT NULL,
    `phuong_thuc_tt` ENUM('TIEN_MAT', 'THE_NGAN_HANG', 'CHUYEN_KHOAN') NOT NULL DEFAULT 'TIEN_MAT',
    `ghi_chu` TEXT NULL,
    `trang_thai` ENUM('HOAN_THANH', 'DA_HUY') NOT NULL DEFAULT 'HOAN_THANH',
    `ly_do_huy` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hoa_don_ban_ma_hoa_don_key`(`ma_hoa_don`),
    INDEX `hoa_don_ban_ma_hoa_don_idx`(`ma_hoa_don`),
    INDEX `hoa_don_ban_id_nhan_vien_idx`(`id_nhan_vien`),
    INDEX `hoa_don_ban_ngay_tao_idx`(`ngay_tao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_hoa_don_ban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_hoa_don` INTEGER NOT NULL,
    `id_san_pham` INTEGER NOT NULL,
    `so_luong` INTEGER NOT NULL,
    `gia_ban` DECIMAL(10, 2) NOT NULL,
    `thanh_tien` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ca_lam_viec` ADD CONSTRAINT `ca_lam_viec_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `san_pham` ADD CONSTRAINT `san_pham_id_danh_muc_fkey` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hoa_don_ban` ADD CONSTRAINT `hoa_don_ban_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_hoa_don_ban` ADD CONSTRAINT `chi_tiet_hoa_don_ban_id_hoa_don_fkey` FOREIGN KEY (`id_hoa_don`) REFERENCES `hoa_don_ban`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_hoa_don_ban` ADD CONSTRAINT `chi_tiet_hoa_don_ban_id_san_pham_fkey` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
