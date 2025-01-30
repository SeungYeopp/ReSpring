import Me from "./components/me";
import Others from "./components/others";
import StatSummary from "./components/stat-summary";
import TabBar from "./components/tabbar";

export default function ProfilePage() {
  return (
    <main>
      <div className="flex gap-4 pl-[5%] pt-4">
        <div className="flex justify-center items-center h-auto p-4">
          <img src="/user.png" alt="User Profile" className="w-[100px] h-[100px] rounded-full" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex-1 flex justify-start items-center text-lg">
            <b>김싸피</b>
            <img src="/verified.svg" alt="Verified Badge" className="w-[32px]" />
          </div>
          <div className="flex-1 flex justify-start items-start text-sm">
            <div>
              <a>안녕하세요.</a>
              <br />
              <a>김싸피입니다.</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex-1 flex justify-start items-end text-lg">
            <b>보유 뱃지</b>
          </div>
          <div className="flex-1 flex justify-start items-start text-sm">
            <div className="flex">
             <img src="/verified.svg" alt="Verified Badge" className="w-[48px]" />
             <img src="/verified.svg" alt="Verified Badge" className="w-[48px]" />
             <img src="/verified.svg" alt="Verified Badge" className="w-[48px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <Me />
      </div>
      <div className="flex justify-center items-center w-full">
        <Others />
      </div>
      <StatSummary />
      <br />
      <TabBar />
    </main>
  );
}