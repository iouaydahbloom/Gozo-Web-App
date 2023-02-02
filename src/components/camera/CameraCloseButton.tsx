import React from "react";
import {closeOutline} from "ionicons/icons";
import {IonIcon} from "@ionic/react";
import useBarcodeScanner from "../../hooks/useBarcodeScanner";

const CameraCloseButton: React.FC<any> = () => {
    const {stopScanning} = useBarcodeScanner();
    return (
        <IonIcon
            id='close-camera-icon'
            slot="icon-only"
            icon={closeOutline}
            color='light'
            size="large"
            onClick={stopScanning}/>
    )
}

export default CameraCloseButton;