export function LiveIndicator() {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="h-2 w-2 bg-[#f23c21] rounded-full"></div>
        <div className="absolute inset-0 h-2 w-2 bg-[#f23c21] rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
  )
}
