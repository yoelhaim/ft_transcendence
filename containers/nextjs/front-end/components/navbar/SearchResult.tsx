'use client'

import React, { useEffect, useState } from 'react'
import axios from '@/api/axiosInstances'

import Item from './Item'

interface Props {
  search: string
  setLoader: (value: boolean) => void
}

const SearchResult = ( { search, setLoader }: Props ) => {

  const [data, setData] = useState([])

  useEffect(() => {

    if (search === '') return
    setLoader(true)
    axios.get(`/search/${search}`)
      .then(res => {
        setData(res.data)
        setLoader(false)
      })
      .catch(err => {
        err;
       
      })

  }, [search])

  return (
    <div className='text-white absolute bg-dark-100 w-full  py-4 rounded-lg shadow-md shadow-[#151634] break-words z-50'>
      <ul>
        {
          data.map((item: any) => (
            <Item key={item.id} login={item.UserName} avatar_url={item.avatar} />
          ))
        }
      </ul>
      <div className='border-t mt-2 px-2 pt-3 border-green/[.5] text-sm cursor-pointer'>
        See all results for: <strong>{search}</strong>
      </div>
    </div>
  )
}


export default SearchResult