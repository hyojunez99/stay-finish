// --- 입주민 즐겨찾기 페이지 ---
import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import FavCards from "./FavCards.js";
import "./favcards.scss";

const ResidentFav = () => {
    const { favoriteCars, fetchFavoriteCarsList, } = useUser();

    // 페이지 진입할 때 즐겨찾기 목록 fetch
    useEffect(() => {
        fetchFavoriteCarsList();
    }, []);

    return (
        <div className="residentfav">
            <div className="residentfav-inner">
                <h1>즐겨찾는 방문차량</h1>
                <p>즐겨찾기 한 차량들을 보여드릴게요.</p>
            </div>

            {/* 방문차량이 비어있을 때 처리 */}
            {favoriteCars?.length === 0 ? (
                <p className="empty">등록된 즐겨찾기 차량이 없습니다.</p>
            ) : (
                <FavCards list={favoriteCars} />
            )}
        </div>
    );
};

export default ResidentFav;
