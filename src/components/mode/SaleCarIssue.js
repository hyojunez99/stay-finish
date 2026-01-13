// --- 주차 할인권 정산 ---
import "./SaleCarIssue.scss";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";

const SaleCarIssue = () => {
  const { profile, discountSummary, fetchStoreDiscountSummary } = useUser();

  //  profile.id 정보 요청
  useEffect(() => {
    if (!profile?.id) return;
    fetchStoreDiscountSummary();
  }, [profile?.id]);

  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 방지
    if (!discountSummary) return;

    // 정산 정보 알림
    alert(
      `총 ${discountSummary.qty}장 발급,
정산 금액: ${discountSummary.total_amount}원,
정산일: ${discountSummary.settlement_date}`
    );
  };

  return (
    <>
      {!discountSummary ? (
        <div className="issue-empty">
          <div className="issue-txt">
            <p>아직 발급된 주차 할인권이 없습니다.</p>
          </div>
        </div>
      ) : (
        <form className="issue-form" onSubmit={handleSubmit}>
          <div className="issue-txt">
            <p>
              현재까지 발급된 주차할인권은{" "}
              <strong>{discountSummary.qty}장</strong> 입니다.
            </p>
            <p>
              정산일은 <strong>{discountSummary.settlement_date}</strong>{" "}
              입니다.
            </p>
          </div>
          <div className="issue-btn">
            <p>정산 금액: {discountSummary.total_amount}원</p>
            <button>정산하기</button>
          </div>
        </form>
      )}
    </>
  );
};

export default SaleCarIssue;
