const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, checkRole } = require('../middleware/auth');
const Joi = require('joi');

const nhanVienSchema = Joi.object({
  hoTen: Joi.string().max(100).required().messages({
    'string.empty': 'Họ tên không được để trống',
    'string.max': 'Họ tên không được vượt quá 100 ký tự',
  }),
  soDienThoai: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
    'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số',
    'string.empty': 'Số điện thoại không được để trống',
  }),
  diaChi: Joi.string().allow('').optional(),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'string.empty': 'Email không được để trống',
  }),
  ngaySinh: Joi.date().optional().allow(null, ''),
  ngayVaoLam: Joi.date().optional().allow(null, ''),
  trangThai: Joi.string().valid('Đang làm', 'Đã nghỉ').required().messages({
    'any.only': 'Trạng thái phải là "Đang làm" hoặc "Đã nghỉ"',
  }),
});

// Lấy danh sách nhân viên — chỉ quản lý
router.get('/', authenticateToken, checkRole('quan_ly'), async (req, res) => {
  try {
    const nhanviens = await prisma.nhan_vien.findMany();
    res.json(nhanviens);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên:", error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách nhân viên' });
  }
});

// Thêm nhân viên — chỉ quản lý
router.post('/', authenticateToken, checkRole('quan_ly'), async (req, res) => {
  const { error, value } = nhanVienSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map((e) => e.message) });
  }
  try {
    const nv = await prisma.nhan_vien.create({
      data: {
        ho_ten: value.hoTen,
        so_dien_thoai: value.soDienThoai,
        dia_chi: value.diaChi,
        email: value.email,
        ngay_sinh: value.ngaySinh ? new Date(value.ngaySinh) : null,
        ngay_vao_lam: value.ngayVaoLam ? new Date(value.ngayVaoLam) : null,
        trang_thai: value.trangThai === 'Đang làm',
      },
    });
    res.json(nv);
  } catch (error) {
    console.error("Lỗi khi thêm nhân viên:", error);
    res.status(400).json({ error: 'Lỗi khi thêm nhân viên: ' + error.message });
  }
});

// Cập nhật nhân viên — chỉ quản lý
router.put('/:id', authenticateToken, checkRole('quan_ly'), async (req, res) => {
  const { id } = req.params;
  const { error, value } = nhanVienSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map((e) => e.message) });
  }
  try {
    const nv = await prisma.nhan_vien.update({
      where: { id: parseInt(id) },
      data: {
        ho_ten: value.hoTen,
        so_dien_thoai: value.soDienThoai,
        dia_chi: value.diaChi,
        email: value.email,
        ngay_sinh: value.ngaySinh ? new Date(value.ngaySinh) : null,
        ngay_vao_lam: value.ngayVaoLam ? new Date(value.ngayVaoLam) : null,
        trang_thai: value.trangThai === 'Đang làm',
      },
    });
    res.json(nv);
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    res.status(400).json({ error: 'Lỗi khi cập nhật nhân viên: ' + error.message });
  }
});

// Xóa nhân viên — chỉ quản lý
router.delete('/:id', authenticateToken, checkRole('quan_ly'), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.nhan_vien.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Đã xóa nhân viên' });
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên:", error);
    res.status(400).json({ error: 'Lỗi khi xóa nhân viên: ' + error.message });
  }
});

module.exports = router;
