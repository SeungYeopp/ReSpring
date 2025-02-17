"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/custom/TabGreen";
import BookShelf from "../../components/BookShelf";
import StoryShelf from "../../components/StoryShelf";
import { useAuth } from "@/hooks/useAuth";

export default function BookList() {
  const { isAuthenticated, userNickname } = useAuth(true);
  const { userNickname: urlNickname } = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "books";
  const router = useRouter();

  const targetNickname =
    urlNickname && !Array.isArray(urlNickname) ? decodeURIComponent(urlNickname) : userNickname;

  const handleBack = () => {
    router.back();
  };

  if (!isAuthenticated || !userNickname || !targetNickname) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  const isMine = userNickname === targetNickname;

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
          {isMine && <TabsTrigger value="stories">나의 글조각</TabsTrigger>}
        </TabsList>

        <TabsContent value="books">
          <BookShelf userNickname={targetNickname} isMine={isMine} />
        </TabsContent>

        <TabsContent value="stories">
          {isMine && <StoryShelf userNickname={targetNickname} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
