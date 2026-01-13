import React from "react";
import OkpageCard from "./OkpageCard";
import AnimatedList from "./AnimatedList";

const OkpageCards = ({ list }) => {
    return (
        <div className="okpage-card-list">
            <AnimatedList
                items={list}
                renderItem={(item) => <OkpageCard key={item.id} data={item} />}
            />
        </div>
    );
};

export default OkpageCards;
