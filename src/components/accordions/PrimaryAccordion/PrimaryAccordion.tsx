import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonText,
} from '@ionic/react';
import { useRef, useState } from 'react';
import styles from './primaryAccordion.module.scss'

export class AccordionItemData {
  constructor(public value: string, public label: string, public content: string) { }
}

interface Props {
  accordionItemData: AccordionItemData[]
}

const PrimaryAccordion: React.FC<Props> = ({ accordionItemData }) => {
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [value, setValue] = useState<string>()

  const handleValue = () => {
    if (!accordionGroup.current) { return; }
    setValue(accordionGroup.current.value as string)
  }

  return (
    <IonAccordionGroup onClick={() => handleValue()} ref={accordionGroup} className={styles.primaryAccordion}>
      {accordionItemData && accordionItemData.map((item, key) => {
        return <IonAccordion key={key} value={item.value}>
          <IonItem slot="header">
            <IonText className={`${value === item.value ? styles.active : ''} ion-padding-vertical`}>{item.label}</IonText>
          </IonItem>
          <div className="ion-padding-vertical" slot="content">
            {item.content}
          </div>
        </IonAccordion>
      })}
    </IonAccordionGroup>
  );
}
export default PrimaryAccordion;