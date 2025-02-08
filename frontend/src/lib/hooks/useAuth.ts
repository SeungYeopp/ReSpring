import { useEffect, useState } from 'react';
import { getSessionInfo, SessionInfo } from '@/lib/api'; // getSessionInfo 함수 임포트

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result : SessionInfo = await getSessionInfo();
                setIsAuthenticated(true)
            } catch(error){
                setIsAuthenticated(false)
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated };
};
