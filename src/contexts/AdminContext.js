import { createContext, useContext, useEffect, useState } from "react";

import {
    fetchAdminHeader,
    fetchApprovalRequests,
    approveProfile,
    fetchAdminSettlementList,
    approveSettlement,
    } from "../api/adminApi";

    /* =====================================================
    1) Context 채널 만들기 
    ===================================================== */
    const AdminContext = createContext(null);

    /* =====================================================
    2) Provider (관리자 관련 상태 + 함수)
    ===================================================== */
    const AdminProvider = ({ children }) => {
    /* -----------------------------------------------------
        ✅ 상태(state) 모음
        - 관리자 페이지에서 화면 그릴 때 필요한 값들
    ----------------------------------------------------- */

    //  관리자 헤더 (관리자 이름 표시용)
    const [adminHeader, setAdminHeader] = useState(null);

    //  승인요청 카드 목록 (가입했지만 승인 안 된 사용자)
    const [approvalList, setApprovalList] = useState([]);

    // 상가 정산 카드 목록 (할인권 누적 있는 상가만)
    const [settlementList, setSettlementList] = useState([]);

    // 로딩 (버튼 누를 때 UX)
    const [loading, setLoading] = useState(false);

    /* -----------------------------------------------------
        ✅ 1) 관리자 헤더 (관리자 페이지 상단)
    ----------------------------------------------------- */

    /**
     * ✅ [관리자 공통 Header]
     * - 관리자 이름 표시용
     *
     * ✅ 사용 예시 (관리자 레이아웃 컴포넌트)
     * const { adminHeader, loadAdminHeader } = useAdmin();
     * useEffect(()=>{ loadAdminHeader(adminId); }, []);
     */
        const loadAdminHeader = async (adminProfileId) => {
            try {
            setLoading(true);
            const header = await fetchAdminHeader(adminProfileId);
            setAdminHeader(header);
            return { ok: true };
            } catch (e) {
            console.error(e);
            return { ok: false, message: e.message };
            } finally {
            setLoading(false);
            }
        };

    /* -----------------------------------------------------
        ✅ 2) 승인요청 리스트 (관리자 - 승인요청 페이지)
    ----------------------------------------------------- */

    /**
     * ✅ [관리자 - 승인요청 리스트 불러오기]
     * - profiles.is_approved = false 인 사용자만
     *
     * ✅ 사용 예시 (승인요청 페이지)
     * const { approvalList, loadApprovalList } = useAdmin();
     * useEffect(()=>{ loadApprovalList(); }, []);
     */
    const loadApprovalList = async () => {
        try {
        setLoading(true);
        const list = await fetchApprovalRequests();
        setApprovalList(list);
        return { ok: true };
        } catch (e) {
        console.error(e);
        return { ok: false, message: e.message };
        } finally {
        setLoading(false);
        }
    };

    /**
     * ✅ [관리자 - 승인 버튼 클릭]
     * - 해당 사용자 profiles.is_approved = true 로 변경
     * - 승인 후 목록 다시 불러와서 UI 갱신
     *
     * ✅ 사용 예시 (승인요청 카드의 승인버튼)
     * const { approveUser } = useAdmin();
     * await approveUser(profile_id);
     */
    const approveUser = async (profileId) => {
        try {
        setLoading(true);
        await approveProfile(profileId);
        await loadApprovalList(); // ✅ 승인 후 화면 갱신
        return { ok: true };
        } catch (e) {
        console.error(e);
        return { ok: false, message: e.message };
        } finally {
        setLoading(false);
        }
    };

    /* -----------------------------------------------------
        ✅ 3) 상가 정산 리스트 (관리자 - 상가 정산리스트 페이지)
    ----------------------------------------------------- */

    /**
     * ✅ [관리자 - 상가 정산 카드 리스트 불러오기]
     * - parking_discounts.discount_sum > 0 인 STORE만 카드로 보여줌
     *
     * ✅ 사용 예시 (상가정산리스트 페이지)
     * const { settlementList, loadSettlementList } = useAdmin();
     * useEffect(()=>{ loadSettlementList(); }, []);
     */
    const loadSettlementList = async () => {
        try {
        setLoading(true);
        const cards = await fetchAdminSettlementList();
        setSettlementList(cards);
        return { ok: true };
        } catch (e) {
        console.error(e);
        return { ok: false, message: e.message };
        } finally {
        setLoading(false);
        }
    };

    /**
     * ✅ [관리자 - 정산 승인 버튼 클릭]
     * - 승인하면 해당 상가 discount_sum을 0으로 초기화
     * - 승인 후 리스트 다시 불러와서 카드 사라지게 갱신
     *
     * ✅ 사용 예시 (정산 카드의 승인 버튼)
     * const { approveStoreSettlement } = useAdmin();
     * const res = await approveStoreSettlement(store_profile_id);
     * if(res.ok) alert("정산 승인 완료");
     */
    const approveStoreSettlement = async (storeProfileId) => {
        try {
        setLoading(true);
        const res = await approveSettlement(storeProfileId);

        // ✅ 승인 성공이면 리스트 새로고침해서 카드 제거
        if (res.ok) {
            await loadSettlementList();
        }

        return res; // { ok, settled_qty, settled_amount, settled_date } 또는 { ok:false, message }
        } catch (e) {
        console.error(e);
        return { ok: false, message: e.message };
        } finally {
        setLoading(false);
        }
    };

    /* -----------------------------------------------------
        ✅ Context value (관리자 페이지에서 꺼내 쓰는 목록)
    ----------------------------------------------------- */
    const value = {
        // state
        adminHeader,
        approvalList,
        settlementList,
        loading,

        // header
        loadAdminHeader,

        // approval
        loadApprovalList,
        approveUser,

        // settlement
        loadSettlementList,
        approveStoreSettlement,
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
    };

    export default AdminProvider;

    /* =====================================================
    3) Hook export
    ===================================================== */
    export const useAdmin = () => useContext(AdminContext);
