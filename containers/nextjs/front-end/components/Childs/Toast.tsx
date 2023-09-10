'use client';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'lucide-react';
import { ToastContainer, cssTransition } from 'react-toastify';

const ToastCont = () => {
  const CloseButton = ({ closeToast }: any) => (
    <div
      className="flex items-center rounded-full w-5 h-5 bg-[#a3a3a3] justify-center mt-3 p-1"
      onClick={closeToast}
    >
      <X color="white" />
    </div>
  );
  const Slider = cssTransition({
    enter: 'slideInUp',
    exit: 'slideOutDown',
    collapseDuration: 300,
  });
  return (
    <ToastContainer
      position="bottom-right"
      transition={Slider}
      autoClose={2000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      draggable
      limit={2}
      rtl={false}
      theme="light"
      closeButton={CloseButton}
      enableMultiContainer={false}
    />
  );
};

export default ToastCont;
