// --- 장기 차량 등록 ---
import { useState } from "react";

// 날짜 선택 라이브러리
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./Car.scss";
import { useUser } from "../../contexts/UserContext";

const LongCar = () => {
  const [carNumber, setCarNumber] = useState(""); // 차량 번호
  const [visitDate, setVisitDate] = useState(null); // 장기 방문 사유
  const [reason, setReason] = useState(""); // 장기 방문 등록 함수 가져오기

  const { createPeriod } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지

    // 차량 번호, 방문 날짜 체크
    if (!carNumber || !visitDate) {
      alert("차량 번호와 방문 날짜를 입력해주세요.");
      return;
    }

    // 방문 사유 공백 체크
    if (!reason.trim()) {
      alert("장기 방문 사유를 입력해주세요.");
      return;
    }
    // 날짜  YYYY-MM-DD 형식으로 변환
    const dateISO = visitDate.toISOString().slice(0, 10);

    const res = await createPeriod({
      carNum: carNumber, // 차량번호
      startDateISO: dateISO, // 시작 날짜
      endDateISO: dateISO, // 종료 날짜
      purpose: reason, // 방문 목적
    });

    // 실패 안내문
    if (!res.ok) {
      alert(res.message || "등록 실패");
      return;
    }
    // 성공 안내문
    alert("장기 방문 차량 등록 성공!");

    // 입력값 초기화
    setCarNumber("");
    setVisitDate(null);
    setReason("");
  };

  return (
    <form className="long-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label>차량 번호</label>
        <input
          type="text"
          value={carNumber}
          placeholder="차량번호를 입력해주세요"
          onChange={(e) => setCarNumber(e.target.value)}
        />
      </div>

      <div className="input-group">
        <p>방문 날짜</p>
        <DatePicker
          selected={visitDate}
          onChange={(date) => setVisitDate(date)}
          placeholderText="방문 날짜를 선택해주세요"
          dateFormat="yyyy.MM.dd"
        />
      </div>

      <div className="input-group">
        <label>방문 사유 (장기 방문 필수)</label>
        <input
          type="text"
          value={reason}
          placeholder="방문 사유를 입력해주세요"
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className="car-btn">
        <button type="submit">차량 등록</button>
      </div>
    </form>
  );
};

export default LongCar;
