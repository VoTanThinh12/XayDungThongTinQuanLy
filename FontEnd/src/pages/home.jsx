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
    { id: 1, title: "Hoàn thành báo cáo tuần", priority: "high", completed: false, deadline: "17:00" },
    { id: 2, title: "Họp team dự án ABC", priority: "medium", completed: true, deadline: "14:00" },
    { id: 3, title: "Review code module thanh toán", priority: "high", completed: false, deadline: "16:30" },
    { id: 4, title: "Cập nhật tài liệu API", priority: "low", completed: false, deadline: "18:00" },
  ]

  const recentNotifications = [
    { title: "Lịch họp team đã được cập nhật", time: "10 phút trước", type: "info" },
    { title: "Bạn có 1 yêu cầu nghỉ phép chờ duyệt", time: "1 giờ trước", type: "warning" },
    { title: "Chúc mừng! Bạn đã hoàn thành mục tiêu tháng", time: "2 giờ trước", type: "success" },
    { title: "Nhắc nhở: Nộp timesheet cuối tuần", time: "1 ngày trước", type: "reminder" },
  ]

  const upcomingSchedule = [
    { title: "Daily Standup", time: "09:00 - 09:30", date: "Hôm nay", type: "meeting" },
    { title: "Code Review Session", time: "15:00 - 16:00", date: "Hôm nay", type: "work" },
    { title: "Team Building", time: "14:00 - 17:00", date: "Thứ 6", type: "event" },
    { title: "Training React Native", time: "09:00 - 12:00", date: "Thứ 2", type: "training" },
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
              <span className="text-xl">🕐</span>
            </div>
            <div className="text-3xl font-bold mb-1">7h 30p</div>
            <p className="text-xs opacity-80 m-0">Vào lúc: 08:30</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm m-0">Nhiệm vụ hoàn thành</h3>
              <span className="text-xl">✅</span>
            </div>
            <div className="text-3xl font-bold mb-1">12/15</div>
            <p className="text-xs opacity-80 m-0">Tuần này</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm m-0">Ngày nghỉ còn lại</h3>
              <span className="text-xl">☕</span>
            </div>
            <div className="text-3xl font-bold mb-1">8 ngày</div>
            <p className="text-xs opacity-80 m-0">Năm 2024</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm m-0">Điểm hiệu suất</h3>
              <span className="text-xl">📈</span>
            </div>
            <div className="text-3xl font-bold mb-1">92/100</div>
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
              <h2 className="text-lg font-semibold flex items-center gap-2 m-0">✅ Nhiệm vụ hôm nay</h2>
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
                <p className="text-sm text-gray-500 mb-2">Frontend Developer</p>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300">
                  💼 IT Department
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
              <div className="flex items-center gap-2 text-gray-400">
                <span>📍</span>
                <span className="text-sm text-gray-700">Tầng 5, Tòa nhà ABC</span>
              </div>
            </div>
            <button className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded cursor-pointer">
              Cập nhật thông tin
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 m-0">🔔 Thông báo mới</h2>
              <p className="text-sm text-gray-500 m-0">Cập nhật và thông tin quan trọng</p>
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
              Xem tất cả thông báo
            </button>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 m-0">📅 Lịch trình sắp tới</h2>
              <p className="text-sm text-gray-500 m-0">Cuộc họp và sự kiện trong tuần</p>
            </div>
            <div className="mb-4">
              {upcomingSchedule.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.type === "meeting"
                        ? "bg-blue-500"
                        : event.type === "work"
                        ? "bg-green-500"
                        : event.type === "event"
                        ? "bg-purple-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{event.title}</p>
                    <p className="text-xs text-gray-500 m-0">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded cursor-pointer">
              Xem lịch đầy đủ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
