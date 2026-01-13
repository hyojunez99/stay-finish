// --- 추가 차량 등록 ---
import { useState } from "react";
import "./Car.scss";
import { useUser } from "../../contexts/UserContext";

const AddCar = () => {
  const [carNumber, setCarNumber] = useState("");
  const [carName, setCarName] = useState("");

  const { saveAddCar } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 차량번호와 명의자 공백 체크
    if (!carNumber || !carName) {
      alert("차량번호와 명의자를 모두 입력해주세요.");
      return;
    }

    // 추가 차량번호 전달
    const res = await saveAddCar(carNumber, carName);

    // 실패 안내문
    if (!res.ok) {
      alert(res.message || "등록 실패");
      return;
    }

    // 성공 안내문
    alert("추가 차량 등록 성공!");

    // 입력값 초기화
    setCarNumber("");
    setCarName("");
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
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
        <label>차량 명의자</label>
        <input
          type="text"
          value={carName}
          placeholder="차량 명의자를 입력해주세요"
          onChange={(e) => setCarName(e.target.value)}
        />
      </div>

      <div className="car-btn">
        <button type="submit">차량 등록</button>
      </div>
    </form>
  );
};

export default AddCar;
