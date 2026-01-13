// --- 공통 헤더 영역 ---

import { IoPersonSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/images/Logo/EG_logo.png";
import logoImg2 from "../../assets/images/Logo/EGWH_logo.png";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // URL 경로

  // ✅ 로그인/회원가입에서는 공통 헤더 자체를 숨기겠습니다
  const hideHeader =
  location.pathname === "/" || location.pathname === "/signup";
  if (hideHeader) return null;

  // URL에서 role 추출
  let role = null;
  if (location.pathname.startsWith("/app/resident")) {
    role = "resident";
  } else if (location.pathname.startsWith("/app/business")) {
    role = "business";
  } else if (location.pathname.startsWith("/app/admin")) {
    role = "admin";
  }

  // 마이페이지 아이콘 클릭 시
  const handleIconClick = () => {
    if (role === "resident") {
      navigate("/app/resident/mypage");
    } else if (role === "business") {
      navigate("/app/business/mypage");
    }
  };

  // 페이지 마다 이미지 변경
  const isAuthPage = location.pathname === "/";

  // 로고 클릭 시 홈화면
  const handleLogoClick = () => {
    if (isAuthPage) return;
    // resident 페이지
    if (location.pathname.startsWith("/app/resident")) {
      navigate("/app/resident");
      return;
    }
    // business 페이지
    if (location.pathname.startsWith("/app/business")) {
      navigate("/app/business");
      return;
    }
    // admin 페이지
    if (location.pathname.startsWith("/app/admin")) {
      navigate("/app/admin");
      return;
    }
    // 다른 페이지면 홈으로
    navigate("/");
  };

  return (
    <header>
      <div className="header-top">
        <img
          src={isAuthPage ? logoImg : logoImg2}
          alt="logo이미지"
          onClick={handleLogoClick}
        />
        {!isAuthPage && role !== "admin" && (
          <IoPersonSharp className="mypage-icon" onClick={handleIconClick} />
        )}
      </div>
    </header>
  );
};

export default Header;
