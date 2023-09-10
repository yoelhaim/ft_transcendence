'use client';
import { ChangeEvent } from 'react';

import { UploadCloud, UploadIcon } from 'lucide-react';

// Upload file
interface fileUploadProps {
  onError: boolean;
  avatar?: File | null;
  uploadFile: (avatar: File | null) => void;
  setErrorFile: (error: boolean) => void;
}

export const FileUpload = ({
  avatar,
  uploadFile,
  onError,
  setErrorFile,
}: fileUploadProps) => {

  const handleUploadFile = (fileInput: any) => {
    if (!fileInput.files) {
      setErrorFile!(true);
      uploadFile!(null);
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      setErrorFile!(true);
      uploadFile!(null);
      return;
    }
    const file = fileInput.files[0];

    if (!file.type.startsWith('image')) {
      setErrorFile!(true);
      uploadFile!(null);
      return;
    }
    uploadFile!(file);
    setErrorFile!(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const fileInput = e.dataTransfer;
    handleUploadFile(fileInput);
  };

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    handleUploadFile(fileInput);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };
  return (
    // min-[768px]:w-full
    <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        htmlFor="uploadFile"
            className={`w-full max-w-full md:max-w-[300px] cursor-pointer  border-none md:border md:border-dashed rounded-2xl grid md:place-content-center py-0 md:py-16 relative  ${
                onError ? 'bg-red' : null
        }`}
    >
     
     <div>
        <input
            type="file"
            id="uploadFile"
            name='uploadFile'
            className="hidden"
            onChange={onFileUploadChange}
        />
        <div className="max-w-[180px] text-center hidden md:block space-y-8">
            <div>
                <UploadCloud size={100} className="mx-auto"/>
                <h3 className="text-2xl  min-[1137px]:text-2xl mt-3">
                    Drag and drop files to upload
                </h3>
            </div>
            <h2 className="text-3xl uppercase">OR</h2>
        </div>
        <div
            className="rounded-lg bg-green-100 py-[12px] w-full text-center font-medium border-[.5px] mt-10 md:mt-8"
        >
            <span className='hidden md:block'>  Browse </span>
            <span className='flex md:hidden justify-center gap-2'> <UploadIcon/> Upload Avatar</span>
        </div>

        <div className='mt-3 text-center text-sm'>
            {avatar !== null ? <span className=''> uploaded successfully </span> : null}
            {onError ? <h3 className="">Error Upload Avatar </h3> : null}
        </div>
     </div>

    </label>
  );
};
