import StatSummary from "./components/stat-summary";

export default function ProfilePage() {
  return (
    <main>
      <h2>프로파일 페이지</h2>
      <div className="flex gap-4">
        <div className="flex justify-center items-center h-auto p-4">
          <img src="/user.png" alt="User Profile" className="w-[100px] h-[100px] rounded-full" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex-1 flex justify-start items-center text-lg">
            <b>김싸피</b>
            <img src="/verified.svg" alt="Verified Badge" className="w-[32px]"></img>
          </div>
          <div className="flex-1 flex justify-start items-start text-sm">
            <div>
              <a>안녕하세요.</a>
              <br></br>
              <a>김싸피입니다.</a>
            </div>
          </div>
        </div>
      </div>
      <StatSummary></StatSummary>
    </main>
  );
}
