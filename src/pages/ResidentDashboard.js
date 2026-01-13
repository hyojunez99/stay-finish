import SystemController from "../components/SystemController";
import BannerSection from "./BannerSection";
import { useNavigate } from "react-router-dom";
import Weather from "../components/Weather";
import topImg from "../assets/images/Top/Intersect_PR.png";
import "./ResidentDashboard.scss";
import ParkingGird from "../components/ParkingGird";
import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const { profile, header, fetchHeader } = useUser();

  // 헤더  profile.id 정보 요청
  useEffect(() => {
    if (!profile?.id) return;
    fetchHeader();
  }, [profile?.id]);

  return (
    <section id="resident">
      <div className="resident-top">
        <img src={topImg} alt="상단 이미지" />
        <div className="resident-txt">
          <h2>좋은 하루 보내세요</h2>
          {header ? (
            <>
              <p>{header.user_name} 님</p>
              <p>{header.dong_ho}</p>
            </>
          ) : (
            <p>사용자 정보를 불러오는 중...</p>
          )}
          <Weather />
        </div>
      </div>
      <div className="scroll-container">
        <SystemController role="resident" />
        <BannerSection />
      </div>
      <div className="favorite">
        <button onClick={() => navigate("/app/resident/favorite")}>
          즐겨 찾는 차량
        </button>
      </div>

      <ParkingGird />
    </section>
  );
};

export default ResidentDashboard;
