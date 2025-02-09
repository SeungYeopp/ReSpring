'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const myId = "beb9ebc2-9d32-4039-8679-5d44393b7252";

  useEffect(() => {
    router.replace(`/profile/${myId}`);
  }, [router]);

  return <p>Redirecting...</p>;
}