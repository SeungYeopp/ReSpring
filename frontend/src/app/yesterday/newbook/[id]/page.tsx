import { Suspense } from "react"
import TopSection from "../components/TopSection"
import BottomSection from "../components/BottomSection"

export default function AutobiographyDetailPage({ params }: { params: { BookId: string } }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div>Loading top section...</div>}>
        <TopSection bookId={params.BookId} />
      </Suspense>
      <Suspense fallback={<div>Loading bottom section...</div>}>
        <BottomSection bookId={params.BookId} />
      </Suspense>
    </main>
  )
}

