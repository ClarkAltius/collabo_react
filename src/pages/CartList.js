import { useEffect, useState } from "react";
import { Button, Container, Table, Form, Row, Col, Image } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// NOTE: I removed unused imports like Card, Col, Row, Image, Link, useNavigate

function CartList({ user, product }) {
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);

    const [cartProducts, setCartProducts] = useState([]);
    const thStyle = { fontSize: '1.2rem' };

    //체크박스 상태가 toggle 될 때 마다 전체 요금을 재계산하는 함수
    const refreshOrderTotalPrice = (products) => {
        let total = 0; //총 금액 변수

        products.forEach((bean) => {
            if (bean.checked) { //선택된 체크 박스에 대하여
                total += bean.price * bean.quantity; //총 금액 누적
            }
        });
        setOrderTotalPrice(total); //state update
    };

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartProducts = async () => {
            // Only proceed if the user object and user.id are available
            if (user && user.id) {
                try {
                    // Call the new GET endpoint you created in the backend
                    const response = await axios.get(`${API_BASE_URL}/cart/${user.id}`);

                    // The response.data should be the list of CartProduct objects
                    setCartProducts(response.data);
                    console.log("Fetched cart data:", response.data);

                } catch (error) {
                    console.error("Failed to fetch cart products:", error);
                    // If the user has no cart yet, the backend returns an empty list,
                    // so an error here likely means a real problem.
                    setCartProducts([]); // Reset to empty on error
                }
            }
        };

        fetchCartProducts();
    }, [user]); // Dependency array: re-run the effect if the user object changes

    // --- Helper Functions for Cart Logic (You will need these) ---

    // Calculate the total price of all items in the cart
    const calculateTotal = () => {
        return cartProducts.reduce((total, cartProduct) => {
            // Each cartProduct has a 'product' object with a 'price' and a 'quantity'
            return total + (cartProduct.product.price * cartProduct.quantity);
        }, 0).toLocaleString(); // Format with commas
    };

    //전체선택 박스 체크 Toggle
    // Corrected toggleAllCheckBox function
    const toggleAllCheckBox = (isAllCheck) => {
        setCartProducts((previous) => {
            // Use the iterated product 'p' instead of the component prop
            const updatedProducts = previous.map((p) => ({
                ...p, // Spread the properties of the actual cart item
                checked: isAllCheck
            }));
            refreshOrderTotalPrice(updatedProducts);
            return updatedProducts;
        });
    };

    const toggleCheckBox = (cartProductId) => {
        console.log(`카트 상품 아이디: ${cartProductId}`);

        setCartProducts((previous) => {

            const updatedProducts = previous.map((product =>
                product.cartProductId === cartProductId
                    ? { ...product, checked: !product.checked }
                    : product
            ));

            refreshOrderTotalPrice(updatedProducts);
            return updatedProducts;
        })
    };

    const changeQuantity = async (cartProductId, quantity) => {
        if (isNaN(quantity)) {
            setCartProducts((previous) => {
                previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: 0 }
                        : product
                );
            });
            alert(`변경 수량은 최소 1 이상 이어야 합니다.`);
            return;
        }

        try {//실제 주소 http://localhost:9000/cart/edit/100?quantity=10
            const url = `${API_BASE_URL}/cart/edit/${cartProductId}?quantity=${quantity}`;
            const response = await axios.patch(url);
            console.log(response.data || '');
            setCartProducts((previous) => {
                const updatedProducts = previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: quantity }
                        : product
                );
                refreshOrderTotalPrice(updatedProducts);
                return updatedProducts;
            });
        } catch (error) {
            console.log(`카트 상품 수량 변경 실패`);
            console.log(error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                <span style={{ color: 'blue', fontSize: '2rem' }}>{user?.name}</span>
                <span style={{ fontSize: '1.3rem' }}>님의 장바구니</span>
            </h2>

            <Table striped>
                <thead>
                    <tr>
                        <th style={thStyle}> {/* toggleAllCheckBox. 전체선택 체크박스의 체크 상태를 전달 받을 함수 (bool) */}
                            <Form.Check
                                type="checkbox"
                                label="전체 선택"
                                onChange={(event) => toggleAllCheckBox(event.target.checked)}
                            />
                        </th>
                        <th style={thStyle}>상품 정보</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <tr key={product.cartProductId}>
                                <td className="text-center align-middle">
                                    <Form.Check
                                        type="checkbox"
                                        checked={product.checked}
                                        onChange={() => toggleCheckBox(product.cartProductId)}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <Row>
                                        <Col xs={4}>
                                            <Image
                                                src={`${API_BASE_URL}/images/${product.image}`}
                                                thumbnail
                                                alt={product.name}
                                                width={`80`}
                                                height={`80`}
                                            />

                                        </Col>
                                        <Col xs={8} className="d-flex align-items-center">
                                            {product.name}
                                        </Col>
                                    </Row>
                                </td>
                                <td className="text-center align-middle">
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        value={product.quantity}
                                        onChange={(event) =>
                                            changeQuantity(product.cartProductId, parseInt(event.target.value))}
                                        style={{ width: '80px', margin: '0 auto' }}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    {(product.price * product.quantity).toLocaleString()}원
                                </td>
                                <td className="text-center align-middle">
                                    <Button variant="danger" size="sm" onClick={() => { }}>삭제</Button>
                                </td>
                            </tr>
                        ))

                    ) : (
                        <tr>
                            <td>장바구니가 비어있습니다</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div className="text-end">
                <h3 className="text-end-mt-3">총 주문 금액 : {orderTotalPrice.toLocaleString()}원</h3>
                <Button variant="danger" size="lg" onClick={``}>
                    주문하기
                </Button>
            </div>
        </Container >
    );
}

export default CartList;