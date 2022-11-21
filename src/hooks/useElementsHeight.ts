import { useIonViewWillEnter } from "@ionic/react";
import { useEffect, useLayoutEffect, useState } from "react";

const useElementsHeight = () => {
    const [bottomTabHeight, setBottomTabHeight] = useState<number>()
    const [internalTabHeight, setInternalTabHeight] = useState<number>()

    const getHeightById = (id: string) => {
        return document.getElementById(id)?.offsetHeight;
    }

    const getHeightByClassName = (name: string) => {
        const element = document.querySelector(name) as HTMLElement;
        console.log("element", element)
        return element && element.offsetHeight
    }

    const getBottomTabHeight = () => {
        const height = getHeightById('app-tab-bar')
        setBottomTabHeight(height)
    }

    const getInternalTabHeight = () => {
        const height = getHeightByClassName('react-tabs__tab-list')
        console.log("height", height)
        if(height) setInternalTabHeight(height)
    }

    // useLayoutEffect(() => {
    //     console.log("from layout")
    //     getBottomTabHeight()
    //     getInternalTabHeight()
    // },[])
    

    return {
        getInternalTabHeight,
        getBottomTabHeight,
        bottomTabHeight,
        internalTabHeight
    }
}

export default useElementsHeight;