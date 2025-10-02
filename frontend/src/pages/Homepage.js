import { useEffect, useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function App() { //products: 메인 화면에 보여주고자 하는 상품 정보들
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        //이미지 파일 이름에 bigs 가 들어간 것만 표기
        const url = `${API_BASE_URL}/product?filter=bigs`;
        axios
            .get(url)
            .then((response) => setProducts(response.data))
            .catch((error) => console.log(error));
    }, []);

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const detailedView = (id) => {
        navigate(`/product/detail/${id}`);

    };

    return (
        <Container className="mt-4">
            <Carousel>
                {products.map((bean) => (
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={`${API_BASE_URL}/images/${bean.image}`}
                            alt={bean.name}
                            style={{ cursor: 'pointer' }}
                            onClick={() => detailedView(bean.id)} //상세보기
                        />
                        <Carousel.Caption>
                            <h3>{bean.name}</h3>
                            <p>
                                {bean.description.length > 10
                                    ? bean.description.substring(0, 10) + '...'
                                    : bean.description}
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container >
    );
}

export default App;