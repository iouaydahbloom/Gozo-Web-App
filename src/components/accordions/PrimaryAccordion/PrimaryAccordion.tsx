import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { ReactNode, useRef, useState } from 'react';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryAccordion.module.scss'

export class AccordionItem {
  constructor(
    public value: string,
    public label: string,
    public content: ReactNode,
    public icon?: string,
    public disabled?: boolean
  ) { }
}

interface Props {
  accordionItem: AccordionItem[],
  className?: string,
  style?: 'default' | 'primary'
}

const PrimaryAccordion: React.FC<Props> = ({ accordionItem, className, style = 'default' }) => {
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [value, setValue] = useState<string>()

  const handleValue = () => {
    if (!accordionGroup.current) { return; }
    setValue(accordionGroup.current.value as string)
  }

  return (
    <IonAccordionGroup
      onClick={() => handleValue()}
      ref={accordionGroup}
      className={`${styles.primaryAccordion} ${styles[style]} ${className}`}>
      {accordionItem && accordionItem.map((item, key) => {
        return <IonAccordion key={key} value={item.value} disabled={item.disabled}>
          <IonItem slot="header">
            <img src={item.icon} alt='' className={styles.prizeImage} />
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