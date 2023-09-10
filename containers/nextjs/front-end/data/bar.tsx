import {  Award } from "lucide-react";
import { LayoutDashboard, Tv2, UserCog2 } from "lucide-react";
import dataBar from "next/link";
import React from "react";

type dataBar= {
    link : string,
    name : string,
    icon : React.ReactNode,
}

const Bar : dataBar[] = [
    {
        link : "/",
        name : "Profile",
        icon : <LayoutDashboard />,
    },
    {
        link : "/leaderboard",
        name : "Leaderboard",
        icon : <Award />,
    },
    {
        link : "/channels",
        name : "Channels",
        icon : <Tv2 />,
    },
    {
        link : "/settings",
        name : "Settings",
        icon : <UserCog2 />,
    }

]

export default Bar;
