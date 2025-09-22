import { useEffect } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Navigate } from "react-router-dom";

function App() {

    useEffect(() => {
        const url = `${API_BASE_URL}/member/logout`;
        axios.post(url)
            .then(() => {
                localStorage.removeItem('user');
                console.log('로그아웃 성공');
                Navigate('/member/login');
            })
            .catch(() => {
                console.log('로그아웃 실패', Error);
            });
    }, []);

    return (
        <>
            메뉴 아이템
        </>
    );
}

export default App;