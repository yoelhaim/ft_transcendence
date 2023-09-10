
import { useState , useEffect } from "react"
import axios from "@/api/axiosInstances"
import Icon from "@/components/icon/Icon"


export default function League() {
  const [total, setTotal] = useState<number>(0)
  const [name, setName] = useState<string>("")
  useEffect(() => {
    const fetchData = async () => {
        const result = await axios.get(
            'leaderboard/user/static'
        );
        setTotal(result.data.total as number);
        setName(result.data.league as string);
    }
    fetchData();
}, [])
  return (
    <div className="flex items-center bg-dark-200 p-3">
        {
            name !== ''  ?(< Icon name={`archivment/${name}.svg`} width={50} height={50}  style={{width: '30px'}}/>): null
        }
       
        <div className="ml-5">
        <div className="font-bold">{name}</div>
        <div className="font-bold">Players: {total}</div>
        </div>
    </div>
    )
}