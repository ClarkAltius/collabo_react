import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Table } from "react-bootstrap";

function ElementOne() {
    const [element, setElement] = useState({});
    useEffect(() => {
        const url = `${API_BASE_URL}/element`; //요청 할 url

        console.log("requesting url:", url);

        axios
            .get(url, {})
            .then((response) => {
                console.log("응답 받은 데이터: " + response.data);
                setElement(response.data);
            });
    }, []);

    return (
        <>
            상품 1개 (Element.js page)
            <Table hover style={{ margin: '4px' }}>
                <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>{element.id}</td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td>{element.name}</td>
                    </tr>
                    <tr>
                        <td>가격</td>
                        <td>{element.price}</td>
                    </tr>
                    <tr>
                        <td>카테고리</td>
                        <td>{element.category}</td>
                    </tr>
                    <tr>
                        <td>재고</td>
                        <td>{element.stock}</td>
                    </tr>
                    <tr>
                        <td>이미지</td>
                        <td>{element.image}</td>
                    </tr>
                    <tr>
                        <td>설명</td>
                        <td>{element.description}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}

export default ElementOne;