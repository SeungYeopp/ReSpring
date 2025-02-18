"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/custom/LoadingScreen";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { userNickname, isAuthenticated } = useAuth(true);

  useEffect(() => {
    if (isAuthenticated && userNickname) {
      router.replace(`/profile/${userNickname}`);
    }
  }, [isAuthenticated, userNickname, router]);

  return <LoadingScreen />;
  // return <p>Redirecting...</p>;
}
