import { useEffect, useState } from 'react';
import { getSessionInfo } from '@/lib/api'; // getSessionInfo 함수 임포트

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getSessionInfo();
                setIsAuthenticated(true);  // 로그인 상태로 설정
            } catch (error) {
                setIsAuthenticated(false); // 로그인되지 않음
            } finally {
                setLoading(false);  // 로딩 끝
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated, loading };
};
