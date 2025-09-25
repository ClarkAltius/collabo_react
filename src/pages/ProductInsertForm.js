import axios from "axios";
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";

/*
폼 양식 작성
각 컨트롤에 대한 change 이벤트 함수 구현 (ControlChange fuction)

컨트롤 (input type)
컨트롤 (combo type)
FIleSelect 함수
업로드할 이미지 선택에 대한 이벤트 함수 구현 (주의: post 전송방식. input 양식의 type="file"로 작성)

SubmitAction 함수 : 컨트롤에 입력된 내용들을 백엔드로 전송
*/

function ProductInsertForm() {
    const navigate = useNavigate();
    const comment = '상품 등록';
    const initial_value = {
        name: '', price: '', category: '', stock: '', image: '', description: ''
    }; //상품 객체 정보
    //product 는 백엔드에 넘겨줄 상품 등록 정보를 담고 있는 객체.
    const [product, setProduct] = useState(initial_value);
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
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('description', product.description);
        formData.append('category', product.category);
        formData.append('imageFile', imageFile); // 2. Append the actual file object

        try {
            const url = `${API_BASE_URL}/product/insert`;



            //참조 공유. 2 변수가 동일한 곳을 참조
            const parameters = product;

            //얕은 공유 복사 : 왼쪽이 오른쪽의 복사본을 가진다. 깊은 복사는 json.parse나 stringify 를 가리킴
            // const parameters = {...product};
            const config = { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.post(url, FormData);

            console.log(`상품 등록: [${response.data}]`);
            alert('상품이 성공적으로 등록되었습니다.');

            //상품 등록 후 입력 컨트롤 초기화
            setProduct(initial_value);

            //등록 직후 상품 목록 페이지로 이동

            navigate(`/product/list`);

        } catch (error) {
            console.log(`오류 내용 : ${error}`);
            alert('상품 등록에 실패하였습니다.')
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

export default ProductInsertForm;