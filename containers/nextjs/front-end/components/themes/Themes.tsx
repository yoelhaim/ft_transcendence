'use client';

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import axios from '@/api/axiosInstances';

interface ThemeProps {
    themeid: number,
    path: string,
    name: string,
    active: boolean,
    rerendre: boolean,
    setRerendre: (arg: boolean) => void
}

const getbgColor = (theme: string = '/textures/fire.jpg') => {

    if (theme == '/textures/fire1.jpg') {
        return 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
    }
    else if (theme == '/textures/ice.jpg') {
        return "linear-gradient(to right, #DECBA4, #3E5151)"
    } else {
        return 'linear-gradient(to right, #8360c3, #2ebf91)'
    }


}

const ThemeComponent = ({themeid, path, name, active, rerendre, setRerendre }: ThemeProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [id] = useState<number>(themeid)

    const selectTheme = () => {
       
        setLoading(true)

        axios.post('/themes', { id })
            .then(() => {
                setLoading(false)
                setRerendre(!rerendre)
            })
            .catch((err) => {
                err;
                setLoading(false)
            })
    }

    return (
        <div className='h-[170px] bg-[#F5EFE7] flex'>
            <div
                className='relative w-full'
                style={{background: getbgColor(path)}}
            >
              
                <button
                    className={`cursor-pointer flex justify-center items-center rounded-sm disabled:opacity-90 active:scale-95 py-2 px-4 font-semibold antialiased tracking-wide capitalize absolute right-1 bottom-1 ${active ? "text-[#F4F4F4] bg-dark-100" : "text-dark bg-[#F4F4F4]"}`}
                    disabled={active}
                    onClick={selectTheme}
                >
                    {loading ? <Loader2 className='mr-1 h-4 w-4 animate-spin' /> : null}
                    {name}
                </button>
            </div>
        </div>
    )
}


export default function Themes() {

    const [themes, setThemes] = useState<any>([])
    const [rerendre, setRerendre] = useState<boolean>(false)

    useEffect(() => {

        axios.get('/themes')
            .then((res) => {
                setThemes(res.data)
            }
            )
            .catch((err) => {
                err;
            })
    
    }, [rerendre])

    
    return (
        <div className='flex flex-col gap-4 w-[70%]'>
            { themes.map((theme: any) => ( <ThemeComponent key={theme.id} themeid={theme.id} path={theme.image} name={theme.name} active={theme.selected} rerendre={rerendre} setRerendre={setRerendre} /> )) }
        </div>
    )
}
