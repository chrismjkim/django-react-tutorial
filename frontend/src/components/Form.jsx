import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import "..styles/Form.css"

function Form({route, method}) {
    // route: 폼 제출 시 이동하고 싶은 경로
    // method: 회원가입인지, 로그인인지
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method==="login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault(); // 페이지를 다시 로드하지 않게 하기 위함
        
        // request 전송 시도
        try {
            const res = await api.post(route, {username, password})
            // 로그인하는 경우 토큰 세팅
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                // 회원가입하는 경우 토큰 세팅
                navigate("/login")
            }
        }
        // 에러 발생 시 포착하고 알림
        catch (error) {
            alert(error)
        } finally {
            setLoading(false);
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
                <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        <button className="form-button" type="submit">
            {name}
        </button>
    </form>
}

export default Form