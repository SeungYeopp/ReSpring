import { Card, CardContent } from "@/components/ui/card"

export default function TableOfContents({ bookId }: { bookId: string }) {
  const chapters = [
    { id: 1, title: "Chapter 1: 어린 시절의 기억" },
    { id: 2, title: "Chapter 2: 첫 번째 도전" },
    { id: 3, title: "Chapter 3: 전환점" },
    { id: 4, title: "Chapter 4: 새로운 시작" },
  ]

  return (
    <div className="space-y-2">
      {chapters.map((chapter) => (
        <Card key={chapter.id}>
          <CardContent className="flex items-center p-4">
            <span className="font-medium">{chapter.title}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

