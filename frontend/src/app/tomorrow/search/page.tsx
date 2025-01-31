import { SearchBar } from "../components/SearchBar";

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-4 py-2">
        <SearchBar placeholder="도전을 검색하세요!" />
      </div>
      <main className="flex-1 px-4">
        <h2 className="text-lg font-bold mb-4">&apos;{searchParams.q || ""}&apos; 검색 결과</h2>
        {/* 검색 결과 컴포넌트는 추후 구현 */}
      </main>
    </div>
  );
}
