import React from "react";

interface Props {
    firstPlayer: string,
    secondPlayer: string,
    firstPlayerScore: number,
    secondPlayerScore: number,
    date: string,
    index: number,
}


export default function Tr ({ firstPlayer, secondPlayer, firstPlayerScore, secondPlayerScore , date, index}: Props)
{
    return (
        <tr className={`${index % 2 ? 'bg-[#40586F]/[.4]' : 'bg-[#393A6C]/[.4]'} border-b border-[#40586F]`}>
            <td className="py-5 px-4 sm:px-14 text-left sm:w-[300px]">
                <span className="block ">{firstPlayer}</span>
                <span>{secondPlayer}</span>
            </td>
            <td>
                <span className="block">{firstPlayerScore}</span>
                <span>{secondPlayerScore}</span>
            </td>
            <td>{date}</td>
            <td></td>
        </tr>

    )
}