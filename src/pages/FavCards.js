import { useUser } from "../contexts/UserContext";
import AnimatedList from "./AnimatedList";
import FavCard from "./FavCard";
import { useState } from "react";

const FavCards = ({ list }) => {
    const { fetchFavoriteCarsList } = useUser();
    const [items, setItems] = useState(list);

    const handleRemove = async (carNum) => {
        setItems((prev) => prev.filter((v) => v.car_num !== carNum));

        const res = await fetchFavoriteCarsList(carNum);

        if (res.error) {
            alert("서버 오류");
            // rollback 원하면 여기
        }
    };

    return (
        <div className="fav-cards">
            <AnimatedList
                items={items}
                renderItem={(item) => (
                    <FavCard data={item} onRemove={handleRemove} />
                )}
            />
        </div>
    );
};

export default FavCards;
