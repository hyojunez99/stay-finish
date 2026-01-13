// supabaseClient 불러와서 연결해서 사용
import supabase from "./supabaseClient";

/**
 * ✅ 현황판 전체 조회 (APT + STORE 한 번에)
 * 프론트에서 zone으로 나눠서 보여주면 됨
 */
export const fetchParkingSpots = async () => {
  const { data, error } = await supabase
    .from("parking_spots")
    .select("spot_id, zone, is_occupied, occupant_car, updated_at")
    .order("zone", { ascending: true }) // APT / STORE 정렬
    .order("spot_id", { ascending: true }); // A-1, A-2 ... 순서
  if (error) throw error;
  return data; // [{spot_id, zone, is_occupied, occupant_car, updated_at}, ...]
};

/**
 * ✅ 실시간 주차 현황(공용)
 * - total: 총 주차공간
 * - occupied: 주차중(주차대수)
 * - empty: 빈 공간
 */
export const fetchParkingStatusSummary = async () => {
  const { data, error } = await supabase
    .from("parking_spots")
    .select("is_occupied");
  if (error) throw error;
  const total = data.length;
  const occupied = data.filter((row) => row.is_occupied === true).length;
  const empty = total - occupied;
  return { total, occupied, empty };
};
//추가로 입력한 부분






//-----------------------------------------------------------------------//
//control 페이지에 필요한 api정보
//-----------------------------------------------------------------------//

//등록차량 확인
export const registConfirm = async (carNum) => {
  //등록된 차량인지 체크 및 상태값 전달
  //1.입주민인지 - 상가주인인지 profiles 테이블에서 확인
  //2.방문예약차량 확인
  let car_Type="VISIT";
  let parking_zone="STORE";
  const { data: registCheck, error: regist_error } = await supabase
    .from("profiles")
    .select("user_type")
    .or(`car_num.eq.${carNum},add_car.eq.${carNum}`) // 등록차량 또는 추가등록차량
    .maybeSingle();
  if (regist_error) {throw new Error("등록된 차량 확인 시 오류 발생"+regist_error.message);}
  
  const registstate = registCheck ? true : false;
  
  if(!registstate){ //입주민이 아니면
    const { data: reservationCheck, error: reservation_error } = await supabase
      .from("parking_reservations") //방문예약차량인지확인
      .select("visit_type")
      .neq("profile_id",16)
      .eq("car_num", carNum)
      .maybeSingle(); 
    const reservationstate = reservationCheck ? true : false;

    if (reservation_error) {throw new Error("등록된 차량 확인 시 오류 발생"+reservation_error.message);} 
    
    if(reservationstate){//입주민이 아니고 방문예약차량이 맞으면
      car_Type = reservationCheck.visit_type;
      parking_zone="APT";
    }
  }else{//입주민이면
    car_Type = registCheck.user_type;
    parking_zone="APT";
    
    // if(registCheck.user_type==="STORE"){
    //   parking_zone="STORE";
    // }else{
    //   parking_zone="APT";
    // }
    
  }
  return { parking_zone, car_Type };

}

//입차처리
export const enterParking = async (carNum,parking_zone) => {

  let statMsg = "";
  //동일차량제어
  const { data: duplication} = await supabase
    .from("parking_spots")
    .select("spot_id")
    .eq("occupant_car", carNum)
    .maybeSingle();
const duplicationstat = duplication? true : false
if(duplicationstat){
  statMsg = duplication.spot_id+"에 이미 주차되어있는 차량입니다"
  throw new Error(duplication.spot_id+"에 이미 주차되어있는 차량입니다");
}


  //빈자리를 찾기 : 주차 공간 확보 //등록된 차량이면 아파트에 빈자리를 확인 미등록된 차량이면 상가에 빈자리를 확인 //car_num = null 그리고 type이 일치
  const { data: spots, error: spot_error } = await supabase
    .from("parking_spots")
    .select("spot_id")
    .eq("zone", parking_zone)
    .is("occupant_car", null)
    // .order("spot_id", { ascending: true })
    // .limit(1);

  if (!spots || spots.length <= 0 || spot_error) {
    statMsg = "주차공간이 없습니다."
    throw new Error("주차 공간이 없습니다");
  }

  
  const targetID = spots[Math.floor(Math.random() * spots.length)].spot_id;

  // const targetID = spots[0].spot_id; 

  
//parking_spots 테이블에 저장 parking_spots테이블은 화면을 구성하는 테이블 입니다.
  const { error: parking_spots_error } = await supabase
    .from("parking_spots")
    .update({ occupant_car: carNum, is_occupied: true })
    .eq("spot_id", targetID);
  if (parking_spots_error) throw new Error(parking_spots_error);


//parking_reservations 테이블을 이용해서 정산기능 구현했습니다.
//16번 아이디가 삭제되면 안됩니다.
  const { error: parking_reservations_error } = await supabase.from("parking_reservations").insert([
        {
            profile_id: 16,
            car_num: carNum,
            visit_type: "VISIT",
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
        },
    ]);
  if (parking_reservations_error) throw new Error(parking_reservations_error.message);

  
  return {targetID,statMsg};

};




//출차 처리
export const exitParking = async (carNum) => {
  //1. 차량찾기
  const { data: spot } = await supabase
    .from("parking_spots")
    .select("*")
    .eq("occupant_car", carNum)
    .single(); //한개만 가져와라
  if (!spot) throw new Error("주차장에 차가 없습니다"); 

  const { data: reservations } = await supabase
    .from("parking_reservations")
    .select("*")
    .eq("car_num",carNum)
    .eq("profile_id",16)
    .single(); //한개만 가져와라


  let registerTime = null;

  if (spot.zone === "APT") {
    //이미 등록되어서 정산하지 않고 출차
    console.log("주차타입 :"+spot.zone);
    registerTime = 0;
  } else {
    //2. 주차한 차를 찾으면, 주차 시간을 계산하기
    const nowTime = new Date();
    console.log("현재시간 :"+nowTime);
    const entryTime = new Date(reservations.start_date); //DB String --> Object // 현재시간 - 입차시간
    console.log("입차시간 :"+entryTime);
    const diff = nowTime.getTime() - entryTime.getTime();
    console.log("현재시간 - 입차시간 :"+diff);
    //시간주차를 했는지. 1초 이상 1시간
    // registerTime = Math.round(diff / (1000 * 60 * 60 * 9));
    registerTime = Math.round(diff / (60000));
    console.log("최종시간 :"+registerTime+"분");

  }
  return { registerTime: registerTime, spot_id: spot.spot_id , spot_type :spot.zone ,need_settlement: reservations.need_settlement};
};





//출차 확정
export const confirmExit = async (spotId,carNum) => {
  const { error:parking_spots } = await supabase
    .from("parking_spots")
    .update({ occupant_car: null, updated_at: null, is_occupied: false })
    .eq("spot_id", spotId);
  if (parking_spots) throw new Error("출차하지 못했습니다");

  const { error: parking_reservations_error } = await supabase
    .from("parking_reservations")
    .delete()
    .eq("car_num",carNum)
    .eq("profile_id",16);

  if (parking_reservations_error) throw new Error(parking_reservations_error);
};


export const adjustment = async (carNum) => {
  const { data: settlement, error } = await supabase
    .from("parking_reservations")
    .select("*")
    .eq("car_num", carNum)
    .eq("profile_id",16)
    .maybeSingle();
  if (error) throw error;

  return {settlement: settlement.need_settlement, sdata : settlement.start_date};
};
// 