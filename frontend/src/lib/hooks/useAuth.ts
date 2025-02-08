import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionInfo } from '@/lib/api'; // getSessionInfo 함수 임포트

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

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

    // 로그인 안 된 경우, 로그인 페이지로 리디렉션
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth');  // 로그인 페이지로 리디렉션
        }
    }, [loading, isAuthenticated, router]);

    return { isAuthenticated, loading };
};
