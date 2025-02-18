"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/custom/TabGreen";
import { Post, Subscriber, getAllSubscribers, cancelSubscription, getAllSubscribersActivities, getAllSubscribersBooks } from "@/lib/api/subscribe";
import { Book } from "@/lib/api/book";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"subscribers" | "activities">("subscribers");

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSubscribers();
        setSubscribers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="relative">
      <Tabs 
        defaultValue="subscribers" 
        onValueChange={(value) => setActiveTab(value as "subscribers" | "activities")}
      >
        <TabsList className="flex justify-center md:justify-start -mt-4 space-x-4">
          <TabsTrigger value="subscribers" className="flex flex-col items-center">구독자 목록</TabsTrigger>
          <TabsTrigger value="activities" className="flex flex-col items-center">구독자 활동</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscribers">
          {activeTab === "subscribers" && (
            <div className="space-y-4 w-full mt-4">
              <SubscriberList subscribers={subscribers} setSubscribers={setSubscribers} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="activities">
          {activeTab === "activities" && (
            <div className="space-y-4 w-full mt-4">
              <SubscribersActivities />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SubscriberList({ subscribers, setSubscribers }: { subscribers: Subscriber[], setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>> }) {
  if (subscribers.length === 0) {
    return <p className="text-center text-gray-500 mt-4">구독자가 없습니다.</p>;
  }

  const handleUnsubscribe = async (nickname: string) => {
    if (!confirm(`${nickname}님을 구독 취소하시겠습니까?`)) return;

    try {
      const success = await cancelSubscription(nickname);
      if (success) {
        setSubscribers((prev) => prev.filter((subscriber) => subscriber.userNickname !== nickname));
      }
    } catch (error) {
      console.error("구독 취소 실패", error);
    }
  };

  return (
    <div className="space-y-3">
      {subscribers.map((subscriber) => (
        <Card key={subscriber.id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 flex items-center justify-between">
            <Link href={`/profile/${subscriber.userNickname}`} className="flex items-center flex-1 cursor-pointer">
              <Image 
                src={subscriber.profileImage || "/placeholder_profilepic.png"} 
                alt={subscriber.userNickname} 
                width={40} 
                height={40} 
                className="w-10 h-10 rounded-full object-cover mr-4 overflow-hidden"
              />
              <h3 className="text-md font-semibold text-gray-800">{subscriber.userNickname}</h3>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleUnsubscribe(subscriber.userNickname)}
            >
              구독 취소
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SubscribersActivities() {
  const [activities, setActivities] = useState<(Post | Book)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const [posts, books] = await Promise.all([getAllSubscribersActivities(), getAllSubscribersBooks()]);
        const mergedActivities = [...posts, ...books].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setActivities(mergedActivities);
      } catch (error) {
        console.error("활동 불러오기 실패", error);
      }
      setIsLoading(false);
    };

    fetchActivities();
  }, []);

  if (isLoading) return <p className="text-center text-gray-500 mt-4">로딩 중...</p>;

  if (activities.length === 0) return <p className="text-center text-gray-500 mt-4">활동 내역이 없습니다.</p>;

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const isPost = "postId" in activity;
        const link = isPost ? `/today/${activity.postId}` : `/yesterday/book/${activity.id}`;
        const message = isPost
          ? `${activity.authorNickname} 님이 새로운 글을 작성하셨습니다.`
          : `${activity.authorNickname} 님이 새로운 오늘의 서를 편찬하셨습니다.`;
        const profileImage = isPost ? activity.authorImage : activity.authorProfileImage;

        return (
          <Link key={isPost ? activity.postId : activity.id} href={link} className="block">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={profileImage || "/placeholder_profilepic.png"}
                    alt={activity.authorNickname}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover mr-4 overflow-hidden"
                  />
                  <div>
                    <p className="text-sm text-gray-600">{message}</p>
                    <h3 className="text-md font-semibold text-gray-800">{activity.title}</h3>
                  </div>
                </div>

                <div className="flex flex-col ml-4 items-end text-right">
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNowStrict(new Date(activity.createdAt), { addSuffix: true, locale: ko })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
