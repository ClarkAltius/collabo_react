import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";

function ElementList() {
    const [elementList, setElementList] = useState([]);
    useEffect(() => {
        const url = `${API_BASE_URL}/element/list`;
        console.log("URL Request: " + url);

        axios
            .get(url, {})
            .then((response) => {
                console.log(response.data);
                setElementList(response.data);
            })
    }, []);

    return (
        <>
            <Table hover style={{ margin: '5px' }}>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>카테고리</th>
                        <th>가격</th>
                        <th>재고</th>
                        <th>이미지</th>
                        <th>설명</th>
                    </tr>
                </thead>
                <tbody>
                    {elementList.map((element) =>
                        <tr key={element.id}>
                            <td>{element.id}</td>
                            <td>{element.name}</td>
                            <td>{element.category}</td>
                            <td>{element.price}</td>
                            <td>{element.stock}</td>
                            <td>{element.image}</td>
                            <td>{element.description}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    );
}

export default ElementList;