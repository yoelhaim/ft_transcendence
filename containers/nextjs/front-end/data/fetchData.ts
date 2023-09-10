import axios from "@/api/axiosInstances";

 const fetchGetData = async(path: string) => {
  return new Promise((resolve, reject)=>{
       axios.get(path).then((resonse)=>{
        resolve(resonse.data);
       }).catch(({response})=>{
        reject(response?.data)
       })
    })
 
}
export const postData = async(path: string, payload: any) =>{
    return new Promise((resolve, reject)=>{
        axios.post(path,payload).then((respone)=>{
            resolve(respone)
        }).catch((error)=>{
            reject(error);
        })
    })
}
export default fetchGetData;