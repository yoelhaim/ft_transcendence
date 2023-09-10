'use client';


import { useInput } from '@/hooks/customHooks'

export default function Edit() {

    const title = useInput('pongster room')
    const password = useInput('')

  return (
    <div className='flex flex-col gap-4 max-w-lg'>
      <div className='flex flex-col'>
        <label htmlFor="title" className='capitalize mb-1'>title</label>
        <input
          type="text"
          name="title"
          id="title"
          className='bg-[transparent] outline-none border-2  border-green/[.5] rounded-md p-2'
            {...title}
        />
      </div> 

      <div className='flex flex-col'>
        <label htmlFor="desc" className='capitalize  mb-1'>description</label>
        <textarea
          name="desc"
          id="desc"
          className='bg-[transparent] outline-none border-2  border-green/[.5] rounded-md p-2'
        ></textarea>
      </div>

      <div>
        <span className='capitalize block mb-2'>visiblite</span>
        <div>

          <div className='flex flex-row-reverse justify-end mb-1 gap-2'>
            <label htmlFor="public">public</label>
            <input type="radio" name="visiblite" id="public"/>
          </div>

          <div className='flex flex-row-reverse  justify-end mb-1 gap-2'>
            <label htmlFor="private">private</label>
            <input type="radio" name="visiblite" id="private"/>
          </div>

          <div className='flex flex-row-reverse  justify-end mb-1 gap-2'>
            <label htmlFor="protected">protected</label>
            <input type="radio" name="visiblite" id="protected"/>
          </div>

          <div className='flex flex-col mt-4'>
            <label htmlFor="password" className='capitalize mb-1'>password</label>
            <input
              type="password"
              name="password"
              id="password"
              className='bg-[transparent] outline-none border-2  border-green/[.5] rounded-md p-2'
              {...password}
            />
          </div>

        </div>
      </div>
      <div>
        <label htmlFor="file">
          upload image
        </label>
        <input type="file" name="file" id="file" className='hidden'/>
      </div>

      <div>
        <button>update</button>
      </div>
    </div>
  )
}
