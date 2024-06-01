import React, { Component } from "react";
import StyleComponent from "@/components/StyleComponent";
import FlatListComponent from "@/components/FlatListComponent";

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        nome: 'Sport',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        nome: 'Tempo per me',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        nome: 'Amicizia',
    },
];


export default function Home() {
    return (
        <FlatListComponent data={ DATA} />
    )
}

