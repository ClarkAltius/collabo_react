import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/*
step01
상품 목록을 상품 아이디 역순으로 읽어 전체 목록을 표기
필드 검색과 페이징 기능은 구현하지 않음

step02
사용자 정보가 'ADMIN' 이면 등록,수정,삭제 버튼이 보이게 코딩. 
삭제 버튼에 대한 기능 구현
*/

function ProductList({ user, item }) {
    const [products, setProducts] = useState([]);


    //springboot에 상품 목록을 요청하기
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`; //요청 할 url. fetch ALL da produkts at once! 

        console.log("Requesting URL:", url); //debugging

        axios
            .get(url, {})
            .then((response) => {
                console.log('응답 받은 데이터');
                console.log(response.data);
                setProducts(response.data);
            })
            .catch((error) => {
                console.log(error)
            });

    }, []); //empty dependency array means this runs only once on mount

    const navigate = useNavigate();

    const makeAdminButtons = (item, user, navigate) => {
        if (user?.role !== 'ADMIN') return null;
        return (
            <div className="d-flex justify-content-center">
                <Button
                    variant="warning"
                    className="mb-2"
                    size="sm"
                    onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/product/update/${item.id}`);
                        alert(`[${item.id}]번 상품 수정. 수정 페이지로 이동합니다.`);
                    }}
                >
                    수정
                </Button>
                &nbsp;
                <Button
                    variant="danger"
                    className="mb-2"
                    size="sm"
                    onClick={async (event) => {
                        event.stopPropagation();
                        const isDelete = window.confirm(`'${item.name}' 상품을 삭제하시겠습니까?`);
                        if (isDelete === false) {
                            alert(`'${item.name}' 상품 삭제를 취소 하셨습니다.`);
                            return;
                        }
                        try {
                            await axios.delete(`${API_BASE_URL}/product/delete/${item.id}`);
                            alert(`'${item.name}' 상품을 성공적으로 삭제하셨습니다.`);

                            setProducts(currentProducts => currentProducts.filter(product => product.id !== item.id)
                            );

                            navigate(`/product/list`);


                        } catch (error) {
                            console.log(error);
                            alert(`상품 삭제 실패: ${error.response.data || error.message}`)
                        }
                    }}
                >
                    삭제
                </Button>
            </div>
        )
    };


    return (
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>
            <Link to={`/product/insert`}>
                {user?.role === 'ADMIN' && (
                    <Button variant="primary" className="mb-3">
                        상품 등록
                    </Button>
                )}
            </Link>
            {/**필드 검색 영역 */}
            {/**자료 보여주는 영역 */}
            <Row>
                {/**products는 상품 배열, item은 상품 1개를 의미 */}
                {products.map((item) => (
                    <Col key={item.id} md={4} className="mb-4">
                        <Card className="h-100" style={{ cursor: 'pointer' }}>
                            <Card.Img
                                variant="top"
                                src={`${API_BASE_URL}/images/${item.image}`}
                                alt={item.name}
                                style={{ width: '100%', height: '200px' }}
                            />
                            <Card.Body>
                                <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                                    {/**borderCollapse : 각 셀의 테두리를 합칠 것인지 별개로 보여줄지 설정하는 속성 */}
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '70%', padding: '4px', border: 'none' }}>
                                                <Card.Title>{item.name}({item.id})</Card.Title>

                                            </td>
                                            {/**rowSpan 속성은 행방향 병합시 사용 ↔ colSpan */}
                                            <td rowSpan={2} style={{ padding: '4px', border: 'none', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {makeAdminButtons(item, user, navigate)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '70%', padding: '4px', border: 'none' }}>
                                                <Card.Text>가격: {item.price.toLocaleString()} 원</Card.Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/**페이징 처리 영역 */}
        </Container>
    );
}

export default ProductList;