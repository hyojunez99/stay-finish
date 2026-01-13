import { useUser } from "../contexts/UserContext";
import VisitedCard from "./VisitedCard";
import AnimatedList from "./AnimatedList";
import "./visited.scss";

const VisitedCards = ({ list }) => {
    const { toggleFavorite } = useUser();   

    const handleToggleFavorite = async (carNum) => {
    await toggleFavorite(carNum);
};

    return (
        <AnimatedList
            items={list.map((v) => ({
                ...v,
                _key: v.reservation_id || v.car_num,
            }))}
            renderItem={(item, index) => (
                <VisitedCard
                first={index === 0}
                    key={item._key}
                    data={item}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
        />
    );
};

export default VisitedCards;
