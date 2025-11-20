// 페이지 사이의 이동 (Navigation)을 여기서 정의!!

import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout() {
  localStorage.clear() // 로그아웃 시 refreshtoken과 accesstoken을 로컬 스토리지에서 제거
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login/" element={<Login />} />
        <Route path="/register/" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
