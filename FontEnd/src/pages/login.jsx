import { useState } from "react"
import { Eye, EyeOff, Store, ShoppingCart } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log("Login attempt:", { email, password, rememberMe })
      alert("Đăng nhập thành công!")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md mx-auto sm:rounded-xl sm:shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full mb-3 sm:mb-4 shadow-lg">
            <Store className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Ministop</h1>
          <p className="text-xs sm:text-base text-gray-600">Hệ thống quản lý cửa hàng tiện lợi</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl border-0 overflow-hidden">
          <div className="px-4 py-4 sm:px-8 sm:py-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-white">Đăng nhập</h2>
            <p className="text-center text-blue-100 mt-1 text-xs sm:text-base">Nhập thông tin tài khoản để truy cập hệ thống</p>
          </div>
          <div className="px-4 py-4 sm:px-8 sm:py-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  Email hoặc tên đăng nhập
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@convenistore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 text-xs sm:text-base"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 text-xs sm:text-base"
                  />
                  <button
                    type="button"
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-2 sm:gap-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label htmlFor="remember" className="text-xs sm:text-sm font-medium text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg text-xs sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Đăng nhập</span>
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 sm:my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-3 sm:px-4 bg-white text-gray-500 font-medium">hoặc</span>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                {"Chưa có tài khoản? "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors duration-200"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Tài khoản demo:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Admin:</strong> admin@store.com / admin123
                </p>
                <p>
                  <strong>Nhân viên:</strong> staff@store.com / staff123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 mb-6 sm:mt-8 text-center">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600">Ministop Management System</span>
          </div>
          <p className="text-xs text-gray-500">{"© 2025 Ministop. Tất cả quyền được bảo lưu."}</p>
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-1 sm:mt-2 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">
              Chính sách bảo mật
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-gray-600 transition-colors">
              Điều khoản sử dụng
            </a>
            <span>•</span>
            <a href="/support" className="hover:text-gray-600 transition-colors">
              Hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
