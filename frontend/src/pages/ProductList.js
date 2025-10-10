import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";

/*
step01
상품 목록을 상품 아이디 역순으로 읽어 전체 목록을 표기
필드 검색과 페이징 기능은 구현하지 않음

step02
사용자 정보가 'ADMIN' 이면 등록,수정,삭제 버튼이 보이게 코딩. 
삭제 버튼에 대한 기능 구현
*/

function ProductList({ user, item }) {
    const [products, setProducts] = useState([]);

    //페이징 관련 state 정의
    const [paging, setPaging] = useState({
        totalElements: 0,
        pageSize: 6,
        totalPages: 0,
        pageNumber: 0,
        pageCount: 10,
        beginPage: 0,
        endPage: 0,
        pagingStatus: '',

    });


    /*
변수 정의
totalElements : 전체 데이터 개수(165개)
pageSize : 1페이지에 보여 주는 데이터 개수(6개)
totalPages : 전체 페이지 개수(28페이지)
pageNumber : 현재 페이지 번호(20페이지)
pageCount : 페이지 하단 버튼의 개수(10개)
beginPage : 페이징 시작 번호 
endPage : 페이징 끝 번호
pagingStatus : "pageNumber/ totalPages 페이지"
    */


    //springboot에 상품 목록을 요청하기
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`; //요청 할 url. fetch ALL da produkts at once! 

        console.log("Requesting URL:", url); //debugging
        const parameters = {
            params: {
                pageNumber: paging.pageNumber,
                pageSize: paging.pageSize,
            }
        };
        axios
            .get(url, parameters)
            .then((response) => {
                console.log('응답 받은 데이터');
                console.log(response.data.content);
                console.log('Full API Response:', response.data);
                setProducts(response.data.content || []);

                //user has clicked on pagination item. Refresh page
                setPaging((previous) => {
                    const totalElements = response.data.totalElements;
                    const totalPages = response.data.totalPages;
                    const pageNumber = response.data.pageable.pageNumber;
                    //pageSize의 값이 고정이라면 할당 x 해도 무관
                    //가변인 경우 할당 필요
                    // const pageSize = response.data.pageable.pageSize;
                    const pageSize = 10; //지금은 그냥 고정값으로 진행

                    //0base 주의
                    const beginPage = Math.floor(pageNumber / previous.pageCount) * previous.pageCount;
                    const endPage = Math.min(beginPage + previous.pageCount - 1, totalPages - 1);
                    const pagingStatus = `${pageNumber + 1}/ ${totalPages} 페이지`;
                    /*
                변수 정의
                pageSize : 1페이지에 보여 주는 데이터 개수(6개)
                pageCount : 페이지 하단 버튼의 개수(10개)
                beginPage : 페이징 시작 번호 
                endPage : 페이징 끝 번호
                pagingStatus : "pageNumber/ totalPages 페이지"
                    */

                    return {
                        ...previous,
                        totalElements: totalElements,
                        totalPages: totalPages,
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        beginPage: beginPage,
                        endPage: endPage,
                        pagingStatus: pagingStatus,
                    }

                });

            })
            .catch((error) => {
                console.log(error)
            });

    }, [paging.pageNumber]); //empty dependency array means this runs only once on mount. Now that paging.pageNumber is here, it refreshes every time it changes.

    const navigate = useNavigate();

    const makeAdminButtons = (item, user, navigate) => {
        if (user?.role !== 'ADMIN') return null;
        return (
            <div className="d-flex justify-content-center">
                <Button
                    variant="warning"
                    className="mb-2"
                    size="sm"
                    onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/product/update/${item.id}`);
                        alert(`[${item.id}]번 상품 수정. 수정 페이지로 이동합니다.`);
                    }}
                >
                    수정
                </Button>
                &nbsp;
                <Button
                    variant="danger"
                    className="mb-2"
                    size="sm"
                    onClick={async (event) => {
                        event.stopPropagation();
                        const isDelete = window.confirm(`'${item.name}' 상품을 삭제하시겠습니까?`);
                        if (isDelete === false) {
                            alert(`'${item.name}' 상품 삭제를 취소 하셨습니다.`);
                            return;
                        }
                        try {
                            await axios.delete(`${API_BASE_URL}/product/delete/${item.id}`);
                            alert(`'${item.name}' 상품을 성공적으로 삭제하셨습니다.`);

                            setProducts(currentProducts => currentProducts.filter(product => product.id !== item.id)
                            );

                            navigate(`/product/list`);


                        } catch (error) {
                            console.log(error);
                            alert(`상품 삭제 실패: ${error.response.data || error.message}`)
                        }
                    }}
                >
                    삭제
                </Button>
            </div>
        )
    };


    return (
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>
            <Link to={`/product/insert`}>
                {user?.role === 'ADMIN' && (
                    <Button variant="primary" className="mb-3">
                        상품 등록
                    </Button>
                )}
            </Link>
            {/**필드 검색 영역 */}
            {/**자료 보여주는 영역 */}
            <Row>
                {/**products는 상품 배열, item은 상품 1개를 의미 */}
                {products.map((item) => (
                    <Col key={item.id} md={4} className="mb-4">
                        <Card onClick={() => navigate(`/product/detail/${item.id}`)}
                            className="h-100"
                            style={{ cursor: 'pointer' }}>
                            <Card.Img
                                variant="top"
                                src={`${API_BASE_URL}/images/${item.image}`}
                                alt={item.name}
                                style={{ width: '100%', height: '200px' }}
                            />
                            <Card.Body>
                                <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                                    {/**borderCollapse : 각 셀의 테두리를 합칠 것인지 별개로 보여줄지 설정하는 속성 */}
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '70%', padding: '4px', border: 'none' }}>
                                                <Card.Title>{item.name}({item.id})</Card.Title>

                                            </td>
                                            {/**rowSpan 속성은 행방향 병합시 사용 ↔ colSpan */}
                                            <td rowSpan={2} style={{ padding: '4px', border: 'none', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {makeAdminButtons(item, user, navigate)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '70%', padding: '4px', border: 'none' }}>
                                                <Card.Text>가격: {item.price.toLocaleString()} 원</Card.Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/**페이징 처리 영역 */}
            <Pagination className="justify-content-center mt-4">
                <Pagination.First
                    onClick={() => {
                        console.log(`First Page Button Click. Move to page 0.`);
                        setPaging((previous) => ({ ...previous, pageNumber: 0 }));
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button">
                    첫 페이지
                </Pagination.First>
                <Pagination.Prev
                    onClick={() => {
                        const goToPage = paging.beginPage - 1;
                        console.log(`Prev Page Button Click. Move to page ${goToPage}.`);
                        setPaging((previous) => ({ ...previous, pageNumber: goToPage }));
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button">
                    이전
                </Pagination.Prev>

                {/*숫자 링크가 들어가는 공간 */}
                {[...Array(paging.endPage - paging.beginPage + 1)].map((_, idx) => {
                    const pageIndex = paging.beginPage + idx + 1;
                    return (
                        <Pagination.Item
                            key={pageIndex}
                            active={paging.pageNumber === (pageIndex - 1)}
                            onClick={() => {
                                console.log(`Go to ${pageIndex}.`);
                                setPaging((previous) => ({ ...previous, pageNumber: pageIndex - 1 }));
                            }}                        >
                            {pageIndex}
                        </Pagination.Item>
                    )
                })}
                {/* <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item active>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item> */}
                <Pagination.Next
                    onClick={() => {
                        const goToPage = paging.endPage + 1;
                        console.log(`Next Page Button Click. Move to page ${goToPage}.`);
                        setPaging((previous) => ({ ...previous, pageNumber: goToPage }));
                    }}
                    disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
                    as="button">
                    다음
                </Pagination.Next>
                <Pagination.Last
                    onClick={() => {
                        const goToPage = paging.totalPages - 1;
                        console.log(paging.totalPages)
                        console.log(`Last Page Button Click. Move to page ${goToPage}.`);
                        setPaging((previous) => ({ ...previous, pageNumber: goToPage }));
                    }}
                    disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
                    as="button">
                    마지막 페이지
                </Pagination.Last>
            </Pagination>
        </Container>
    );
}

export default ProductList;