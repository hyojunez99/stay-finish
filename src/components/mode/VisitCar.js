// --- 방문 차량 등록 ---
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Car.scss";
import { useUser } from "../../contexts/UserContext";
// import { useParkingBoard } from "../../contexts/ParkingContext";

const VisitCar = () => {
  const [carNumber, setCarNumber] = useState(""); // 차량 번호
  const [visitDate, setVisitDate] = useState(null); // 방문 날짜
  const [reason, setReason] = useState(""); // 방문 사유
  const { createDaily } = useUser();
  const [loading, setLoading] = useState(false);
  // const { enter_car, refreshBoard } = useParkingBoard(); // 주차 현황판

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수값 검증
    if (!carNumber || !visitDate) {
      alert("차량 번호와 방문 날짜를 입력해주세요.");
      return;
    }

    const dateISO = formatDate(visitDate);
    // const today = formatDate(new Date());

    setLoading(true);

    try {
      // 방문 차량 등록
      const res = await createDaily({ carNum: carNumber, dateISO });
      if (!res.ok) {
        alert(res.message || "등록 실패");
        return;
      }

      // // 당일 방문 차량이면 바로 입차
      // if (dateISO === today) {
      //   await enter_car(carNumber);
      // }

      // // 현황판 갱신
      // await refreshBoard();

      // 성공 알림
      alert(`방문 차량 등록 완료: ${carNumber}`);

      // 입력값 초기화
      setCarNumber("");
      setVisitDate(null);
      setReason("");
    } catch (err) {
      console.error(err);
      alert("방문 차량 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="visit-form" onSubmit={handleSubmit}>
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
        <label>방문 사유 (장기 방문 시)</label>
        <input
          type="text"
          value={reason}
          placeholder="장기 등록 페이지에서 사용됩니다"
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {/* 등록 버튼 */}
      <div className="car-btn">
        <button type="submit" disabled={loading}>
          {loading ? "등록 중..." : "차량 등록"}
        </button>
      </div>
    </form>
  );
};

export default VisitCar;
