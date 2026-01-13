import SystemController from "../components/SystemController";
import BannerSection from "./BannerSection";
import "./BusinessDashboard.scss";
import topImg from "../assets/images/Top/Intersect_OR.png";
import Weather from "../components/Weather";
import ParkingGird from "../components/ParkingGird";
import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const BusinessDashboard = () => {
  const { profile, header, fetchHeader } = useUser();

  // 헤더 profile.id 정보 요청
  useEffect(() => {
    if (!profile?.id) return;
    fetchHeader();
  }, [profile?.id]);

  return (
    <section id="business">
      <div className="business-top">
        <img src={topImg} alt="상단 이미지" />
        <div className="business-txt">
          <h2>즐거운 하루 보내세요</h2>
          {header ? (
            <>
              <p>{header.user_name}</p>
              <p>{header.dong_ho}</p>
            </>
          ) : (
            <p>사용자 정보를 불러오는 중...</p>
          )}
          <Weather />
        </div>
      </div>
      <div className="scroll-container">
        <SystemController role="business" />
        <BannerSection />
      </div>
      <ParkingGird />
    </section>
  );
};

export default BusinessDashboard;
