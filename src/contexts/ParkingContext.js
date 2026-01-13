import { createContext, useContext, useEffect, useState } from "react";

import {
    fetchParkingSpots,
    fetchParkingStatusSummary,
    enterParking,
    registConfirm,
    exitParking,
    confirmExit,
    adjustment,
} from "../api/parkingAPI";

/* =====================================================
    1) Context 채널 만들기
    ===================================================== */
const ParkingContext = createContext(null);

/* =====================================================
    2) Provider (현황판 관련 상태 + 함수)
    ===================================================== */
const ParkingProvider = ({ children }) => {
    /* -----------------------------------------------------
        ✅ 상태(state) 모음
        - 현황판 UI에 필요한 값들
    ----------------------------------------------------- */

  //  주차 자리 전체 리스트 (APT/STORE 포함)
  //    -> 그리드 카드(자리별 상태) 만들 때 사용
    const [spots, setSpots] = useState([]);

  //  요약 정보 (총/주차중/빈자리)
  //    -> 상단 요약 카드(총 36면 / 주차중 20 / 빈자리 16) 같은 거 만들 때 사용
    const [summary, setSummary] = useState({ total: 0, occupied: 0, empty: 0 });

  //  로딩 (선택)
    const [loading, setLoading] = useState(false);

    /* -----------------------------------------------------
        ✅ 1) 현황판 전체 자리 조회
    ----------------------------------------------------- */

    /**
   * ✅ [현황판 페이지 - 자리 그리드용]
   * - parking_spots 전체 조회
   * - APT/STORE 섞여서 오므로, 프론트에서 zone으로 나눠서 보여주면 됨
   *
   * ✅ 사용 예시
   * const { spots, loadSpots } = useParkingBoard();
   * useEffect(()=>{ loadSpots(); }, []);
   */
    const loadSpots = async () => {
        try {
        setLoading(true);
        const data = await fetchParkingSpots();
        setSpots(data);
        return { ok: true };
        } catch (e) {
        console.error(e);
        return { ok: false, message: e.message };
        } finally {
        setLoading(false);
        }
    };

    /* -----------------------------------------------------
            ✅ 2) 현황판 요약 조회 (총/주차중/빈자리)
        ----------------------------------------------------- */

    /**
     * ✅ [현황판 페이지 - 상단 요약 카드용]
     * - total, occupied, empty 계산해서 반환
     *
     * ✅ 사용 예시
     * const { summary, loadSummary } = useParkingBoard();
     * useEffect(()=>{ loadSummary(); }, []);
     */
    const loadSummary = async () => {
        try {
        const data = await fetchParkingStatusSummary();
        setSummary(data);
        return { ok: true };
        } catch (e) {
        console.error(e);
        return { ok: false, message: e.message };
        }
    };

    /* -----------------------------------------------------
            ✅ 3) 한 번에 갱신하기 (버튼/주기적 갱신용)
        ----------------------------------------------------- */
    /**
     * ✅ [현황판 새로고침 버튼 또는 주기적 갱신용]
     * - spots + summary 둘 다 최신으로 갱신
     *
     * ✅ 사용 예시
     * const { refreshBoard } = useParkingBoard();
     * <button onClick={refreshBoard}>새로고침</button>
     */
    const refreshBoard = async () => {
        await loadSpots();
        await loadSummary();
    };

    //추가작성 부분
    const regist_check = async (carNum) => {
        try {
        const data = await registConfirm(carNum);
        return data;
        } catch (error) {
        console.error(error);
        }
    };
    const adjustment_check = async (carNum) => {
        try {
        const data = await adjustment(carNum);
        return data;
        } catch (error) {
        console.error(error);
        }
    };


    const enter_car = async (carNum) => {
        const cartype = {
        APT: "입주민",
        STORE: "사업자",
        DAILY: "예약방문",
        PERIOD: "장기방문",
        VISIT: "일반방문",
        };
        try {
        const regist = await registConfirm(carNum);
        const {targetID,statMsg} = await enterParking(carNum, regist.parking_zone);
        if(statMsg!=""){
            alert(statMsg);
        }else{
            alert(
            `${cartype[regist.car_Type]}입니다${
            regist.parking_zone
            }구역${targetID}에 주차성공`
            );
        }
        
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    // const exit_car = async (carNum) => {
    //     try{
    //         //출차처리
    //         const {registerTime,spot_id} = await exitParking(carNum);
    //         const result = window.confirm(`주차시간 : ${registerTime}`);
    //         if(result) {
    //             //확인버튼 : 출차를 하겠음
    //             await confirmExit(spot_id);
    //             alert("안녕히 가세요!");
    //             refreshBoard();
    //         }

    //     }catch(error){
    //         console.error(error);
    //     }
    // }

    const exit_car = async (carNum) => {
        try {
            const { registerTime, spot_id,spot_type,need_settlement} = await exitParking(
                carNum
            );
            if(spot_type==="APT"){
                    await confirmExit(spot_id,carNum);
                    alert("입주민 구역 출차 : 안녕히가세요");
                }else{
                    if(need_settlement){
                        await confirmExit(spot_id,carNum);
                        alert("정산완료 : 안녕히가세요");
                    }else{
                        alert("주차시간 : "+ registerTime + "분\n정산이 필요합니다.");
                        if(window.confirm("결제 하시겠습니까?")){
                            await confirmExit(spot_id,carNum);
                            alert("안녕히 가세요");
                        }
                        
                    }
                    
            }

        
        
        //강제출차
        // confirmExit("G-3");


        } catch (error) {
            console.error(error);
        }
    };

    // ✅ 처음 화면 들어왔을 때 자동 조회 (강사님 스타일)
    useEffect(() => {
        refreshBoard();
    }, []);

    /* -----------------------------------------------------
            ✅ Context value: 페이지에서 꺼내 쓰는 목록
        ----------------------------------------------------- */
    const value = {
        // state
        spots,
        summary,
        loading,
        

        // actions
        loadSpots,
        loadSummary,
        refreshBoard,
        enter_car,
        exit_car,
        regist_check,
        adjustment_check,
    };

    return (
        <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
    );
};

export default ParkingProvider;

/* =====================================================
    3) Hook export (페이지에서 이렇게 꺼내 씀)
    ===================================================== */
export const useParkingBoard = () => useContext(ParkingContext);
