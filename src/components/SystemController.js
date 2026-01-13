// 방문 차량 등록신청, 정기 차량 등록 신청, 추가 차량 등록

import { useState } from "react";
import AddCar from "./mode/AddCar";
import VisitCar from "./mode/VisitCar";
import LongCar from "./mode/LongCar";
import SaleCar from "./mode/SaleCar";
import SaleCarIssue from "./mode/SaleCarIssue";
import "./SystemController.scss";

const SystemController = ({ role }) => {
  const initialMode = role === "resident" ? "VISITCAR" : "SALECAR";
  const [mode, setMode] = useState(initialMode);

  return (
    <section id="controller">
      <div className="btn-wrap">
        {role === "resident" && (
          <>
            <button
              className={mode === "VISITCAR" ? "active" : ""}
              onClick={() => setMode("VISITCAR")}
            >
              방문 차량 등록 신청
            </button>
            <button
              className={mode === "LONGCAR" ? "active" : ""}
              onClick={() => setMode("LONGCAR")}
            >
              장기 차량 등록 신청
            </button>
            <button
              className={mode === "ADD" ? "active" : ""}
              onClick={() => setMode("ADD")}
            >
              추가 차량 등록 신청
            </button>
          </>
        )}

        {role === "business" && (
          <>
            <button
              className={mode === "SALECAR" ? "active" : ""}
              onClick={() => setMode("SALECAR")}
            >
              주차 할인권 발급
            </button>
            <button
              className={mode === "SALECARISSUE" ? "active" : ""}
              onClick={() => setMode("SALECARISSUE")}
            >
              주차 할인권 정산
            </button>
            <button
              className={mode === "ADD" ? "active" : ""}
              onClick={() => setMode("ADD")}
            >
              추가 차량 등록 신청
            </button>
          </>
        )}
      </div>

      <div className="mode-content">
        {mode === "VISITCAR" && <VisitCar />}
        {mode === "LONGCAR" && <LongCar />}
        {mode === "ADD" && <AddCar />}
        {mode === "SALECAR" && <SaleCar />}
        {mode === "SALECARISSUE" && <SaleCarIssue />}
      </div>
    </section>
  );
};
export default SystemController;
