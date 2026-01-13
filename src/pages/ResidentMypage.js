// --- 입주민 마이페이지 ---

import { data, useNavigate } from "react-router-dom";
import {fetchHeaderBundle} from "../api/userApi";
import "./ResidentMypage.scss";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const ResidentMypage = () => {
  const navigate = useNavigate();
  const {profile} = useUser();
  const [mypageData, setMypageData] = useState(null);

  //마이페이지 데이터 로드
  useEffect(() =>{
    if (!profile?.id) return;
    const loadmypage = async () => {
      try{
        const data = await fetchHeaderBundle(profile.id);
        if(!data) {
          //만약 가져온 데이터가 없다면 기본값(빈 값)으로 세팅
          setMypageData({
            role_label: "입주민",
            dong_ho: profile.dong_ho || "",
            car_num: profile.car_num || "",
            current_spot: data?.current_spot ?? null,
  });
          return;
        }
        //가져온 데이터가 있다면(mypageData)에 담습니다. -> 이때 화면이 자동으로 다시 그려집니다.
        setMypageData(data);
      } catch (error) {
        //데이터를 가져오다 에러가 나면 콘솔에 표시하고 기본값을 세팅
        console.log("마이 페이지 데이터 로딩 실패", error);
        setMypageData({
          role_label: "입주민",
          dong_ho: profile.dong_ho || "",
          car_num: profile.car_num || "",
          current_spot: null,
        });
      }
    };
    loadmypage();
  },[]);
  useEffect(()=>{
    console.log("mypageData:", mypageData);
  },[mypageData]);

  //로그아웃
  const handleLogout = () =>{
    navigate("/");
  };
  if (mypageData === null) {
    return <div>로딩중...</div>;
  }
  return (
    <div className="resident-mypage">
      {/* 상단 카드 */}
      <section className="resident-card">
        <div className="mypage-info">
          <span className="role">{mypageData.role_label || "입주민"}</span>
          <p className="address">{mypageData.dong_ho || "동·호수 정보 없음"}</p>
          <h2 className="car-number">{mypageData.car_num || "차량 정보 미등록"}</h2>
          <span className="parking-spot">
            {mypageData.current_spot? `현재 주차 위치: ${mypageData.current_spot}` : "현재 주차 중이 아닙니다"}
          </span>
      </div>
      {/* 카드 버튼 */}
      {/* 아직 기능이 연결되지 않은 버튼은 alert창을 띄움 */}
      <div className="card-actions">
        <button onClick={()=> alert("추후 업데이트 예정입니다.")}>차량 정보 수정</button>
        <button onClick={()=>alert("권한이 없습니다.")}>문의 하기</button>
        <button onClick={()=> alert("추후 업데이트 예정입니다.")}>이용 가이드</button>
      </div>
      </section>
      {/* 메뉴 리스트 */}
      <section className="menu-list">
        <button>공지사항</button>
        <button
          onClick={()=>{
            navigate("/app/resident/visited");
          }}
        >
          방문했던 차량
        </button>
      <button onClick={() => { navigate("/app/resident/favorite");}}> 즐겨 찾는 차량 </button>
      <button onClick={()=> alert("추후 업데이트 예정입니다.")}>자주 묻는 질문</button>
      </section>
      {/* 로그아웃 */}
      <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default ResidentMypage;
