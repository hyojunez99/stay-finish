import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./layout/Layout";
import LoginPages from "./pages/LoginPages";
import SignUpPages from "./pages/SignUpPages";
import ResidentDashboard from "./pages/ResidentDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentFav from "./pages/ResidentFav";
import ResidentMypage from "./pages/ResidentMypage";
import BusinessMypage from "./pages/BusinessMypage";
import OkPage from "./pages/OkPage";
import BoardPage from "./pages/BoardPage";
import SalePage from "./pages/SalePage";
import "./assets/scss/global.scss";
import Visited from "./pages/Visited";
import ControlPage from './pages/ControlPage'

const TempButtons = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>임시 이동버튼</h2>
      {/* 테스트용 역할별 이동 버튼 */}
      <button onClick={() => navigate("/app/resident")}>
        입주민 페이지로 이동
      </button>
      <button onClick={() => navigate("/app/business")}>
        사업자 페이지로 이동
      </button>
      <button onClick={() => navigate("/app/admin")}>
        관리자 페이지로 이동
      </button>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        {/* 로그인 / 회원가입 페이지 */}
        <Route path="/" element={<LoginPages />} />
        <Route path="/signup" element={<SignUpPages />} />
        {/* 공통 Layout*/}
        <Route path="/app" element={<Layout />}>
          {/* 입주민 페이지 */}
          <Route path="resident">
            <Route index element={<ResidentDashboard />} />
            <Route path="favorite" element={<ResidentFav />} />
            <Route path="mypage" element={<ResidentMypage />} />
            <Route path="visited" element={<Visited />} />
          </Route>

          {/* 사업자 페이지 */}
          <Route path="business">
            <Route index element={<BusinessDashboard />} />
            <Route path="mypage" element={<BusinessMypage />} />
            <Route path="visited" element={<Visited />} />
          </Route>

            {/* 관리자 페이지 */}
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="board" element={<BoardPage />} />
              <Route path="okpage" element={<OkPage />} />
              <Route path="salepage" element={<SalePage />} />
            </Route>
          </Route>
          <Route path="Control" element={<ControlPage />}></Route>
        </Routes>
        {/* 임시버튼 */}
        {/* <TempButtons /> */}
      </HashRouter>
  );
};

export default App;
