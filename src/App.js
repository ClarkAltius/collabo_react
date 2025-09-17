import logo from './logo.svg';
import './App.css';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';


function App() {
  const appName = "IT Academy Coffee Shop"

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand href='/'>{appName}</Navbar.Brand>
          <Nav className="me-auto">
            <MenuItems />
            메뉴 리스트
          </Nav>
        </Container>
      </Navbar >
      내용

      {/** 분리된 라우터 정보 */}
      <AppRoutes />
      
      < footer className="bg-dark text-light text-center py-3 mt-5" >
        <p>&copy; 2025 {appName}. All rights reserved.</p>
      </footer >

    </>
  );
}

export default App;
