"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionInfo } from "@/lib/api/user";
import LoadingScreen from "@/components/custom/LoadingScreen";
export default function ProfileRedirectPage() {
  const router = useRouter();
  const [myNickname, setMyNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getSessionInfo();
        setMyNickname(userInfo.userNickname);
        router.replace(`/profile/${userInfo.userNickname}`);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [router]);

  return <LoadingScreen />;
  // return <p>Redirecting...</p>;
}
