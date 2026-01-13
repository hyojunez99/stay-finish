import { useState} from "react";
import { useParkingBoard } from "../contexts/ParkingContext"; 
import './ControlPage.scss'

const ControlPage = () => {
  const [carnum, setCarnum] = useState("");

  const { enter_car, exit_car} = useParkingBoard();

  //버튼처리
  const submitbtn = (t) => {
    if (t === "in") {
      enter_car(carnum);
      
    } else if (t === "out") {
      exit_car(carnum);
    }
  };

  return (
    <div className="cotrol-box">
      <h1>입차/출차</h1>
      <input
        type="text"
        value={carnum}
        onChange={(e) => {
          setCarnum(e.target.value);
        }}
        placeholder="차량번호를 입력하세요"
      />
      <div className="btn-inout">
      <button onClick={() => submitbtn("in")}>입차</button>
      <button onClick={() => submitbtn("out")}>출차</button>
    </div>
    </div>
  );
};

export default ControlPage;
