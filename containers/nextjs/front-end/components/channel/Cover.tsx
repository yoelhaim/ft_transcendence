import React from 'react'

import Image from 'next/image'

export default function Cover() {
  return (
    <div className='w-full h-[450px] rounded-md overflow-hidden'>
        <Image src='/images/coverProfile.png' width={500} height={500} alt="#" className='w-full h-full object-cover'  blurDataURL='/images/blur.jpg'/>
    </div>
  )
}