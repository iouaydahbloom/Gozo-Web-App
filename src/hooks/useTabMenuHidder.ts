import { useIonViewWillEnter, useIonViewWillLeave } from "@ionic/react"
import TabMenuHelper from "../helpers/tabMenu"

const useTabMenuHidder = () => {
    useIonViewWillEnter(() => {
        TabMenuHelper.hideTabBar()
    }, [])

    useIonViewWillLeave(() => {
        TabMenuHelper.showTabBar()
    }, [])
}

export default useTabMenuHidder;