import supabase from "./supabaseClient";

/* =====================================================
로그인 / 회원가입
===================================================== */

/**
 * ✅ [로그인 페이지]
 * - 아이디/비밀번호 로그인
 * - 승인 안 된 계정은 PENDING 반환
 *
 * ✅ 사용 예시
 * const res = await loginProfile(loginId, password);
 * if (res.status === "OK") setProfile(res.profile);
 */
export const loginProfile = async (loginId, password) => {
    const { data, error } = await supabase
        .from("profiles")
        .select(
            "id, login_id, password, user_type, is_approved, user_name, car_num, dong_ho"
        )
        .eq("login_id", loginId)
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("아이디가 없습니다.");
    if (data.password !== password) throw new Error("비밀번호가 틀렸습니다.");

    if (!data.is_approved) {
        return { status: "PENDING", message: "관리자 승인 대기 중입니다." };
    }

    return { status: "OK", profile: data };
};

/**
 * ✅ [회원가입 페이지]
 * - 가입만 진행 (관리자 승인 필요)
 *
 * ✅ 사용 예시
 * await signupProfile(formData);
 */
export const signupProfile = async (form) => {
    const { error } = await supabase.from("profiles").insert([
        {
            login_id: form.loginId,
            password: form.password,
            user_name: form.userName,
            user_type: form.userType, // "APT" | "STORE"
            car_num: form.carNum,
            dong_ho: form.dongHo,
            is_approved: true,
        },
    ]);

    if (error) throw error;
    return true;
};

/* =====================================================
공통 헤더
===================================================== */

/**
 * ✅ [모든 페이지 상단 헤더]
 * - 사용자 정보 + 현재 주차 위치
 *
 * ✅ 사용 예시
 * const header = await fetchHeaderBundle(profile.id);
 */
export const fetchHeaderBundle = async (profileId) => {
    const { data: profile } = await supabase
        .from("profiles")
        .select("user_type, dong_ho, user_name, car_num")
        .eq("id", profileId)
        .single();
    const { data: spot } = await supabase
        .from("parking_spots")
        .select("spot_id")
        .eq("occupant_car", profile.car_num)
        .eq("is_occupied", true)
        .maybeSingle();
    return {
        user_type: profile.user_type,
        role_label: profile.user_type === "APT" ? "입주자" : "사업자",
        dong_ho: profile.dong_ho,
        user_name: profile.user_name,
        car_num: profile.car_num,
        current_spot: spot?.spot_id ?? null,
    };
};

/* =====================================================
입주민 - 방문 차량 등록
===================================================== */

/**
 * ✅ [입주민 방문차량 등록 페이지]
 * - 당일 방문 차량
 *
 * ✅ 사용 예시
 * await createDailyReservation({
 *   profileId: profile.id,
 *   carNum: "12가3456",
 *   dateISO: "2026-01-10"
 * });
 */
export const createDailyReservation = async ({
    profileId,
    carNum,
    dateISO,
}) => {
    const { error } = await supabase.from("parking_reservations").insert([
        {
            profile_id: profileId,
            car_num: carNum,
            visit_type: "DAILY",
            start_date: dateISO,
            end_date: dateISO,
        },
    ]);
    if (error) throw error;
    return true;
};

/**
 * ✅ [입주민 장기 방문 등록 페이지]
 * - 기간 방문 차량
 *
 * ✅ 사용 예시
 * await createPeriodReservation({
 *   profileId: profile.id,
 *   carNum,
 *   startDateISO,
 *   endDateISO,
 *   purpose
 * });
 */
export const createPeriodReservation = async ({
    profileId,
    carNum,
    startDateISO,
    endDateISO,
    purpose,
}) => {
    const { error } = await supabase.from("parking_reservations").insert([
        {
            profile_id: profileId,
            car_num: carNum,
            visit_type: "PERIOD",
            start_date: startDateISO,
            end_date: endDateISO,
            purpose,
        },
    ]);
    if (error) throw error;
    return true;
};

/* =====================================================
공통 - 추가 차량
===================================================== */

/**
 * ✅ [입주민 / 상가 페이지]
 * - 추가 차량 번호 1대 등록
 *
 * ✅ 사용 예시
 * await updateAddCar({ profileId: profile.id, addCarNum });
 */
