import "./AdminDashboard.scss";
import { useNavigate } from "react-router-dom";
import AdminImg from "../assets/images/admin/admin-img.png";
import React, { useState } from "react";
import ParkingInfo from "../components/ParkingInfo";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("--:--");
  const [endTime, setEndTime] = useState("--:--");

  const handleStart = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setStartTime(`${hours}:${minutes}`);
    setEndTime("--:--"); // 출근 시 퇴근 초기화
  };

  const handleEnd = () => {
    if (startTime === "--:--") return; // 출근 안 했으면 종료 금지
    const [h, m] = startTime.split(":").map(Number);
    const d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    const end = new Date(d.getTime() + 6 * 60 * 60 * 1000); // 6시간 뒤
    const endHours = String(end.getHours()).padStart(2, "0");
    const endMinutes = String(end.getMinutes()).padStart(2, "0");
    setEndTime(`${endHours}:${endMinutes}`);
  };
 //로그아웃 처리
  const handleout = ()=>{
    navigate("/");
  };
  return (
    <div className="desktop">
      <div className="admin-dashboard">
        {/* 상단 초록 카드~ */}
        <section className="card">
          <div className="admin-header">
            <div className="top-text">
              <p className="apt-name">스테이아파트</p>
              <p className="role">관리자</p>
            </div>
          </div>

          {/* 기존 관리자 정보 */}
          <div className="admin-box">
            <img className="admin" src={AdminImg} alt="관리사무소 사람" />
            <div className="admin-info">
              <p className="admin-name">홍길동</p>
              <p className="time">
                출근 시간: {startTime} &nbsp; 퇴근 시간: {endTime}
              </p>
              <div className="admin-buttons">
                <button className="btn-gray" onClick={handleStart}>
                  출근
                </button>
                <button className="btn-green" onClick={handleEnd}>
                  퇴근
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 메뉴 섹션 */}
        <section className="menu">
          <div className="menu-card">
            <ParkingInfo hideColorBox={true} />
          </div>
          <button
            className="menu-card"
            onClick={() => navigate("/app/admin/board")}
          >
            <h3>문의 게시판</h3>
            <p>
              문의하고 싶은 사항은
              <br /> 게시판을 사용해주세요.
            </p>
          </button>
        </section>

        {/* 추가 기능 섹션 */}
        <section className="extra">
          <button
            className="wide-card"
            onClick={() => navigate("/app/admin/notice")}
          >
            공지사항 작성
          </button>
          <button onClick={() => navigate("/app/admin/okpage")}>
            입주민 차량 등록
          </button>
          <button onClick={() => navigate("/app/admin/salepage")}>
            상가 할인권 정산 목록
          </button>
        </section>
         {/* 로그아웃 버튼 */} <button className="logout-btn" onClick={handleout}>로그아웃</button>
      </div>
    </div>
  );
};

export default AdminDashboard;