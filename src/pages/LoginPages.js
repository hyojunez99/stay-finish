import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import logo from "../assets/images/Logo/logo-2.png";
import "./LoginPages.scss";
const LoginPages = () => {
  const navigate = useNavigate();
  const { doLogin } = useUser();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = loginId.trim();
    const pw = password.trim();

    if (!id || !pw) {
      alert("아이디/비밀번호를 입력해주세요.");
      return;
    }

    const res = await doLogin(id, pw);

    // 승인대기/에러 처리
    if (!res.ok) {
      if (res.status === "PENDING") {
        alert(res.message || "관리자 승인 대기 중입니다.");
      } else {
        alert(res.message || "로그인 실패");
      }
      return;
    }

    // ✅ 성공 시: user_type으로 이동
    const role = res.profile.user_type;

    if (role === "APT") navigate("/app/resident");
    else if (role === "STORE") navigate("/app/business");
    else if (role === "ADMIN") navigate("/app/admin");
    else {
      alert("알 수 없는 권한입니다.");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-logo-wrap">
        <img src={logo} alt="logo" className="login-logo" />
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          placeholder="아이디를 입력해주세요"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
        />

        <button type="submit">로그인</button>
      </form>

      <div className="login-links">
        <button type="button" onClick={() => alert("현재 준비중인 기능입니다.")}>
          아이디 찾기
        </button>
        <button type="button" onClick={() => alert("현재 준비중인 기능입니다.")}>
          비밀번호 찾기
        </button>
      </div>

      <div className="login-signup">
        <p>아직 아이디가 없으신가요?</p>
        <button type="button" onClick={() => navigate("/signup")}>
          회원가입 하러가기
        </button>
      </div>
    </div>
  );
};
export default LoginPages;