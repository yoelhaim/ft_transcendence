import React, { FC } from 'react'

import MatchHistory from '@/components/matchHistory/MatchHistory'

interface Props {
  params:{login: string}
}

const page: FC<Props> = ({params}) => {

  const { login } = params

  return (
    <div className='max-w-6xl'>
        <h2 className='text-3xl mb-4'>Match History: {login}</h2>
        <MatchHistory username={login}/>
    </div>

  )
}

export default page
