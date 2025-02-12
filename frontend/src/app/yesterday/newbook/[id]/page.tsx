import { Suspense } from "react"
import TopSection from "../components/TopSection"
import BottomSection from "../components/BottomSection"
import SkeletonUI from "../components/SkeletonUI"

export default function AutobiographyDetailPage({ params }: { params: { BookId: string } }) {
  return (
    <Suspense fallback={<SkeletonUI />}>
      <main className="min-h-screen bg-background text-foreground">
        <TopSection bookId={params.BookId} />
        <BottomSection bookId={params.BookId} />
      </main>
    </Suspense>
  )
}

