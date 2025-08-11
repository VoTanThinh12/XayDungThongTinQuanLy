"use client"

import { useState, useEffect } from "react"

export default function EmployeeDashboard() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
      setCurrentDate(
        now.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const todayTasks = [
    { id: 1, title: "Báo cáo vào ca", priority: "high", completed: true, deadline: "09:00" },
    { id: 2, title: "Fill đồ lên kệ", priority: "high", completed: true, deadline: "10:00" },
    { id: 3, title: "Vệ sinh trong ca", priority: "high", completed: false, deadline: "09:00 - 14:00" },
    { id: 4, title: "Đếm tiền", priority: "high", completed: false, deadline: "14:00" },
  ]

  const recentNotifications = [
    { title: "...", time: "...", type: "info" },
    { title: "...", time: "...", type: "warning" },
    { title: "...", time: "...", type: "success" },
    { title: "...", time: "...", type: "reminder" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              NV
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 m-0">Chào buổi sáng, Nguyễn Văn An!</h1>
              <p className="text-sm text-gray-500 m-0">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 border border-gray-300 rounded bg-white cursor-pointer flex items-center gap-2">
              🔔
              <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 border border-gray-300 rounded bg-white cursor-pointer">⚙️</button>
            <button className="p-2 border border-gray-300 rounded bg-white cursor-pointer">🚪</button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm m-0">Giờ làm hôm nay</h3>
            </div>
            <div className="text-3xl font-bold mb-1">7h 30p</div>
            <p className="text-xs opacity-80 m-0">Vào lúc: 08:30</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm m-0">Số đơn hàng đã bán</h3>
            </div>
            <div className="text-3xl font-bold mb-1">12</div>
            <p className="text-xs opacity-80 m-0">Tuần này</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm m-0">Tổng doanh thu ca làm</h3>
            </div>
            <div className="text-3xl font-bold mb-1">10,000,000</div>
            <p className="text-xs opacity-80 m-0">Ngày 6 tháng 8 năm 2025</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm m-0">Số ngày đi làm trong tháng</h3>
            </div>
            <div className="text-3xl font-bold mb-1">6/31</div>
            <p className="text-xs opacity-80 m-0">Tháng này</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Check-in/Check-out */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 m-0">🕐 Chấm công</h2>
              <p className="text-sm text-gray-500 m-0">Thời gian làm việc hôm nay</p>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">{currentTime}</div>
              <p className="text-sm text-gray-500 m-0">Thời gian hiện tại</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Vào ca</p>
                <p className="font-semibold text-green-600 m-0">08:30</p>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Ra ca</p>
                <p className="font-semibold text-gray-400 m-0">--:--</p>
              </div>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded font-medium flex items-center justify-center gap-2">
              📍 Check-out
            </button>
          </div>

          {/* Today's Tasks */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 m-0">✅ Nhiệm vụ của ca</h2>
              <p className="text-sm text-gray-500 m-0">4 nhiệm vụ cần hoàn thành</p>
            </div>
            <div className="mb-4">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg mb-2 cursor-pointer"
                >
                  <input type="checkbox" checked={task.completed} className="w-4 h-4" readOnly />
                  <div className="flex-1">
                    <p
                      className={`text-sm mb-1 ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          task.priority === "high"
                            ? "bg-red-200 text-red-600"
                            : task.priority === "medium"
                            ? "bg-purple-200 text-purple-600"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {task.priority === "high" ? "Cao" : task.priority === "medium" ? "Trung bình" : "Thấp"}
                      </span>
                      <span className="text-xs text-gray-500">{task.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded cursor-pointer">
              Xem tất cả nhiệm vụ
            </button>
          </div>

          {/* Profile Summary */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 m-0">👤 Thông tin cá nhân</h2>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                NV
              </div>
              <div>
                <h3 className="font-semibold mb-1">Nguyễn Văn An</h3>
                <p className="text-sm text-gray-500 mb-2">Nhân Viên Bán Hàng</p>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300">
                  💼 Full Time
                </span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <span>📧</span>
                <span className="text-sm text-gray-700">nguyenvanan@company.com</span>
              </div>
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <span>📱</span>
                <span className="text-sm text-gray-700">0123 456 789</span>
              </div>
            </div>
            <button className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded cursor-pointer">
              Cập nhật thông tin
            </button>
          </div>
        </div>
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 w-full">
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold flex items-center gap-2 m-0 justify-center">Đơn hàng đã bán được</h2>
            </div>
            <div className="mb-4">
              {recentNotifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === "success"
                        ? "bg-green-500"
                        : notification.type === "warning"
                        ? "bg-yellow-500"
                        : notification.type === "info"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{notification.title}</p>
                    <p className="text-xs text-gray-500 m-0">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded cursor-pointer">
              Xem tất cả đơn hàng đã bán
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
