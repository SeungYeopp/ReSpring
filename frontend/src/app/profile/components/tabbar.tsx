'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/custom/TabGreen";
import Footsteps from "./footsteps";
import CommunityPosts from "./my-activities";

export const Tabbar: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Tabs defaultValue="footsteps" className="flex flex-col items-center justify-center">
        <TabsList>
          <TabsTrigger value="footsteps">발자취</TabsTrigger>
          <TabsTrigger value="sub-activities">구독자 활동</TabsTrigger>
          <TabsTrigger value="my-activities">나의 활동</TabsTrigger>
          <TabsTrigger value="achievements">성취</TabsTrigger>
        </TabsList>
        <br />
        <TabsContent value="footsteps">
          <Footsteps userId={userId} />
        </TabsContent>
        <TabsContent value="sub-activities"></TabsContent>
        <TabsContent value="my-activities">
          <CommunityPosts />
        </TabsContent>
        <TabsContent value="achievements"></TabsContent>
      </Tabs>
    </div>
  );
};

export default Tabbar;