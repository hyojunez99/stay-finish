// --- 사업자 마이페이지 ---

import { useNavigate } from "react-router-dom";
import "./BusinessMypage.scss";
import { useEffect, useState } from "react";
import { fetchHeaderBundle } from "../api/userApi";
import { useUser } from "../contexts/UserContext";

const BusinessMypage = () => {
  const navigate = useNavigate();
  const { profile } = useUser();
  const [mypageData, setMypageData] = useState(null);
  //마이페이지 데이터 로드
  useEffect(() => {
    const loadmypage = async () => {
      if (!profile?.id) return;
      try {
        const data = await fetchHeaderBundle(profile.id);
        if (!data) {
          //만약 가져온 데이터가 없다면 기본값(빈 값)으로 세팅
          setMypageData({
            role_label: "사업자",
            dong_ho: profile.dong_ho || "",
            user_name: "",
            current_spot: null,
          });
          return;
        }
        //가져온 데이터가 있다면 (mypageData)에 담습니다. 이때 화면이 자동으로 다시 그려집니다.
        setMypageData(data);
      } catch (error) {
        //데이터를 가져오다 에러가 나면 콜솔에 표시하고 기본갑을 세팅
        console.log("마이페이지 데이터 로딩 실패", error);
        setMypageData({
          role_label: "사업자",
          dong_ho: profile.dong_ho || "",
          user_name: "",
          current_spot: "",
        });
      }
    };
    loadmypage();
  }, []);
  useEffect(() => {
    console.log("mypageData:", mypageData);
  }, [mypageData]);

  //로그아웃 처리
  const handleLogout = () => {
    navigate("/");
  };
  if (mypageData === null) {
    return <div>로딩중...</div>;
  }
  return (
    <div className="business-mypage">
      {/* 상단 카드 */}
      <section className="business-card">
        <div className="mypage-info">
          <span className="role">{mypageData.role_label || "사업자"}</span>
          <p className="address">{mypageData.dong_ho || "동·호수 정보 없음"}</p>
          {/* 사업자만 상호명 노출 */}
          {mypageData.user_type === "STORE" && (
            <h2 className="name">{mypageData.user_name || "상호명 미등록"}</h2>
          )}
           <span className="parking-spot">
            현재 주차 위치:{""} {mypageData.current_spot ?? "현재 주차 중이 아닙니다"}
          </span>
        </div>
        {/* 카드 버튼 */}
        {/* 아직 기능이 연결되지 않은 버튼은 alert창을 띄움 */}
        <div className="mypage-actions">
          <button onClick={() => alert("추후 업데이트 예정입니다.")}>
            차량 정보 수정
          </button>
          <button onClick={() => alert("권한이 없습니다.")}>문의 하기</button>
          <button onClick={() => alert("추후 업데이트 예정입니다.")}>
            이용 가이드
          </button>
        </div>
      </section>
      {/* 메뉴 리스트 */}
      <section className="mypage-menu">
        <button>공지사항</button>
        <button
          onClick={() => {
            navigate("/app/business/visited");
          }}
        >
          방문했던 차량
        </button>
        <button onClick={() => alert("추후 업데이트 예정입니다.")}>
          자주 묻는 질문
        </button>
      </section>
      {/* 로그아웃 */}
      <button className="mypage-logout" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default BusinessMypage;
