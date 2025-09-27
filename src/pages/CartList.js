import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Image, Table, Form } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function CartList({ user }) {

    const thStyle = { fontSize: '1.2rem' };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                <span style={{ color: 'blue', fontSize: '2rem' }}>{user?.name}</span>
                <span style={{ fontSize: '1.3rem' }}>님의 장바구니</span>
            </h2>

            <Table striped>
                <thead>
                    <tr>
                        <th style={thStyle}>
                            <Form.Check
                                type="checkbox"
                                label="전체 선택"
                                onChange={``}
                            />
                        </th>
                        <th style={thStyle}>상품 정보</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>xxx</td>
                    </tr>
                </tbody>
                <h3 className="text-end-mt-3">총 주문 금액 : ???? hamuch??</h3>
                <div className="text-end">
                    <Button variant="danger" size="lg" onClick={``}>
                        구매하기?
                    </Button>
                </div>

            </Table>
        </Container>
    );
}

export default CartList;