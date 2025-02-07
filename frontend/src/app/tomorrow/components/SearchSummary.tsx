interface SearchSummaryProps {
  query: string;
  resultCount: number;

}

export function SearchSummary({ query, resultCount,  }: SearchSummaryProps) {
  return (
    <div className="text-sm text-gray-600 mb-4">
      <p>
        &quot;{query}&quot;에 대한 검색 결과 {resultCount}개를 찾았습니다.
      </p>
    </div>
  );
}
