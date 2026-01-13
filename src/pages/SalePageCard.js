import React from "react";
import "./salepage.scss";

const SettlementCard = ({ data }) => {
    const { storeName, period, totalAmount } = data;

    return (
        <div className="settlement-card">
            <span className="status-badge">정산 완료</span>
            <div className="settlement-card-inner">
                <h2 className="store-name">{storeName}</h2>
                <p className="period">{period}</p>
                <p className="amount">{totalAmount.toLocaleString()}원</p>
            </div>
        </div>
    );
};

export default SettlementCard;