export const updateAddCar = async ({ profileId, addCarNum }) => {
    const { error } = await supabase
        .from("profiles")
        .update({ add_car: addCarNum })
        .eq("id", profileId);

    if (error) throw error;
    return true;
};

/* =====================================================
상가 - 할인권 발급 / 정산
===================================================== */

const UNIT_PRICE = 1500;

/**
 * ✅ [상가 할인권 발급 페이지]
 * - 30분 = 할인권 1장
 *
 * ✅ 사용 예시
 * await issueDiscount({
 *   storeProfileId: profile.id,
 *   carNum,
 *   minutes: 60
 * });
 */
export const issueDiscount = async ({ storeProfileId, minutes }) => {
    const qty = minutes / 30;
    const { data } = await supabase
        .from("parking_discounts")
        .select("discount_sum")
        .eq("profile_id", storeProfileId)
        .maybeSingle();
    const next = (data?.discount_sum ?? 0) + qty;
    const { error } = await supabase
        .from("parking_discounts")
        .upsert(
            { profile_id: storeProfileId, discount_sum: next },
            { onConflict: "profile_id" }
        );
    if (error) throw error;
    return true;
};
    export const updateSettlementStatus = async (targetCarNum)=>{
    //업데이트 요청
    const { error } = await supabase
        .from('parking_reservations')          // 테이블명
        .update({ need_settlement: true })    // 변경할 값 (정산완료 처리)
        .eq('car_num', targetCarNum);          // 조건: car_num이 매개변수와 같은 것
    if (error) throw error;
    return true;
}
/**
 * ✅ [상가 정산 페이지]
 * - 할인권 수량 + 금액 계산
 *
 * ✅ 사용 예시
 * const summary = await fetchDiscountSummary(profile.id);
 */
export const fetchDiscountSummary = async (storeProfileId) => {
    const { data } = await supabase
        .from("parking_discounts")
        .select("discount_sum, created_at")
        .eq("profile_id", storeProfileId)
        .maybeSingle();
    const qty = data?.discount_sum ?? 0;
    return {
        qty,
        settlement_date: data?.created_at?.slice(0, 10) ?? null,
        unit_price: UNIT_PRICE,
        total_amount: qty * UNIT_PRICE,
    };
};

/* =====================================================
    입주민 마이페이지 - 방문차량(상가인 마이페이지는 동일하게) / 즐겨찾기
===================================================== */

/**
 * ✅ [마이페이지]
 * - 방문 차량 목록
 *
 * ✅ 사용 예시
 * const list = await fetchVisitCars(profile.id);
 */
export const fetchVisitCars = async (profileId) => {
  const { data, error } = await supabase
    .from("parking_reservations")
    .select(`
      id,
      car_num,
      visit_type,
      start_date,
      end_date,
      status,
      profiles:profile_id (
        user_name
      )
    `)
    .eq("profile_id", profileId);

  if (error) throw error;

  return (data || []).map((row) => ({
    reservation_id: row.id,
    car_num: row.car_num,
    name: row.profiles?.user_name,       // 홍길동
    type: row.visit_type,
    start_date: row.start_date?.slice(0, 10),
    end_date: row.end_date?.slice(0, 10),
    status: row.status,
  }));
};

/**
 * ✅ [마이페이지 즐겨찾기]
 *
 * ✅ 사용 예시
 * await toggleFavoriteCar(profile.id, carNum);
 */
export const toggleFavoriteCar = async (profileId, carNum) => {
    const { data } = await supabase
        .from("favorite_cars")
        .select("id")
        .eq("profile_id", profileId)
        .eq("car_num", carNum)
        .maybeSingle();
    if (data) {
        await supabase.from("favorite_cars").delete().eq("id", data.id);
    } else {
        await supabase
            .from("favorite_cars")
            .insert([{ profile_id: profileId, car_num: carNum }]);
    }
};
/***
 * 즐겨찾기 목록 가져오기
 */
export const fetchFavoriteCars = async (profileId) => {
    const { data, error } = await supabase
        .from("favorite_cars")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};
