"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/custom/TabGreen";
import BookShelf from "../../components/BookShelf";
import StoryShelf from "../../components/StoryShelf";
import { getSessionInfo, UserInfo } from "@/lib/api/user";

export default function BookList() {
  const [myNickname, setMyNickname] = useState<string | null>(null);
  const [mySession, setMySession] = useState<UserInfo | null>(null);
  const { userNickname: userNickname } = useParams();
  const targetNickname = userNickname && !Array.isArray(userNickname) ? decodeURIComponent(userNickname) : myNickname;
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "books";
  const router = useRouter();

  // Fetch session info and set myNickname
  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const session = await getSessionInfo();
        setMySession(session);
      } catch (error) {
        console.error("Failed to fetch user nickname:", error);
      }
    };

    fetchSessionInfo();
  }, []);

  useEffect(() => {
    if (mySession && mySession.userNickname) {
      setMyNickname(mySession.userNickname);
    }
  }, [mySession]);

  const handleBack = () => {
    router.back();
  };

  if (!myNickname || !targetNickname) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full p-4">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-2 -mt-4 text-xl text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft />
      </button>

      <Tabs defaultValue={tab}>
        <TabsList className="flex justify-center items-center mb-4 -mt-3 space-x-4">
          <TabsTrigger value="books">봄날의 서재</TabsTrigger>
          {myNickname === targetNickname && <TabsTrigger value="stories">나의 글조각</TabsTrigger>}
        </TabsList>

        <TabsContent value="books">
          <BookShelf userNickname={targetNickname} />
        </TabsContent>

        <TabsContent value="stories">
          <StoryShelf userNickname={targetNickname} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
