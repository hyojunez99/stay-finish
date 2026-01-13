import { useEffect, useState } from "react";
import "./BannerSection.scss";

// --- 모바일 배너 이미지 ---
import banner1 from "../assets/images/Banner/MB_Banner_BR.jpg";
import banner2 from "../assets/images/Banner/MB_Banner_HM.jpg";
import banner3 from "../assets/images/Banner/MB_Banner_HO.jpg";
import banner4 from "../assets/images/Banner/MB_Banner_LN.jpg";
import banner5 from "../assets/images/Banner/MB_Banner_ST.jpg";
import banner6 from "../assets/images/Banner/MB_Banner_cafe.jpg";

const BannerSection = () => {
  // 전체 배너 목록
  const banners = [banner1, banner2, banner3, banner4, banner5, banner6];

  // 선택된 배너 3개
  const [selectedBanners, setSelectedBanners] = useState([]);

  // 컴포넌트가 처음 한 번 실행
  useEffect(() => {
    // 배열 복사(중복X)
    const copyBanners = [...banners];
    const result = [];

    // 중복 없이 랜덤으로 3개 선택
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * copyBanners.length);
      result.push(copyBanners[randomIndex]);
      copyBanners.splice(randomIndex, 1); // 선택한 이미지는 제거
    }
    setSelectedBanners(result);
  }, []);

  // 아직 배너가 선택되지 않았을 때는 렌더링하지 않음
  if (selectedBanners.length === 0) return null;

  return (
    <section id="banner">
      <div className="mb-banner">
        {selectedBanners.map((img, i) => (
          <img key={i} src={img} alt={`배너 ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default BannerSection;
