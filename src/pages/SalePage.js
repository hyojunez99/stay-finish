// --- 상가 정산 리스트 ---
import SalePageCards from "./SalePageCards";
import "./salepage.scss";

const SalePage = () => {
    const settlementList = [
        {
            id: 1,
                    status: "정산 완료",
            storeName: "온담 감자탕",
                    period: "2026.12.01 ~ 2026.12.31",
            ticketCount: 514,
            totalAmount: 514 * 2500, // 1,285,000원
        },
        {
            id: 2,
            status: "정산 미완료",
            storeName: "청춘 삼겹살",
            period: "2026.12.01 ~ 2026.12.31",
            ticketCount: 322,
            totalAmount: 322 * 2500, // 805,000원
                },
                {
            id: 3,
            status: "정산 완료",
            storeName: "카페 루프탑",
            period: "2026.12.10 ~ 2026.12.31",
            ticketCount: 188,
            totalAmount: 188 * 2500, // 470,000원
        },
        {
            id: 4,
                    status: "정산 완료",
                    storeName: "동네 피자집",
            period: "2026.12.05 ~ 2026.12.31",
                    ticketCount: 256,
            totalAmount: 256 * 2500, // 640,000원
                },
                {
            id: 5,
            status: "정산 미완료",
            storeName: "마루 초밥",
            period: "2026.12.01 ~ 2026.12.31",
            ticketCount: 412,
            totalAmount: 412 * 2500, // 1,030,000원
        },
        {
            id: 6,
                    status: "정산 완료",
            storeName: "고기굽는 날",
            period: "2026.12.15 ~ 2026.12.31",
            ticketCount: 147,
            totalAmount: 147 * 2500, // 367,500원
        },
        {
            id: 7,
            status: "정산 미완료",
            storeName: "달빛 포차",
                    period: "2026.12.01 ~ 2026.12.31",
            ticketCount: 289,
            totalAmount: 289 * 2500, // 722,500원
        },
        {
            id: 8,
            status: "정산 완료",
            storeName: "한상 가득",
            period: "2026.12.03 ~ 2026.12.31",
            ticketCount: 356,
            totalAmount: 356 * 2500, // 890,000원
        },
    ];

    return (
        <div className="salepage">
            <h1>상가 정산 리스트</h1>
            <SalePageCards list={settlementList} />
        </div>
    );
};

export default SalePage;
