
export function ChardSkeleton() {
  return (
    <div className="bg-[#012140] rounded-2xl p-6 text-[#EDEDED] flex flex-col justify-between animate-pulse">
      <div className="relative h-[200px] flex items-center justify-center w-full bg-[#6b7280] rounded-xl">
        <div className="w-10 h-10 text-[#9ca3af]"  />
        <span className="absolute bottom-[10px] right-[15px] bg-[#9ca3af] p-5 rounded-lg w-24"></span>
      </div>
      <div className="mt-8">
        <div>
          <div className="h-2 bg-[#6b7280] rounded-full w-48 mb-4"></div>
          <div className="mt-2 text-[#707D93]">
            <div className="h-2 bg-[#6b7280] rounded-full max-w-[480px] mb-2.5"></div>
            <div className="h-2 bg-[#6b7280] rounded-full mb-2.5"></div>
            <div className="h-2 bg-[#6b7280] rounded-full max-w-[440px] mb-2.5"></div>
            <div className="h-2 bg-[#6b7280] rounded-full max-w-[360px]"></div>
          </div>
        </div>

        <div className="mt-4 h-[50px]">
          <div className="h-full bg-[#6b7280] w-full rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default function ChannelsSkeleton() {
  const skeleton: number[] = Array(4).fill(0);
  return (
    <>
      {skeleton.map((_, index: number) => (
        <ChardSkeleton key={index} />
      ))}
    </>
  );
}
