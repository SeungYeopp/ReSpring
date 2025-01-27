import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/custom/TabGreen"
import CategoryBooks from "./CategoryBooks";

export const Category = () => {
    return(
        <div className="flex flex-col items-center justify-center">
            <Tabs defaultValue="retirement" className="flex flex-col items-center justify-center">
                <TabsList>
                    <TabsTrigger value="retirement">은퇴</TabsTrigger>
                    <TabsTrigger value="hope">희망</TabsTrigger>
                    <TabsTrigger value="graduation">졸업</TabsTrigger>
                </TabsList>
                <TabsContent value="retirement">
                    <CategoryBooks/>
                </TabsContent>
                <TabsContent value="hope">
                </TabsContent>
                <TabsContent value="graduation">
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Category;