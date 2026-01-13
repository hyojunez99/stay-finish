// --- 주차 할인권 발급 ---
import { useState } from "react";
import "./Car.scss";
import { useUser } from "../../contexts/UserContext";

const SaleCar = () => {
  const [carNumber, setCarNumber] = useState("");
  const [carSale, setCarSale] = useState("");

  const { issueStoreDiscount } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지

    // 공백 문 안내문
    if (!carNumber || !carSale) {
      alert("차량번호와 할인권 시간을 선택해주세요.");
      return;
    }
    // 할인권 시간을 분 으로 변환
    const minutes = parseInt(carSale, 10);
    // 할인권 발급 분 단위로 전달
    const res = await issueStoreDiscount(minutes,carNumber);

    // 실패 안내문
    if (!res.ok) {
      alert(res.message || "발급 실패");
      return;
    }

    // 성공 요약 안내문
    alert(`차량 ${carNumber} 할인권 ${minutes}분 발급 완료!`);
    setCarNumber("");
    setCarSale("");
  };

  return (
    <form className="sale-form" onSubmit={handleSubmit}>
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
        <label>할인권 선택</label>
        <select value={carSale} onChange={(e) => setCarSale(e.target.value)}>
          <option value="">할인권 시간을 선택해주세요</option>
          <option value="30">30분</option>
          <option value="60">1시간</option>
          <option value="90">1시간 30분</option>
          <option value="120">2시간</option>
        </select>
      </div>
      <div className="car-btn">
        <button type="submit">할인권 발급</button>
      </div>
    </form>
  );
};

export default SaleCar;
