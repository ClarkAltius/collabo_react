import { useState } from "react";
import { Container, Row, Card, Form, Col, Button, Alert } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
    //파라미터 관련 스테이트
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();

    //  폼 유효성 검사(Form Validation Check) 관련 state 정의
    // 입력 방식에 문제 발생시 값을 저장 할 곳.
    const [errors, setErrors] = useState({
        name: '', email: '', password: '', address: '', general: ''
    });

    const navigate = useNavigate();

    /*
    구분        async/await 사용           then/catch 사용
    필수 여부    없어도 됨                   가능
    가독성    더 깔끔                       체인이 길어지면 복잡
    에러 처리    try...catch 한 번에 가능       .catch() 따로 작성
    추천 여부    대부분의 비동기 코드에서 추천   간단한 한 줄짜리 Promise라면 가능
*/
    const SignupAction = async (event) => {
        event.preventDefault();

        try {
            const url = `${API_BASE_URL}/member/signup`;
            const parameters = { name, email, password, address };

            //response 는 응답 받은 객체입니다
            const response = await axios.post(url, parameters);
            if (response.status === 200) {
                {/** 스프링의 MemberController 파일 참조 */ }
                alert('회원 가입 성공');
                navigate('member/login')
            }
        } catch (error) { //error: 에외 객체
            if (error.response && error.response.data) {
                //서버에서 받은 오류 정보를 객체로 저장
                setErrors(error.response.data);
            } else {
                setErrors((previous) => ({ ...previous, general: '회원 가입 중 오류가 발생하였습니다.' }))
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">회원 가입</h2>
                            {/** 일반 오류 발생시 사용자에게 alert 메시지  */}
                            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                            <Form onSubmit={SignupAction}>
                                <Form.Group className="mb-3">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이름 입력"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                    {/**isInvalid 속성은 해당 control의 유효성을 검사하는 속성.
                                     * 값이 true 이면 Form.Control.Feedback에 빨간 색상으로 오류 메시지 표기
                                     */}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="xxx@yyy.zzz"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                        isInvalid={!!errors.email}

                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>

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

                                <Form.Group className="mb-3">
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="주소 입력"
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        required
                                        isInvalid={!!errors.address}

                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>

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