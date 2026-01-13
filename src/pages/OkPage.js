// --- 승인 요청 리스트 페이지
import OkpageCards from "./OkpageCards";
import "./okpagecard.scss"


const OkPage = () => {
  // 데이터 임시 등록
    const approvalList = [
        {
            id: 1,
            carNumber: "12가3456",
            registerType: "추가 차량 등록",
            building: "120동",
            unit: "1234호",
            message: "가족 차량 추가 등록 요청드립니다.",
            status: "pending",
        },
        {
            id: 2,
            carNumber: "34나7890",
            registerType: "장기 차량 등록",
            building: "101동",
            unit: "804호",
            message: "출퇴근용으로 상시 이용 차량입니다.",
            status: "pending",
        },
        {
            id: 3,
            carNumber: "88다1203",
            registerType: "추가 차량 등록",
            building: "112동",
            unit: "502호",
            message: "배우자 차량 추가 등록입니다.",
            status: "pending",
        },
        {
    id: 4,
    carNumber: "56라9981",
    registerType: "장기 차량 등록",
    building: "109동",
    unit: "1501호",
    message: "세컨카로 장기 등록 요청드립니다.",
    status: "pending",
  },
  {
    id: 5,
    carNumber: "22마4412",
    registerType: "추가 차량 등록",
    building: "118동",
    unit: "307호",
    message: "자녀 차량 추가 등록입니다.",
    status: "pending",
  },
  {
    id: 6,
    carNumber: "77바6509",
    registerType: "장기 차량 등록",
    building: "103동",
    unit: "1102호",
    message: "상시 이용 차량으로 등록합니다.",
    status: "pending",
  },
  {
    id: 7,
    carNumber: "90사3321",
    registerType: "추가 차량 등록",
    building: "115동",
    unit: "901호",
    message: "기존 차량 외 추가 등록 요청.",
    status: "pending",
  },
  {
    id: 8,
    carNumber: "11아7845",
    registerType: "장기 차량 등록",
    building: "107동",
    unit: "406호",
    message: "가족 공동 사용 차량입니다.",
    status: "pending",
  }
    ];

    return (
        <div className="okpage">
            <h1>승인 요청 리스트</h1>
            <OkpageCards list={approvalList} />
        </div>
    );
};

export default OkPage;
