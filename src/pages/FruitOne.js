// axios 라이브러리를 이용해서 리액트에서 스프링으로 데이터를 요청
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Table } from "react-bootstrap";


function FruitOne() {
    const [fruit, setFruit] = useState({}); //넘겨받은 과일 11개

    useEffect(() => { //backend 서버에서 데이터 읽어오기
        const url = `${API_BASE_URL}/fruit`; //요청 할 url 

        console.log("Requesting URL:", url); //debugging

        axios
            .get(url, {})
            .then((response) => {

                console.log('응답 받은 데이터');
                console.log(response.data);

                setFruit(response.data);
            });
    }, []);

    return (
        <>
            과일 1개 (FruitOne.js page)
            <Table hover style={{ margin: '5px' }}>
                <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>{fruit.id}</td>
                    </tr>
                    <tr>
                        <td>상품명</td>
                        <td>{fruit.name}</td>
                    </tr>
                    <tr>
                        <td>단가</td>
                        <td>{Number(fruit.price).toLocaleString()}원</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}

export default FruitOne;