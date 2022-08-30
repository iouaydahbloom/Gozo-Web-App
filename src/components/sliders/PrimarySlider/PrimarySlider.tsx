import { IonSlide, IonSlides } from '@ionic/react'
import React, { ReactNode, useMemo } from 'react'
import styles from './primarySlider.module.scss';

interface Props {
    pager?: boolean,
    forceSingleSlide?: boolean,
    slides: ReactNode[] | string[]
}

const PrimarySlider: React.FC<Props> = ({ pager = true, slides, forceSingleSlide = false }) => {

    const slideOpts = useMemo(() => {
        return {
            breakpoints: !forceSingleSlide ? {
                1200: {
                    slidesPerView: 1
                }
            } : null
        }
    }, [forceSingleSlide])

    return (
        <IonSlides
            className={styles.slider}
            pager={pager}
            options={slideOpts}>
            {
                slides && slides.map((slide, index) => {
                    return (<IonSlide
                        key={index}
                        className={`${styles.slide} ion-padding`}>
                        {slide}
                    </IonSlide>)
                })
            }
        </IonSlides>
    )
}

export default PrimarySlider;
