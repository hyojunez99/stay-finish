import { createContext, useContext, useEffect, useState } from "react";

import {
    loginProfile,
    signupProfile,
    fetchHeaderBundle,
    createDailyReservation,
    createPeriodReservation,
    updateAddCar,
    issueDiscount,
    fetchDiscountSummary,
    fetchVisitCars,
    fetchFavoriteCars,
    toggleFavoriteCar,
  updateSettlementStatus,
    } from "../api/userApi";

/* =====================================================
    1) Context 채널 만들기 
    ===================================================== */
const UserContext = createContext(null);

/* =====================================================
    2) Provider (이 안에서 상태 + 함수들을 관리)
    ===================================================== */
const UserProvider = ({ children }) => {
    /* -----------------------------------------------------
        ✅ 상태(state) 모음
        - 페이지에서 UI 그릴 때 필요한 값들
    ----------------------------------------------------- */

    //  로그인 성공 시 저장되는 사용자 정보
    //    (id, user_type, user_name, dong_ho, car_num ...)
    const [profile, setProfile] = useState(null);

    //  공통 헤더에서 쓰는 데이터 (role_label, user_name, dong_ho, current_spot)
    const [header, setHeader] = useState(null);

    //  마이페이지 방문차량 목록
    const [visitCars, setVisitCars] = useState([]);

    // 즐겨찾기 목록 추가
    const [favoriteCars, setFavoriteCars] = useState([]);

    //fetch

    //  상가 정산 페이지 요약 데이터 (qty, settlement_date, total_amount ...)
    const [discountSummary, setDiscountSummary] = useState(null);

    // 로딩 표시(선택): 초보자 디버깅/UX용
    const [loading, setLoading] = useState(false);

    /* -----------------------------------------------------
        ✅ 1) 로그인 / 회원가입 (Login / Signup Page)
    ----------------------------------------------------- */

    /**
     * ✅ [로그인 페이지에서 사용]
     * - 로그인 성공 시 profile 저장
     * - 승인대기(PENDING)면 profile 저장 안 함
     *
     * ✅ 사용 예시
     * const { doLogin } = useUser();
     * const res = await doLogin(loginId, password);
     * if(res.ok) navigate("/home");
     */
    const doLogin = async (loginId, password) => {
        try {
            setLoading(true);

            const res = await loginProfile(loginId, password);

            // 승인대기면 페이지에서 안내만 띄우게 반환
            if (res.status === "PENDING") {
                return { ok: false, status: "PENDING", message: res.message };
            }

            // 로그인 성공
            setProfile(res.profile);
            return { ok: true, status: "OK", profile: res.profile };
        } catch (e) {
            console.error(e);
            return { ok: false, status: "ERROR", message: e.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ [회원가입 페이지에서 사용]
     * - 가입만 수행(관리자 승인 필요)
     *
     * ✅ 사용 예시
     * const { doSignup } = useUser();
     * await doSignup(formData);
     */
    const doSignup = async (form) => {
        try {
            setLoading(true);
            await signupProfile(form);
            return { ok: true };
        } catch (e) {
            console.error(e);
            return { ok: false, message: e.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ [공통] 로그아웃
     * - 상태 초기화
     */
    const doLogout = () => {
        setProfile(null);
        setHeader(null);
        setVisitCars([]);
        setDiscountSummary(null);
    };

    /* -----------------------------------------------------
        ✅ 2) 공통 헤더 (All pages header)
    ----------------------------------------------------- */

    /**
     * ✅ [헤더에서 사용]
     * - 사용자 정보 + 현재 주차 위치 조회
     *
     * ✅ 사용 예시
     * const { header, fetchHeader } = useUser();
     * useEffect(()=>{ fetchHeader(); },[]);
     */
    const fetchHeader = async () => {
        if (!profile?.id) return;
        try {
            const data = await fetchHeaderBundle(profile.id);
            setHeader(data);
        } catch (e) {
            console.error(e);
        }
    };

    // ✅ 로그인(profile)이 생기면 자동으로 헤더도 가져오기
    useEffect(() => {
        if (profile?.id) fetchHeader();
    }, [profile?.id]);

    /* -----------------------------------------------------
        ✅ 3) 입주민 - 방문 차량 등록 (Resident Pages)
    ----------------------------------------------------- */

    /**
     * ✅ [입주민 방문차량 등록(당일)]
     *
     * ✅ 사용 예시
     * const { createDaily } = useUser();
     * await createDaily({ carNum, dateISO });
     */
    const createDaily = async ({ carNum, dateISO }) => {
        if (!profile?.id) return { ok: false, message: "로그인이 필요합니다." };

        try {
            setLoading(true);
            await createDailyReservation({
                profileId: profile.id,
                carNum,
                dateISO,
            });
            return { ok: true };
        } catch (e) {
            console.error(e);
            return { ok: false, message: e.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ [입주민 방문차량 등록(장기)]
     *
     * ✅ 사용 예시
     * const { createPeriod } = useUser();
     * await createPeriod({ carNum, startDateISO, endDateISO, purpose });
     */
    const createPeriod = async ({
        carNum,
        startDateISO,
        endDateISO,
        purpose,
    }) => {
        if (!profile?.id) return { ok: false, message: "로그인이 필요합니다." };

        try {
            setLoading(true);
            await createPeriodReservation({
                profileId: profile.id,
                carNum,
                startDateISO,
                endDateISO,
                purpose,
            });
            return { ok: true };
        } catch (e) {
            console.error(e);
            return { ok: false, message: e.message };
        } finally {
            setLoading(false);
        }
    };

    /* -----------------------------------------------------
        ✅ 4) 공통 - 추가 차량 등록 (Resident/Store Pages)
    ----------------------------------------------------- */

    /**
     * ✅ [입주민/상가 추가차량 등록 페이지]
     * - profiles.add_car 업데이트
     *
     * ✅ 사용 예시
     * const { saveAddCar } = useUser();
     * await saveAddCar(addCarNum);
     */
    const saveAddCar = async (addCarNum) => {
        if (!profile?.id) return { ok: false, message: "로그인이 필요합니다." };

        try {
            setLoading(true);
            await updateAddCar({ profileId: profile.id, addCarNum });
            // 헤더에서 추가차량을 쓰는 경우가 있으면 새로고침
            await fetchHeader();
            return { ok: true };
        } catch (e) {
            console.error(e);
            return { ok: false, message: e.message };
        } finally {
            setLoading(false);
        }
    };

    /* -----------------------------------------------------
        ✅ 5) 상가 - 할인권 발급 / 정산 (Store Pages)
    ----------------------------------------------------- */

    /**
     * ✅ [상가 할인권 발급 페이지]
     * - minutes(30/60/90/120...) 선택하면 discount_sum 누적
     *
     * ✅ 사용 예시
     * const { issueStoreDiscount } = useUser();
     * await issueStoreDiscount(60); // 60분 -> 2장
     */
    const issueStoreDiscount = async (minutes,carNum) => {
        if (!profile?.id) return { ok: false, message: "로그인이 필요합니다." };

        try {
            setLoading(true);
            await issueDiscount({ storeProfileId: profile.id, minutes });
            // 발급 후 정산요약도 최신으로
            await fetchStoreDiscountSummary();
            await updateSettlementStatus(carNum);
            return { ok: true };
        } catch (e) {
            console.error(e);
            return { ok: false, message: e.message };
        } finally {
            setLoading(false);
        }
    };

    
    /**
     * ✅ [상가 정산 페이지]
     * - discount_sum을 가져와서 금액 계산된 요약 반환
     *
     * ✅ 사용 예시
     * const { discountSummary, fetchStoreDiscountSummary } = useUser();
     * useEffect(()=>{ fetchStoreDiscountSummary(); },[]);
     */
    const fetchStoreDiscountSummary = async () => {
        if (!profile?.id) return;

        try {
            const summary = await fetchDiscountSummary(profile.id);
            setDiscountSummary(summary);
        } catch (e) {
            console.error(e);
        }
    };

    /* -----------------------------------------------------
        ✅ 6) 마이페이지 - 방문차량 / 즐겨찾기 (My Page)
    ----------------------------------------------------- */

    /**
     * ✅ [마이페이지 방문차량 목록]
     *
     * ✅ 사용 예시
     * const { visitCars, fetchVisitCarsList } = useUser();
     * useEffect(()=>{ fetchVisitCarsList(); },[]);
     */
    const fetchVisitCarsList = async () => {
        if (!profile?.id) return;
        const list = await fetchVisitCars(profile.id);
        setVisitCars(list);
    };
    /**
     * ✅ [즐겨찾기 방문차량 목록]
     *
     * ✅ 사용 예시
     * const { visitCars, fetchFavoriteCarsList } = useUser();
     * useEffect(()=>{ fetchFavoriteCarsList(); },[]);
     */
    const fetchFavoriteCarsList = async () => {
        if (!profile?.id) return;
        const list = await fetchFavoriteCars(profile.id);
        setFavoriteCars(list);
        return list;
    };

    const mergeFavWithVisitCars = (favList) => {
        setVisitCars((prev) => {
            const next = prev.map((v) => ({
                ...v,
                isFavorite: favList.some((f) => f.car_num === v.car_num),
            }));
            console.log("[visitCars after merge]", next); // ★3
            return next;
        });
    };

    /**
     * ✅ [마이페이지 즐겨찾기 토글]
     * - 토글 후 목록 다시 불러와서 UI 갱신
     *
     * ✅ 사용 예시
     * const { toggleFavorite } = useUser();
     * await toggleFavorite(carNum);
     */
    const toggleFavorite = async (carNum) => {
        await toggleFavoriteCar(profile.id, carNum);
        const latestFav = await fetchFavoriteCarsList(); // 핵심
        mergeFavWithVisitCars(latestFav); // 방문 페이지용
    };
    /* -----------------------------------------------------
        ✅ Context value: 페이지에서 꺼내 쓰는 목록
    ----------------------------------------------------- */
    const value = {
        // state
        profile,
        header,
        visitCars,
        favoriteCars,
        discountSummary,
        loading,

        // methods
        fetchVisitCarsList,
        fetchFavoriteCarsList,
        toggleFavorite,

        // auth
        doLogin,
        doSignup,
        doLogout,

        // header
        fetchHeader,

        // resident
        createDaily,
        createPeriod,

        // common
        saveAddCar,

        // store
        issueStoreDiscount,
        fetchStoreDiscountSummary,

        // mypage
        fetchVisitCarsList,
        fetchFavoriteCarsList,
        toggleFavorite,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export default UserProvider;

/* =====================================================
    3) Hook export (페이지에서 이렇게 사용)
    ===================================================== */
export const useUser = () => useContext(UserContext);
