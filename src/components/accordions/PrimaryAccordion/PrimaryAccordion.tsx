import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useRef, useState } from 'react';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryAccordion.module.scss'

export class AccordionItemData {
  constructor(
    public value: string,
    public label: string,
    public content: string,
    public icon?: string
  ) { }
}

interface Props {
  accordionItemData: AccordionItemData[],
  className?: string
}

const PrimaryAccordion: React.FC<Props> = ({ accordionItemData, className }) => {
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [value, setValue] = useState<string>()

  const handleValue = () => {
    if (!accordionGroup.current) { return; }
    setValue(accordionGroup.current.value as string)
  }

  return (
    <IonAccordionGroup onClick={() => handleValue()} ref={accordionGroup} className={`${styles.primaryAccordion} ${className}`}>
      {accordionItemData && accordionItemData.map((item, key) => {
        return <IonAccordion key={key} value={item.value}>
          <IonItem slot="header">
            <img src={item.icon} className={styles.prizeImage} />
            <IonLabel className={`${value === item.value ? styles.active : ''} ion-padding`}>{item.label}</IonLabel>
          </IonItem>
          <div className="ion-padding" slot="content">
            <PrimaryTypography color='light'>
              {item.content}
            </PrimaryTypography>
          </div>
        </IonAccordion>
      })}
    </IonAccordionGroup>
  );
}
export default PrimaryAccordion;