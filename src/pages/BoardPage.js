import "./BoardPage.scss";

const inquiryOptions = [
  { value: "ALL", label: "전체" },
  { value: "PARKING_LACK", label: "주차 공간 부족" },
  { value: "NIGHT_LIMIT", label: "다회성 방문" },
  { value: "ILLEGAL", label: "불법 / 이중 주차" }
];

const boardList = [
  {
    id: 1,
    type: "PARKING_LACK",
    title: "퇴근 시간대에 주차할 공간이 없습니다",
    date: "2026.01.07"
  },
  {
    id: 2,
    type: "PARKING_LACK",
    title: "지하 2층 주차 구역 증설 계획이 있나요?",
    date: "2026.01.07"
  },
  {
    id: 3,
    type: "PARKING_LACK",
    title: "상가 방문 차량 때문에 입주민 주차가 어렵습니다",
    date: "2026.01.06"
  },

  // 다회성 방문
  {
    id: 4,
    type: "NIGHT_LIMIT",
    title: "자주 방문하는 차량은 장시간 주차가 가능한가요?",
    date: "2026.01.06"
  },
  {
    id: 5,
    type: "NIGHT_LIMIT",
    title: "다회 방문 차량 등록 기준이 궁금합니다",
    date: "2026.01.05"
  },
  {
    id: 6,
    type: "NIGHT_LIMIT",
    title: "상가 손님 차량도 반복 방문 등록이 되나요?",
    date: "2026.01.05"
  },

  // 불법 / 이중 주차
  {
    id: 7,
    type: "ILLEGAL",
    title: "이중 주차로 통행이 불가능합니다",
    date: "2026.01.04"
  },
  {
    id: 8,
    type: "ILLEGAL",
    title: "지정 구역이 아닌 곳에 장기 주차된 차량이 있습니다",
    date: "2026.01.04"
  },
  {
    id: 9,
    type: "ILLEGAL",
    title: "소화전 앞에 주차된 차량 조치 요청드립니다",
    date: "2026.01.03"
  }
];

const BoardPage = () => {
  return (
    <div className="board-page">
      {/* 상단 고정 영역 */}
      <div className="board-header">
        <h2>문의 게시판</h2>

        <select className="board-select">
          {inquiryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 스크롤 게시판 */}
      <div className="board-list">
        <div className="board-table">
            <p>제목</p>
            <p>작성일</p>
            </div>
        {boardList.map((item) => (
          <div key={item.id} className="board-row">
            <span>{item.title}</span>
            <span>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;