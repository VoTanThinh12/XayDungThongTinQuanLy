Yêu cầu trước khi bắt đầu:
 ✅ Cài đặt Node.js(>= 18) – [https://nodejs.org](https://nodejs.org)
 ✅ Cài đặt XAMPP để chạy MySQL (mở `phpMyAdmin`)
 ✅ Cài đặt   Prisma CLI   (nếu chưa có):
  npm install -g prisma

Bước 1: Tạo CSDL trên XAMPP
1. Mở XAMPP Control Panel → Start `Apache` và `MySQL`.
2. Vào trình duyệt truy cập:
   [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Tạo database mới, ví dụ tên là:
   quanly_cuahang
4. Ghi nhớ tên DB này để đặt vào `.env` ở bước tiếp theo.

Bước 2: Cấu hình file `.env` cho backend
file `.env` trong thư mục `backend:
DATABASE_URL="mysql://root:@localhost:3306/quanly_cuahang"
PORT=3001
JWT_SECRET=your_jwt_secret
> ⚠️ Lưu ý:
>  `root` là user mặc định của MySQL.
>  Nếu bạn có password thì thêm sau dấu `:` (ví dụ `mysql://root:yourpassword@localhost:3306/...`)

Bước 3: Cài đặt thư viện cho backend + khởi tạo Prisma
cd backend
# Cài đặt thư viện
npm install
# Khởi tạo Prisma Client
npx prisma generate
# (Tùy chọn) Tạo bảng trong database (nếu chưa có)
npx prisma migrate dev --name init
```

 ▶️ Bước 4: Chạy backend
npm start

 🌐 Bước 5: Cài đặt & chạy frontend (React)
cd frontend
# Cài thư viện
npm install
# Chạy giao diện
npm start
Sau đó mở trình duyệt:
[http://localhost:3000](http://localhost:3000)
