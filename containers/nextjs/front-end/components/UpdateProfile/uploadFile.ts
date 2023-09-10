import { toast } from "react-toastify";

 const UploadFileAvatar = (fileInput: any)=> {
    if (!fileInput.files || fileInput.files.length === 0) {
        toast.error('Error Image  not found');
        return;
      }
      const file = fileInput.files[0];
  
      if (!file.type.startsWith('image')) {
        toast.error('Error : type type file doasn`t correct ');
        return;
      }
  
   return file;

}

export default UploadFileAvatar