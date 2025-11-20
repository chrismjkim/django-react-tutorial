// protected route의 wrapper 역할을 함
import {Naviagte} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "..api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constatnts"
import { useState, useEffect } from "react"

function ProtectedRoute({children}){
    // checked if authorized before we allow someone to access
    const [isAuthorized, setIsAuthorized] = useState(null) //useState: 리액트 함수

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
    // async 키워드: 이 작업은 비동기로 실행하며, 결과를 Promise로 돌려준다.
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            // send request to backend with refresh token to get a new access token
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status == 200) { // 성공적인 경우
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
                console.log(error)
                setIsAuthorized(false)
            }
        }
    }
    // access token을 조회해보고 있으면 만료되었는지 체크
    // 만료되었으면 자동으로 백그라운드에서 token을 refresh
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        // 토큰이 없으면 authorized는 false
        if (!token) {
            setIsAuthorized(false)
            return
        }
        // 토큰이 있으면, 토큰을 decode
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000 // ms 단위가 아닌 sec 단위로 시간을 받음

        if (tokenExpiration < now) {
            // 토큰이 만료되는 시점보다 시간이 더 많이면지났으면
            await refreshToken() // 토큰 refresh
        } else {
            setIsAuthorized(true) // 만료되지 않았으면 authorized = true
        }
    }

    // useState가 null이 아닌 값이 될 때까지 Loading하며 위 구문에서 토큰 체크
    if (isAuthorized == null) {
        return <div>Loading...</div>
    }

    // Authorized 되었다면 내용을 보여주고, 아닐 시 로그인으로 리디렉션
    return isAuthorized ? children : <Naviagte to="/login" />

export default ProtectedRoute