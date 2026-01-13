import React from "react";
import "./okpagecard.scss";


const OkpageCard = ({ data }) => {
    const { carNumber, registerType, building, unit, message } = data;

    return (
        <div className="ok-card">
            <p>
                <span className="register-type">{registerType}</span>
            </p>
            <div className="ok-card-inner">
                <h2 className="car-number">{carNumber}</h2>
                <p className="unit">
                    {building} {unit}
                </p>
            </div>
            <p className="message">{message || "등록 사유가 없습니다."}</p>
            <div className="btn-group">
                <button className="btn left">승인</button>
                <button className="btn right">거절</button>
            </div>
        </div>
    );
};

export default OkpageCard;
