import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import logo from "../assets/images/Logo/EG_logo.png";
import "./SignUpPages.scss";

const Field = ({
  label,
  helper,
  value,
  onChange,
  type = "text",
  name,
  autoComplete,
}) => {
  const hasValue = value && value.trim().length > 0;

  return (
    <div className={`su-field ${hasValue ? "has-value" : ""}`}>
      <input
        className="su-input"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />

      <div className="su-overlay">
        <div className="su-label">{label}</div>
        <div className="su-helper">{helper}</div>
      </div>
    </div>
  );
};

const SignUpPages = () => {
  const navigate = useNavigate();
  const { doSignup } = useUser();

  const [openType, setOpenType] = useState(false);
  const [userType, setUserType] = useState(""); // "APT" | "STORE"

  const [userName, setUserName] = useState("");
  const [dongHo, setDongHo] = useState("");
  const [phone, setPhone] = useState(""); // UI 유지(현재 DB 미저장)
  const [carNum, setCarNum] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const typeLabel = useMemo(() => {
    if (userType === "APT") return "입주민";
    if (userType === "STORE") return "사업자";
    return "가입 유형을 선택해주세요";
  }, [userType]);

  const selectType = (type) => {
    setUserType(type);
    setOpenType(false);
  };

  const onSubmit = async () => {
    if (!userType) return alert("가입 유형을 선택해주세요.");
    if (!userName.trim()) return alert("이름(상호명)을 입력해주세요.");
    if (!dongHo.trim()) return alert("동/호수를 입력해주세요.");
    if (!carNum.trim()) return alert("차량번호를 입력해주세요.");
    if (!loginId.trim()) return alert("아이디를 입력해주세요.");
    if (!password.trim()) return alert("비밀번호를 입력해주세요.");

    const form = {
      userType,
      userName: userName.trim(),
      dongHo: dongHo.trim(),
      carNum: carNum.trim(),
      loginId: loginId.trim(),
      password: password.trim(),
    };

    const res = await doSignup(form);

    if (!res.ok) {
      alert(res.message || "회원가입 실패");
      return;
    }

    alert("승인 요청이 완료되었습니다.\n관리자 승인 후 로그인 가능합니다.");
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="signup-wrap">
      {/* ✅ 상단 로고 (맨 위) */}
      <div className="su-logo-wrap">
        <img
          src={logo}
          alt="Stay 로고"
          onClick={handleBack}
          className="su-logo"
        />
      </div>

      {/* 가입유형 드롭다운 */}
      <div className="su-type">
        <button
          type="button"
          className="su-type-btn"
          onClick={() => setOpenType((v) => !v)}
        >
          {typeLabel}
          <span className={`su-caret ${openType ? "open" : ""}`}>▼</span>
        </button>

        {openType && (
          <div className="su-type-menu">
            <button type="button" onClick={() => selectType("APT")}>
              입주민
            </button>
            <button type="button" onClick={() => selectType("STORE")}>
              사업자
            </button>
          </div>
        )}
      </div>

      {/* 입력 폼 */}
      <div className="su-form">
        <Field
          label="이름(상호명)"
          helper="이름을 기재해주세요."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          name="user_name"
          autoComplete="name"
        />

        <Field
          label="동/호수"
          helper="예) 208동 1240호"
          value={dongHo}
          onChange={(e) => setDongHo(e.target.value)}
          name="dong_ho"
        />

        <Field
          label="연락처"
          helper="000-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          name="phone"
          autoComplete="tel"
        />

        <Field
          label="차량번호"
          helper="차량번호를 입력해주세요"
          value={carNum}
          onChange={(e) => setCarNum(e.target.value)}
          name="car_num"
        />

        <Field
          label="사용 할 아이디를 입력해주세요"
          helper="영어와 숫자를 포함한 아이디를 기재해주세요"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          name="login_id"
          autoComplete="username"
        />

        <Field
          label="비밀번호"
          helper="영어, 숫자, 특수기호를 포함한 비밀번호를 기재해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          type="password"
          autoComplete="new-password"
        />

        <button className="su-submit" type="button" onClick={onSubmit}>
          승인요청
        </button>
      </div>

      <p className="su-policy">개인정보 처리방침</p>
    </div>
  );
};

export default SignUpPages;
