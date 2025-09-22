import './App.css';
import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';
import { useEffect, useState } from 'react';


function App() {
  const appName = "IT Academy Coffee Shop"
  // user: 로그인한 사람의 정보가 저장된 state
  //클라이언트에서 사용자 정보를 저장하기 위하여 localStorage를 사용하겠습니다. 
  const [user, setUser] = useState(null);

  // JSON.parse() 는 JSON형태의 문자열을 자바스크립트 객체 형태로 변환

  useEffect(() => {
    const loginUser = localStorage.getItem('user');
    setUser(JSON.parse(loginUser));
  }, []); //2번째 매개변수가 epmty array 임으로 1번만 rendering 됩니다



  const handleLoginSuccess = (userData) => {
    //LoginPage.js 에서 반환 받은 member 정보입니다
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('로그인 성공');
  }

  const handleLogoutSuccess = () => {
    setUser(null);
  }


  return (
    <>
      <MenuItems appName={appName} user={user} />

      {/** 분리된 라우터 정보 */}
      <AppRoutes user={user} handleLoginSuccess={handleLoginSuccess} logout={handleLogoutSuccess} />

      < footer className="bg-dark text-light text-center py-3 mt-5" >
        <p>&copy; 2025 {appName}. All rights reserved.</p>
      </footer >

    </>
  );
}

export default App;
