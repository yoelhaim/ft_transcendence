import React from 'react'

import Settings from '@/components/settings/settings'

import Themes from '@/components/themes/Themes'

export default function page() {
  return (

    <div className=''>
		<div className="p-5 text-xl text-semibold tracking-wider hidden sm:block">
			Settings
		</div>
		<div className='flex justify-start w-full h-full p-0 overflow-hidden relative rounded-sm space-x-0 md:space-x-3 max-w-[1300px]'>
			<Settings  index={1}/>
			
			<Themes />

		</div>
	</div>
  )
}
