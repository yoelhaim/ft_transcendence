import React from 'react'
import {  ChevronDown,  } from 'lucide-react';

interface ButtonProps {
    item: any,
    index: number,
    isOpen: number,
    Openset: (e: any) => void,
    selected: number,
    selectItem: (index: number, value:number) => void

}



export default function Button({ item, index, isOpen, Openset, selected, selectItem }: ButtonProps) {

    const hanldeSelect = (name: string) => {
        const idx = item.findIndex((e: any) => e.name == name)
        selectItem(index, idx)
        Openset(index)
     
    }
    return (
        <div className="relative w-full xl:w-64 h-16">
            <div onClick={ () => Openset(index) } className="cursor-pointer flex bg-dark-200 rounded  justify-between py-4 px-6 items-center h-full">
                <div className='flex'>
                    {item[selected]?.src}
                    <button className="ml-4 xl:ml-2 font-semibold text-2xl">{item[selected]?.name}</button>
                </div>

                <div className={`ml-2 transform ${isOpen == index ? 'rotate-180' : ''}  transition-all duration-500 ease-in-out`}>
                <ChevronDown size={30}/>
                </div>

            </div>

            <div className="absolute w-full z-30 ">
                <div className={`shadow-md shadow-[#151634] rounded bg-dark-200 mt-4 overflow-hidden  ${isOpen == index ? 'h-full' : 'h-0'}`}>
                    {
                        item.map((child: any, idx: number) => {
                            if (idx == selected) return null
                            return (
                            <div key={idx} className="flex  py-3 px-4 items-center border-10 hover:bg-dark-100/[.5] cursor-pointer rounded-r-lg border-l-transparent "
                                onClick={ () => hanldeSelect(child.name) }
                            >
                                {child.src}
                                <button className="ml-2 font-semibold text-2xl ">{ child.name }</button>
                            </div>
                        )})
                    }
                </div>
            </div>

        </div>
    )
}