import "./favCard.scss";
import { ReactComponent as Star } from "../assets/svg/Star.svg";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";


const FavCard = ({ data, onRemove }) => {
  const { toggleFavorite } = useUser();
  const { car_num } = data;
  const [removing, setRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (removing) return;

    setRemoving(true);

    // 애니 끝나고 부모에게 실제 제거 요청
    setTimeout(async () => {
      await toggleFavorite(car_num);
      onRemove?.(car_num);
    }, 300);
  };

  return (
    <div className={`fav-card ${removing ? "removing" : ""}`}>
      <p className="car-number">{car_num}</p>
      <Star className="star" onClick={handleRemove} />
    </div>
  );
};

export default FavCard;
