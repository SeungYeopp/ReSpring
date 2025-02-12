import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getBookById, Book } from "@/lib/api/book" // API 함수와 타입 가져오기

export default function TableOfContents({ bookId }: { bookId: string }) {
  const [chapters, setChapters] = useState<{ title: string; id: number }[]>([])

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const userId = localStorage.getItem("userId") || "" // 임시로 userId 가져오기
        const book: Book = await getBookById(Number(bookId), userId)
        
        // content에서 챕터 추출
        const contentChapters = Object.entries(book.content).map(([title], index) => ({
          id: index + 1,
          title,
        }))

        setChapters(contentChapters)
      } catch (error) {
        console.error("목차 데이터를 불러오는 중 오류 발생:", error)
      }
    }

    fetchChapters()
  }, [bookId])

  return (
    <div className="space-y-2">
      {chapters.length > 0 ? (
        chapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardContent className="flex items-center p-4">
              <span className="font-medium">{chapter.title}</span>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>목차를 불러오는 중입니다...</p>
      )}
    </div>
  )
}
