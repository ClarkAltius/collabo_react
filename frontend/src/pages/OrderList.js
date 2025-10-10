import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrderList({ user }) {
    //loading 이 true 일 경우 현재 데이터를 읽고 있는 중입니다.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); //오류정보 저장용 state
    const [orders, setOrders] = useState([]); //주문 목록 저장용 state. 초기값은 빈 array
    const navigate = useNavigate();




    useEffect(() => {
        //유저 정보가 없더라도 잠깐 기다리기
        if (user === null) {
            return;
        }

        //유저가 아니라면 '로그인해' 표기
        if (!user) {
            setError('로그인 해 주세요');
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const url = `${API_BASE_URL}/order/list`;
                //role 은 유저 계정타입 선별. ADMIN 혹은 USER
                const parameters = { params: { memberId: user.id, role: user.role } };

                // --- DEEEEE ---
                console.log("Fetching orders for user:", user);
                console.log("Sending parameters:", parameters);
                // --- BUUUUUG ---

                const response = await axios.get(url, parameters);
                setOrders(response.data);



            } catch (error) {
                setError('주문 목록을 불러오는 데 실패했습니다.');
                console.log(error);

            } finally {
                setLoading(false);
            };
        };

        fetchOrders(); //함수 호출

    }, [user])




    //관리자용 컴포넌트
    const makeAdminButton = (bean) => {
        // if (user?.role !== "ADMIN" && user?.role !== "USER") return null;
        if (!["ADMIN", "USER"].includes(user?.role)) return null;
        const changeStatus = async (newStatus) => {
            try {
                const url = `${API_BASE_URL}/order/update/status/${bean.orderId}?status=${newStatus}`;
                await axios.put(url);
                alert(`송장번호 ${bean.orderId}의 주문 상태가 ${newStatus}로변경되었습니다. `);

                //Completed status로 변경되고 나면 화면에서 사라짐
                setOrders((previous) =>
                    previous.filter((order) => order.orderId !== bean.orderId)
                );
            } catch (error) {
                console.log(error);
                alert(`상태 변경에 실패`);
            };
        };

        //주문 취소용 함수
        const orderCancel = async () => {
            try {
                const url = `${API_BASE_URL}/order/delete/${bean.orderId}`;
                await axios.delete(url);
                alert(`송장번호 ${bean.orderId}의 주문이 삭제되었습니다. `);

                //항목이 재 렌더링. bean.orderId와 동일하지 않은 경우만
                setOrders((previous) =>
                    previous.filter((order) => order.orderId !== bean.orderId)
                );
            } catch (error) {
                console.log(error);
                alert(`상품 삭제에 실패`);
            };
        };

        return (
            <div>
                {user?.role === 'ADMIN' && (
                    <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => changeStatus('COMPLETED')}
                    >
                        완료
                    </Button>
                )}
                <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => orderCancel(bean.orderId)}
                >
                    취소
                </Button>
            </div >
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">주문 목록을 불러오는 중입니다.</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <h1 className="my-4">주문 내역</h1>
            이전에 {orders.length}개 주문하셨습니다.
            {orders.length === 0 ? (
                <Alert variant="secondary">주문 내역이 없습니다</Alert>
            ) : (
                <Row>
                    {orders.map((bean) => (
                        < Col key={bean.orderId} md={6} className="mb-4" >
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>
                                            주문번호 : {bean.orderId}
                                        </Card.Title>
                                        <small className="text-muted">{bean.orderDate}</small>
                                    </div>
                                </Card.Body>
                                <Card.Text>
                                    상태 : <strong>{bean.status}</strong>
                                </Card.Text>

                                <ul style={{ paddingLeft: "20px" }}>
                                    {bean.orderItems.map((item, index) => (
                                        <li key={index}>
                                            {item.productName}({item.quantity}개)
                                        </li>
                                    ))}
                                </ul>
                                {/* 관리자 전용 버튼 생성 */}
                                {makeAdminButton(bean)}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container >
    );
}

export default OrderList;