import React from 'react'

import Member from '@/components/memberProfile/Member'

interface Props {
    params: { login: string }
}

export default function Page({params}: Props) {
  return (
    <Member userLogin={params.login}/>
  )
}
