import { useState } from "react";
import { Container, Row, Card, Form, Col, Button } from "react-bootstrap";

function App() {
    //파라미터 관련 스테이트
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">회원 가입</h2>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이름 입력"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="xxx@yyy.zzz"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="******"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="주소 입력"
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" >
                                    회원 가입
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;