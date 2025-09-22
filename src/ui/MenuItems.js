import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MenuItems({ appName }) {
    const navigate = useNavigate();
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href='/'>{appName}</Navbar.Brand>
                <Nav className="me-auto">
                    {/* 하이퍼링크 : Nav.Link는 다른 페이지로 이동할 때 사용됩니다.  */}
                    <Nav.Link>상품 보기</Nav.Link>
                    <Nav.Link onClick={() => navigate(`/member/signup`)}>회원 가입</Nav.Link>
                    <Nav.Link onClick={() => navigate(`/member/login`)}>로그인</Nav.Link>
                    <NavDropdown title={`기본 연습`}>
                        <NavDropdown.Item onClick={() => navigate(`/fruit`)}>과일 1개</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/fruit/list`)}>과일 목록</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/element`)}>품목 1개</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/element/list`)}>품목 여러개</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default MenuItems;