import BookDetail from "@/app/yesterday/components/BookDetail"

// 오늘의 상세 페이지 컴포넌트
export default function BookDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
        <BookDetail bookId={params.id}></BookDetail>
    </div>
  );
}
