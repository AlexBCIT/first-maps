import ItemBox from '../../components/ItemBox/ItemBox.jsx'
import Carousel from '../../components/Carousel/Carousel.jsx'
import { useRef, useEffect, useState, } from "react";
import Header from '../../components/Header/Header.jsx';

export default function TryThings() {
  return (
    <div>
        <Header/>
        <Carousel/>
        <ItemBox />
    </div>
  )
}

