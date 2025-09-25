import { Route, Routes } from "react-router-dom";
import FruitOne from "./../pages/FruitOne";
import FruitList from "./../pages/FruitList";
import ElementOne from "../pages/ElementOne";
import ElementList from "../pages/ElementList";
import Homepage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import ProductList from "../pages/ProductList.js";
import ProductInsertForm from "../pages/ProductInsertForm.js";
import ProductUpdateForm from "../pages/ProductUpdateForm.js";


function AppRoutes({ user, handleLoginSuccess }) {
    //user : 사용자 정보를 저장하고 있는 객체
    //handleLoginSuccess : 로그인 성공시 동작할 액션

    return (
        <Routes>
            {/** path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
            <Route path='/' element={<Homepage />} />
            <Route path='/member/signup' element={<SignupPage />} />
            <Route path='/member/login' element={<LoginPage setUser={handleLoginSuccess} />} />
            <Route path='/fruit' element={<FruitOne />} />
            {/** 로그인 여부에 따라 상품목록 페이지 다르게 보여야 함. user 프롭스 넘겨줌 */}
            <Route path='/product/list' element={<ProductList user={user} />} />
            <Route path='/product/insert' element={<ProductInsertForm user={user} />} />
            {/**기호 :id 는 변수처럼 동작하는 매개 변수. ProductUpdateForm.js 파일에서 참조 */}
            <Route path='/product/update/:id' element={<ProductUpdateForm user={user} />} />
            <Route path='/fruit/list' element={<FruitList />} />
            <Route path='/element' element={<ElementOne />} />
            <Route path='/element/list' element={<ElementList />} />

        </Routes>

    );
}

export default AppRoutes;