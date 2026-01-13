// --- 공통 페이지 구성 ---

import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import "./Layout.scss";
import Pcbanner from "../pages/Pcbanner";

const Layout = () => {
  return (
    <div>
      <main>
        <Header />
        <Outlet />
      </main>
      <Pcbanner/>
    </div>
  );
};

export default Layout;
