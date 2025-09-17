import { use } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MenuItems() {
    const navigate = useNavigate();
    return (
        <>
            메뉴 아이템
            {/**Nav.Link 는 다른 페이지로 이동할 때 사용 */}
            <Nav.Link>상품 보기</Nav.Link>
            <NavDropdown title={`기본 연습`}>
                <NavDropdown.Item onClick={() => navigate(`/fruit`)}>과일 1개</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate(`/fruit/list`)}>과일 목록</NavDropdown.Item>
            </NavDropdown>
        </>
    );
}

export default MenuItems;