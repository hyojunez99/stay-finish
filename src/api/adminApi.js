import  supabase  from "./supabaseClient";

    /* =====================================================
    ✅ 관리자 공통 상수
    - 여러 API에서 같은 값 쓰면 여기서 통일
    ===================================================== */
    const UNIT_PRICE = 1500;

    /* =====================================================
    관리자 헤더
    ===================================================== */

    /**
     * ✅ [관리자 페이지 상단 Header]
     * - 관리자 이름 표시 (profiles.user_name)
     * - user_type이 ADMIN인지 체크
     *
     * ✅ 사용 예시
     * const header = await fetchAdminHeader(adminProfileId);
     * // header.role_label -> "관리자"
     * // header.admin_name -> "홍길동"
     */
    export const fetchAdminHeader = async (adminProfileId) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, user_name, user_type")
        .eq("id", adminProfileId)
        .single();

    if (error) throw error;

    // ✅ 안전장치: 관리자 계정만 접근
    if (data.user_type !== "ADMIN") {
        throw new Error("관리자 계정이 아닙니다.");
    }

    return {
        role_label: "관리자",
        admin_name: data.user_name,
    };
    };

    /* =====================================================
    승인요청 리스트 / 승인 처리
    ===================================================== */

    /**
     * ✅ [관리자 페이지 - 승인요청 리스트]
     * - 가입했지만 승인 안 된 사용자 목록
     * - profiles.is_approved = false 인 행들
     *
     * ✅ 사용 예시
     * const list = await fetchApprovalRequests();
     * // list.map(card => card.user_name ...)
     */
    export const fetchApprovalRequests = async () => {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, user_type, user_name, dong_ho, car_num, add_car, is_approved, created_at")
        .eq("is_approved", false)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((row) => ({
        profile_id: row.id,
        user_type: row.user_type,
        user_name: row.user_name,
        dong_ho: row.dong_ho,
        car_num: row.car_num,
        add_car: row.add_car ?? null,
        created_at: row.created_at?.slice(0, 10) ?? null, // 날짜만
    }));
    };

    /**
     * ✅ [관리자 페이지 - 승인 버튼]
     * - 해당 사용자 profiles.is_approved = true 로 변경
     *
     * ✅ 사용 예시
     * await approveProfile(profileId);
     * // 이후 fetchApprovalRequests() 다시 호출해서 화면 갱신
     */
    export const approveProfile = async (profileId) => {
    const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", profileId);

    if (error) throw error;
    return true;
    };

    /* =====================================================
    상가 정산 리스트 / 정산 승인
    ===================================================== */

    /**
     * ✅ [관리자 페이지 - 상가 정산 리스트(카드 여러 개)]
     * - parking_discounts.discount_sum > 0 인 상가만 보여줌
     * - (DB에 "정산요청 상태" 컬럼이 없어서) 누적이 있으면 '정산 대상'으로 간주
     *
     * ✅ 사용 예시
     * const cards = await fetchAdminSettlementList();
     * // cards를 map으로 카드 UI 렌더링
     */
    export const fetchAdminSettlementList = async () => {
    const { data, error } = await supabase
        .from("parking_discounts")
        .select(
        `
        profile_id,
        discount_sum,
        created_at,
        profiles (
            user_name,
            user_type
        )
        `
        )
        .gt("discount_sum", 0); // ✅ 누적 있는 상가만

    if (error) throw error;

    const today = new Date().toISOString().slice(0, 10);

    return (data || [])
        .filter((r) => r.profiles?.user_type === "STORE")
        .map((r) => {
        const qty = r.discount_sum ?? 0;

        return {
            store_profile_id: r.profile_id,
            store_name: r.profiles?.user_name ?? "(상가)",
            // ✅ DB에 "기간"이 없으므로: 최근 created_at(정산일로 사용) ~ 오늘
            from_date: r.created_at ? r.created_at.slice(0, 10) : null,
            to_date: today,
            qty,
            unit_price: UNIT_PRICE,
            amount: qty * UNIT_PRICE,
        };
        });
    };

    /**
     * ✅ [관리자 페이지 - 정산 승인 버튼]
     * - 승인하면 해당 상가 discount_sum을 0으로 초기화
     * - created_at을 now로 바꿔서 "최근 정산일"처럼 사용
     *
     * ✅ 사용 예시
     * const res = await approveSettlement(storeProfileId);
     * if(res.ok) alert("정산 승인 완료");
     * // 이후 fetchAdminSettlementList() 재호출
     */
    export const approveSettlement = async (storeProfileId) => {
    // 1) 현재 누적 조회 (0이면 승인할 게 없음)
    const { data, error: readErr } = await supabase
        .from("parking_discounts")
        .select("discount_sum")
        .eq("profile_id", storeProfileId)
        .maybeSingle();

    if (readErr) throw readErr;

    const qty = data?.discount_sum ?? 0;
    if (qty === 0) {
        return { ok: false, message: "정산할 내역이 없습니다." };
    }

    // 2) 정산 처리 (초기화)
    const nowIso = new Date().toISOString();
    const { error: updErr } = await supabase
        .from("parking_discounts")
        .update({ discount_sum: 0, created_at: nowIso })
        .eq("profile_id", storeProfileId);

    if (updErr) throw updErr;

    // 3) 관리자 화면에서 보여줄 결과값
    return {
        ok: true,
        settled_qty: qty,
        settled_amount: qty * UNIT_PRICE,
        settled_date: nowIso.slice(0, 10),
    };
};
