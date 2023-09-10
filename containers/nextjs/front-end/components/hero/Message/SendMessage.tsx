'use client'

import React, { useState } from 'react'
import Form from './Form'

import { useSelector } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import axiosInstances from '@/api/axiosInstances'
import { toast } from 'react-toastify'

export default function SendMessage() {
  const nameSender = useSelector((state: any) => state.auth.nameSender)
  const id = useSelector((state: any) => state.auth.id)
  const [loading, setLoading] = useState<boolean>(false)

  
  const handleSubmit = (message: string) => {

// fix axios 404 error    
    axiosInstances.post('/list/send-direct-message', {
      senderid: id,
      receiverid: nameSender,
      message: message,
    }).then((res)=>{
        res;
      setLoading(false);
      toast.success("Message sent Successfully")
    }).catch((err)=>{
        err;
      setLoading(false)
      toast.error("Error")
    })

}
    const {isOpen} = useSelector((state: any) => state.sendMessage)
    
  return (
      <AnimatePresence>
  
        {isOpen && (
            <Form  handleSubmit={handleSubmit} setLoading={setLoading} loading={loading} currentuser={nameSender}/>
        )}
      </AnimatePresence>
  )
}
