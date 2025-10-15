import { useState } from "react";
import { Container, Row, Card, Form, Col, Button, Alert } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage({ setUser }) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    // [MODIFIED] The 'errors' state is now initialized as an object {}.
    // This makes error handling more consistent and robust.
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const LoginAction = async (event) => {
        event.preventDefault();
        // Clear previous errors on a new submission.
        setErrors({});
        try {
            const url = `${API_BASE_URL}/member/login`;

            const parameters = new URLSearchParams();
            parameters.append('email', email);
            parameters.append('password', password);

            const response = await axios.post(url, parameters, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true
            });

            const { message, member } = response.data;

            if (message === '로그인 성공') {
                console.log('로그인한 유저의 정보');
                console.log(member);
                setUser(member);
                navigate(`/`);
            } else {
                // This case is unlikely if the backend uses proper HTTP status codes for errors.
                setErrors({ general: message || 'An unknown error occurred.' });
            }
        } catch (error) {
            // [MODIFIED] The catch block now handles errors by setting a 'general' error message
            // in the 'errors' object. This avoids type inconsistencies.
            if (error.response && error.response.data && error.response.data.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: '로그인 중 오류가 발생했습니다.' });
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
                            {/* [MODIFIED] The Alert now displays the 'general' error message. */}
                            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
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
                                        // [MODIFIED] This now checks for a 'password' specific error.
                                        // It will be false for general login errors, which is correct.
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
