import {useIonViewWillEnter, useIonViewWillLeave} from "@ionic/react"
import TabMenuHelper from "../helpers/tabMenu"

/**
 * Custom hook to be called whenever a page needs to hide the menu
 */
const useTabMenuHider = () => {
    useIonViewWillEnter(() => {
        TabMenuHelper.hideTabBar()
    }, [])

    useIonViewWillLeave(() => {
        TabMenuHelper.showTabBar()
    }, [])
}

export default useTabMenuHider;