'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

import { close } from '@/redux_toolkit/sendMessage/sendMessageSlice';

import { useDispatch } from 'react-redux';

import { motion } from 'framer-motion';

interface Props {
  handleSubmit: (message: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  currentuser: string;
}

export default function Form({
  handleSubmit,
  setLoading,
  loading,
  currentuser,
}: Props) {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const forwordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.length) {
      setError(true);
      return;
    }

    setLoading(true);
    handleSubmit(message);
    setMessage('');
  };

  const dispatch = useDispatch();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#26274fB8] z-50 text-white flex justify-center items-center"
    >
      <div className="bg-dark p-8 space-y-4 w-11/12 sm:w-[500px] rounded-md">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold antialiased text-lg">Message</h3>
            <button onClick={() => dispatch(close())}>
              <X />
            </button>
          </div>
          <p>
            Send a message to <span>{currentuser}</span>
          </p>
        </div>
        <form autoComplete='false' className="flex flex-col gap-4" onSubmit={forwordSubmit}
        
        name='message-form1'
        id='message-form1'
        >
          <div>
            <textarea
              className="block w-full bg-dark-200 rounded-md resize-none outline-none px-2 py-1 text-sm scrollbar scrollbar-thumb-green-300  scrollbar-thumb-rounded-full scrollbar-w-2"
              rows={6}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {error ? (
              <span className="text-xs text-red capitalize">
                we can't send empty message
              </span>
            ) : null}
          </div>

          <button
            type="submit"
            className="text-white rounded-md bg-dark-200  py-4 flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Send
          </button>
        </form>
      </div>
    </motion.div>
  );
}
