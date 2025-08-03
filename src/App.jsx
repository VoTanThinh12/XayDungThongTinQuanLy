import React, { useState } from 'react'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === '123') {
      setIsLoggedIn(true)
    } else {
      alert('Sai tài khoản hoặc mật khẩu!')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Đăng nhập
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-red text-3xl font-bold underline">
        Welcome to the Convenience Store Management System
      </h1>
    </div>
  )
}

export default App
