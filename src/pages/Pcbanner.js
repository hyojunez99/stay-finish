// --- pc 배너 ---
import pcbanner1 from "../assets/images/Banner/DT_Banner.BRjpg.jpg";
import pcbanner2 from "../assets/images/Banner/DT_Banner_HM.jpg";
import pcbanner3 from "../assets/images/Banner/DT_Banner_HO.jpg";
import pcbanner4 from "../assets/images/Banner/DT_Banner_LN.jpg";
import pcbanner5 from "../assets/images/Banner/DT_Banner_ST.jpg";
import pcbanner6 from "../assets/images/Banner/DT_Banner_cafe.jpg";
import "./Pcbanner.scss";

const Pcbanner = () => {
  const pcbanners = [
    pcbanner1,
    pcbanner2,
    pcbanner3,
    pcbanner4,
    pcbanner5,
    pcbanner6,
  ];

  // --- pc ---
  // 1. 배열 복사
  const pcBanners = [...pcbanners];

  // 2. 중복 없이 랜덤 2개 선택
  const selectedpcBanners = [];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * pcBanners.length);
    selectedpcBanners.push(pcBanners[randomIndex]);
    pcBanners.splice(randomIndex, 1); // 선택한 건 배열에서 제거
  }

  return (
    <div>
      <div className="pc-banner">
        <aside className="side-banner-left">
          <img src={selectedpcBanners[0]} alt="배너 1" />
          <div className="left-txt">
            <p>개인정보 처리 방침</p>
            <p>이용약관</p>
            <p>고객센터 | support@STAY.com</p>
          </div>
        </aside>
        <aside className="side-banner-right">
          <img src={selectedpcBanners[1]} alt="배너 3" />
        </aside>
      </div>
    </div>
  );
};

export default Pcbanner;
