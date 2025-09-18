import { Route, Routes } from "react-router-dom";
import FruitOne from "./../pages/FruitOne";
import FruitList from "./../pages/FruitList";
import ElementOne from "../pages/ElementOne";
import ElementList from "../pages/ElementList";
import Homepage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";

function AppRoutes() {

    return (
        <Routes>
            {/** path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
            <Route path='/' element={<Homepage />} />
            <Route path='/member/signup' element={<SignupPage />} />
            <Route path='/fruit' element={<FruitOne />} />
            <Route path='/fruit/list' element={<FruitList />} />
            <Route path='/element' element={<ElementOne />} />
            <Route path='/element/list' element={<ElementList />} />

        </Routes>

    );
}

export default AppRoutes;