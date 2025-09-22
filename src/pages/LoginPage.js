import { useState } from "react";
import { Container, Row, Card, Form, Col, Button, Alert } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
function LoginPage() {

    //파라미터 관련 스테이트
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();

    //  폼 유효성 검사(Form Validation Check) 관련 state 정의
    // 입력 방식에 문제 발생시 값을 저장 할 곳.
    const [errors, setErrors] = useState('');

    const navigate = useNavigate();

    const LoginAction = async (event) => {
        event.preventDefault();
        try {

            const url = `${API_BASE_URL}/member/login`;
            const parameter = { email, parameter };
            //스프링부트가 넘겨주는 정보는 Map<String, Object> 타입입니다. 
            const response = await axios.post(url, parameter);

            //message에는 로그인 성공 여부 알리는 내용, member에는 로그인 한 사람의 객체 정보가 반환
            const { message, member } = response.data;

            if (message === '로그인 성공') { //자바에서 map.put("message", "로그인 성공") 으로 만들 예정
                console.log('로그인한 유저의 정보');
                console.log(member);
                //로그인 성공시 사용자 정보를 저장해야합니다. 
                //로그인 성공 후 홈페이지 이동
                navigate(`/Homepage`);

            } else { //로그인 실패 
                setErrors(message);

            }
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.message || '로그인 실패');
            } else {

            }
        }
    }





    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">로그인</h2>
                            {/** 일반 오류 발생시 사용자에게 alert 메시지  */}
                            {errors && <Alert variant="danger">{errors}</Alert>}
                            <Form onSubmit={LoginAction}>
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
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>

                                </Form.Group>

                                <Row>
                                    <Col xs={8}>
                                        <Button variant="primary" type="submit" className="w-100">
                                            로그인
                                        </Button>
                                    </Col>
                                    <Col xs={4}>
                                        <Link to={`/member/signup`} className="btn btn-outline-secondary w-100" >
                                            회원가입
                                        </Link>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;