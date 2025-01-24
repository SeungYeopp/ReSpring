export default function StatSummary() {
  return (
    <main>
      {/* Long Bar at the Top */}
      <div className="w-[90%] h-[5px] bg-gray-800"></div>

      {/* Main Grid Layout with Three Columns */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div className="h-[100px] bg-gray-300">Row 1 in Column 1</div>
          <div className="h-[100px] bg-gray-400">Row 2 in Column 1</div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div className="h-[100px] bg-gray-300">Row 1 in Column 2</div>
          <div className="h-[100px] bg-gray-400">Row 2 in Column 2</div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <div className="h-[100px] bg-gray-300">Row 1 in Column 3</div>
          <div className="h-[100px] bg-gray-400">Row 2 in Column 3</div>
        </div>
      </div>

      {/* Long Bar at the Bottom */}
      <div className="w-full h-[5px] bg-gray-800"></div>
    </main>
  );
}
