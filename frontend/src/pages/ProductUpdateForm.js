import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";
// //useParams 혹은 url에 들어있는 동적 파라미터 값을 챙길 때 사용

import { useParams } from "react-router-dom";
import App from "./Homepage";

/*
상품 수정 페이지입니다.
상품 등록과 다른 점은 인풋컨트롤에 데이터베이스에 객체를 불러와서 populate 시킨다는 점입니다. useEffect 훅 사용

기존 폼 양식 재활용
각 컨트롤에 대한 change 이벤트 함수 구현 (ControlChange fuction)

controlchange, fileselect 함수는 상품등록과 동일

컨트롤 (input type)
컨트롤 (combo type)

SubmitAction 함수 : 컨트롤에 입력된 내용들을 백엔드로 전송
*/

function ProductUpdateForm() {

    const { id } = useParams();
    console.log(`수정 할 상품 번호: ${id}`);

    const navigate = useNavigate();
    const comment = '상품 수정';
    const initial_value = {
        name: '', price: '', category: '', stock: '', image: '', description: ''
    }; //상품 객체 정보
    //product 는 백엔드에 넘겨줄 상품 수정 정보를 담고 있는 객체.
    const [product, setProduct] = useState(initial_value);

    //id 사용하여 기존 입력한 상품 가져오기
    useEffect(() => {
        const url = `${API_BASE_URL}/product/update/${id}`;
        axios
            .get(url)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                alert(`상품 [${id}]번 오류 발생 : ${error}`)
                console.log(`상품 [${id}]의 정보를 읽어 오지 못했습니다.`)
            });

    }, []); //id 값이 변경될 때 마다 ㅗ하면을 re-render

    const [imageFile, setImageFile] = useState(null); // 실제 이미지 파일 객체를 저장



    //폼 양식에서 어떠한 컨트롤의 값이 변경되었습니다. 
    const ControlChange = (event) => {
        const { name, value } = event.target;
        console.log(`컨트롤 : ${name}, 값: ${value}`)

        //전개 연산자 사용해서 이전 컨트롤 값들을 보존
        setProduct({ ...product, [name]: value })
    }

    const FileSelect = (event) => {
        const { name, files } = event.target;
        const file = event.target.files[0];
        setImageFile(file); // 실제 파일 객체를 state에 저장


        //FileReader는 웹 브라우저에서 제공하는 내장 객체. 파일 읽기에 사용.
        //js에서 파일을 읽어서 이를 데이터로 처리하는 데 사용. 
        const reader = new FileReader;

        //↓ 이 함수는 파일 객체를 문자열 형태로 반환하는 역할을 한다. 파일 객체를 문자열 (base64 encoding)로 변환.

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            const result = reader.result;
            console.log(result);
            //base64 encoding으로 state 에 저장 (문자열)

            setProduct({ ...product, [name]: result })

        }

        console.log('그림을 선택하셨습니다.')

    }

    const SubmitAction = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('id', product.id);
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('description', product.description);
        formData.append('category', product.category);
        formData.append('imageFile', imageFile); // 2. Append the actual file object

        if (product.category === "-") {
            alert('카테고리를 선택하시오');
            return;; //수정 중단

        } else {

        }

        try {
            const url = `${API_BASE_URL}/product/update/${id}`;
            // const url = `${API_BASE_URL}/product/update/`;



            //참조 공유. 2 변수가 동일한 곳을 참조
            const parameters = product;

            //얕은 공유 복사 : 왼쪽이 오른쪽의 복사본을 가진다. 깊은 복사는 json.parse나 stringify 를 가리킴
            // const parameters = {...product};
            // const config = { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.put(url, formData);

            console.log(`상품 수정: [${response.data}]`);
            alert('상품이 성공적으로 수정되었습니다.');

            //상품 수정 후 입력 컨트롤 초기화
            setProduct(initial_value);

            //수정 직후 상품 목록 페이지로 이동

            navigate(`/product/list`);

        } catch (error) {
            console.log(`오류 내용 : ${error}`);
            alert('상품 수정에 실패하였습니다.')
        }

    }

    return (
        <Container>
            <h1>{comment}</h1>
            <Form onSubmit={SubmitAction}>
                <Form.Group className="mb-3">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="이름을(를) 입력해주세요"
                        name="name"
                        value={product.name}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가격</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="가격을(를) 입력해주세요"
                        name="price"
                        value={product.price}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>재고</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="재고을(를) 입력해주세요"
                        name="stock"
                        value={product.stock}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>상품 설명</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="상품 설명을(를) 입력해주세요"
                        name="description"
                        value={product.description}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>
                {/** 이미지는 type="file" 이어야 하고, 이벤트 처리 함수를 별개로 따로 만든다 */}
                <Form.Group className="mb-3">
                    <Form.Label>이미지</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={FileSelect}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>카테고리</Form.Label>
                    <Form.Select
                        name="category"
                        onChange={ControlChange}
                        required>
                        {/** 자바의 Enum 열거형 타입에서 사용한 대문자를 반드시 사용해야 작동함 */}
                        <option value="-">카테고리를 선택해주세요</option>
                        <option value="BREAD">빵</option>
                        <option value="BEVERAGE">음료</option>
                        <option value="CAKE">케이크</option>
                    </Form.Select>
                </Form.Group>
                <Button variant='primary' type='submit' size='lg'>
                    {comment}
                </Button>
            </Form>
        </Container>
    );
}

export default ProductUpdateForm;