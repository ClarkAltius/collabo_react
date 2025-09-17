import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";

function FruitList() {

    const [fruitList, setFruitList] = useState([]); //넘어온 과일 목록
    useEffect(() => {
        const url = `${API_BASE_URL}/fruit/list`;
        axios.get(url, {})
            .then((response) => {
                console.log(response.data);
                setFruitList(response.data);
            })

    }, []);
    return (
        <>
            <Table hover style={{ margin: '5px' }}>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>상품명</th>
                        <th>단가</th>
                    </tr>
                </thead>
                <tbody>
                    {fruitList.map((fruit) =>
                        <tr key={fruit.id}>
                            <td>{fruit.id}</td>
                            <td>{fruit.name}</td>
                            <td>{Number(fruit.price).toLocaleString()}원</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    );
}

export default FruitList;