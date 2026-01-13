// ParkingInfo.js
import { fetchParkingStatusSummary } from "../api/parkingAPI";
import { useState, useEffect } from "react";
import "./ParkingInfo.scss";

const ParkingInfo = ({ hideColorBox }) => {
  const [totalparking, setTotalParking] = useState([]);
  const [spotsparking, setspotsParking] = useState([]);
  const [emptyparking, setemptyParking] = useState([]);

  useEffect(() => {
    const loadsummarydata = async () => {
      try {
        const { total, occupied, empty } = await fetchParkingStatusSummary();
        setTotalParking(total);
        setspotsParking(occupied);
        setemptyParking(empty);
      } catch (e) {
        console.error(e);
      }
    };
    loadsummarydata();
  }, []);

  return (
    <>
      <div className="info-p">
        <p>총 주차면수 : {totalparking}</p>
        <p>현재 주차 : {spotsparking}</p>
        <p>잔여석 : {emptyparking}</p>
      </div>

      {/* hideColorBox가 true면 렌더하지 않음 */}
      {!hideColorBox && (
        <div className="color-box">
          <div className="regident-box">
            <div className="R"></div>
            <p>아파트 주차 구역</p>
            <div className="R-P"></div>
            <p>주차 중</p>
            <div className="R-S"></div>
            <p>사업자 주차 중</p>
          </div>
          <div className="shop-box">
            <div className="S"></div>
            <p>상가 주차 구역</p>
            <div className="S-P"></div>
            <p>주차 중</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ParkingInfo;
