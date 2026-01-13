import React from "react";
import AnimatedList from "./AnimatedList";
import SalePageCard from "./SalePageCard";
import "./salepage.scss";

const SalePageCards = ({ list }) => {
  return (
    <div className="salepage-card-list">
      <AnimatedList
        items={list}
        renderItem={(item) => (
          <SalePageCard key={item.id} data={item} />
        )}
      />
    </div>
  );
};

export default SalePageCards;
