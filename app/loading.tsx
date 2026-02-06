export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo/Spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#DC143C] animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#DC143C]"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-1 animate-pulse">
          <h2 className="text-lg font-bold text-[#DC143C]">USSI ITS</h2>
          <p className="text-xs text-slate-500">Memuat data...</p>
        </div>
      </div>
    </div>
  );
}
