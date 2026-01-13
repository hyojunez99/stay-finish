import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import VisitedCards from "./VisitedCards";
import "./visited.scss";

const Visited = () => {
const { profile, visitCars, favoriteCars, fetchVisitCarsList, fetchFavoriteCarsList } = useUser();

    useEffect(() => {
    if (profile?.id) {
        fetchVisitCarsList();
        fetchFavoriteCarsList(); 
    }
}, [profile?.id]);

    if (!profile) return null;

    const displayList = visitCars.map(v => ({
    ...v,
    isFavorite: favoriteCars?.some((f) => f.car_num === v.car_num) ?? false
}));

    return (
        <div className="visited-page">
            <div className="visited-header">
                <h2>방문했던 차량</h2>
                <p>방문 했던 차량들을 보여드릴게요</p>
            </div>
            <VisitedCards list={displayList} />
        </div>
    );
};

export default Visited;
