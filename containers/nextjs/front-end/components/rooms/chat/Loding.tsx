import React from 'react'

const Loding: React.FC = () => {
  return (
    <div>
      <div className="flex animate-pulse items-center p-1.5 pl-3  bg-dark-200 rounded-lg border-2 border-green/[.2] mt-[16px]">
          <div className="h-[40px] w-[40px] bg-[#d1d5db] rounded-full border-[2px] border-green/[.2]"></div>
          <div className="ml-2 overflow-hidden mr-2 h-[13px] rounded-full w-[140px]  bg-[#d1d5db]"></div>
      </div>
    </div>
  )
}

export default Loding;

