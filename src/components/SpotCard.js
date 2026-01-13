import { useParkingBoard } from "../contexts/ParkingContext";
import { useState, useEffect } from "react";
//주차 칸

const SpotCard = ({data}) => {
  const { regist_check,adjustment_check } = useParkingBoard();
  const isCarnum = data.occupant_car ? true : false;
  const isResident = data.zone === 'APT';
  const [regist, setRegist] = useState(null);
  const [adjustment, setAdjustment] = useState(null);
  

  const cartype = {
  APT: "입주민",
  STORE: "사업자",
  DAILY: "예약방문",
  PERIOD: "장기방문",
  };
  useEffect(() => {
    if (!data?.occupant_car) {
      setRegist(null);
      setAdjustment(null);
      return;
    }
    const fetchRegist = async () => {
    const result = await regist_check(data.occupant_car);
    const adjustment_result = await adjustment_check(data.occupant_car);
    setRegist(result);
    setAdjustment(adjustment_result);
  };

  fetchRegist();
  
  }, [data?.occupant_car, regist_check,adjustment_check]);

  if(isResident){
    //아파트표시카드
      return (
    <div 
      className={`spot-card 
        ${isResident?'resident':'shop'} 
        ${isCarnum ? 'carnum' : ''}
        ${isCarnum ? regist?.car_Type :''} 
      `}
    >
      <p>{data.spot_id}</p>
      <p>{data.occupant_car}</p>
      <p>{isCarnum?(cartype[regist?.car_Type] ?? "일반방문"):''}</p>
    </div>
  )
  } else{
    //상가표시카드
      return (
    <div 
      className={`spot-card 
        ${isResident?'resident':'shop'} 
        ${isCarnum ? 'carnum' : ''}
        ${isCarnum ? regist?.car_Type :''} 
      `}
    >
      <p>{data.spot_id}</p>
      <p>{data.occupant_car}</p>
      {/* <p>{isCarnum?(cartype[regist?.car_Type] ?? "일반방문"):''}</p> */}
      <p>{isCarnum?(adjustment?.settlement?"정산완료" : "미정산"):''}</p>
      
      
    </div>
  )
  }

  
}

export default SpotCard 