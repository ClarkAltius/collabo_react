/*
상품 상세 보기
1. 전체 화면 1:2로 분리
2. 왼 상품 이미지, 오른 상품 정보 + 버튼
3. 버튼 : 장바구니, 구매하기
*/

import { Container, Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


function ProductDetail({ user }) {
    const { id } = useParams(); //id 파라미터 챙기기
    const [product, setProduct] = useState(null); //백엔드에서 넘어오는 상품정보
    //로딩 상태를 의미하는 state로 값이 true 일 경우 로딩중
    const [loading, setLoading] = useState(true);

    //장바구니 관련 파일
    const [quantity, setQuantity] = useState(0);


    const navigate = useNavigate();


    useEffect(() => {
        const url = `${API_BASE_URL}/product/detail/${id}`;
        axios
            .get(url)
            .then((response) => {
                setProduct(response.data);
                setLoading(false); //상품 정보 읽어오기 성공
            })
            .catch((error) => {
                console.log(error);
                alert(`상품 정보를 읽어오는 과정에서 오류 발생`)
                navigate(-1); //이전 페이지로 이동
            });
    }, [id])

    //backend에서 읽어오지 못한 경우 대비
    if (loading === true) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 읽어오는 중입니다.
                </h3>
            </Container>
        );
    }

    //상품에 대한 정보가 없는 경우
    if (!product) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보가 존재하지 않습니다.
                </h3>
            </Container>
        );
    }

    //수량 체인지 관련 이벤트 핸들러 함수 정의
    const QuantityChange = (event) => {
        const newValue = parseInt(event.target.value);
        setQuantity(newValue);
    };


    //
    const addToCart = async () => {
        if (quantity < 1) {
            alert(`구매 수량은 1개 이상이어야 합니다`);
            return;
        }
        try {
            const url = `${API_BASE_URL}/cart/insert`;
            //cart에 담을 내용은 회원 id, 상품 id, 구매 수량
            const parameters = {
                memberId: user.id,
                productId: product.id,
                quantity: quantity
            };
            const response = await axios.post(url, parameters);

            alert(response.data);
            navigate('/product/list'); //상품 목록 페이지로 이동

        } catch (error) {
            console.log('오류 발생: ' + error);
            if (error.response) {

            } else {
                alert('장바구니 추가 실패');
                console.log(error.response.data);
            }
        }
        // alert(`${product.name} ${quantity} 개를 장바구니에 담기`)
    }


    return (
        <Container className="my-4">
            Title Placeholder
            <Card>
                <Row className="g-0">
                    {/**Column for image */}
                    <Col md={4}>
                        <Card.Img
                            variant="top"
                            src={`${API_BASE_URL}/images/${product.image}`}
                            alt={`${product.name}`}
                            style={{ width: "100%", height: '400px' }}
                        />
                        메뉴 아이템: 이미지
                    </Col>
                    {/**Column for product detail + buttons */}
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="fs-3">
                                <h3>{product.name}</h3>
                            </Card.Title>
                            <Table striped>
                                <tbody>
                                    <tr>
                                        <td className="text-center">이름</td>
                                        <td>{product.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">가격</td>
                                        <td>{product.price}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">카테고리</td>
                                        <td>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">재고</td>
                                        <td>{product.stock}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">설명</td>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">등록일자</td>
                                        <td>{product.inputdate}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            {/** 구매 수량 입력란 */}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Col xs={3} className="text-center">
                                    <strong>구매 수량</strong>
                                </Col>
                                <Col xs={5}>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        disabled={!user}
                                        value={quantity}
                                        onChange={QuantityChange}
                                    />
                                </Col>
                            </Form.Group>
                            {/** */}
                        </Card.Body>
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="primary" className="me-3 px-4" href="/product/list">
                                이전 목록
                            </Button>
                            <Button variant="success" className="me-3 px-4"
                                onClick={() => {
                                    if (!user) {
                                        alert('로그인이 필요한 서비스입니다.');
                                        return navigate('/member/login');
                                    } else {
                                        addToCart();

                                    }
                                }}
                            >
                                장바구니
                            </Button>
                            <Button variant="danger" className="me-3 px-4">
                                구매하기
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Container >
    );
}

export default ProductDetail;