import { IonContent, IonPopover } from '@ionic/react'

interface Props {
    id: string,
    content: string,
    triggerAction?: "click" | "context-menu" | "hover"
}

const PrimaryPopover: React.FC<Props> = ({id, content, triggerAction = "hover"}) => {
  return (
      <IonPopover trigger={id} triggerAction={triggerAction}>
        <IonContent class="ion-padding">{content}</IonContent>
      </IonPopover>
  )
}

export default PrimaryPopover