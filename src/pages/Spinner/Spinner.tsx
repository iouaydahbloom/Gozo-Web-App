import { IonButton, IonButtons, IonHeader, IonIcon, IonPage, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import { WheelSegment } from '../../models/wheelSegment';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import SpinCondition from './SpinConditionModal/SpinCondition';
import styles from './spinner.module.scss';
import { modalController } from '@ionic/core';
import SpinSuccess from './SpinSuccessModal/SpinSuccess';
import { LoyaltyProgram, UserLoyaltyProgram } from '../../models/loyaltyProgram';
import useBlockchainContractExecution from '../../hooks/useBlockchainContractExecution';
import { appConfig } from '../../constants/appConfig';
import { contractsAbi } from '../../constants/contractsAbis';
import useSearchParams from '../../hooks/useSearchParams';
import useLoyaltyPrograms from '../../hooks/useLoyaltyPrograms';
import usePlayGame from '../../hooks/usePlayGame';
import usePrize from '../../hooks/usePrize';
import useDialog from '../../hooks/useDialog';
import PrimaryAccordion, { AccordionItemData } from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';
import ProgramSelection, { ProgramSelectOption } from './ProgramSelection/ProgramSelection';
import useAssets from '../../hooks/useAssets';
import useMemberShip from '../../hooks/useMembership';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import ParticlesLoader from '../../components/sections/ParticlesLoader/ParticlesLoader';
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import useToast from '../../hooks/useToast';
import { informationCircleOutline } from 'ionicons/icons';
import PrimaryPopover from '../../components/popovers/PrimaryPopover/PrimaryPopover';
import { useDapp } from '../../providers/DappProvider/DappProvider';

// const options: any = [
//     { name: 'Air France Loyalty Program', balance: '400', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
//     { name: 'Air France Loyalty', balance: '500', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
//     { name: 'Air France', balance: '600', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
//     { name: 'Air', balance: '700', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
//     { name: 'Ai', balance: '800', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
//     { name: 'A', balance: '900', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" }
// ]

// const prizes: AccordionItemData[] = [
//     new AccordionItemData("test", "test", "test", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new AccordionItemData("test1", "test1", "test1", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new AccordionItemData("test2", "test2", "test2", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new AccordionItemData("test3", "test3", "test3", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new AccordionItemData("test4", "test4", "test4", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new AccordionItemData("test5", "test5", "test5", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
// //     new AccordionItemData("test6", "test6", "test6", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
// ]

// const data: WheelSegment[] = [
//     new WheelSegment("United kingdom", "United kingdom", "#95181B"),
//     new WheelSegment("United States", "United States", "#214697", 'assets/image/sarah.png'),
//     new WheelSegment("France", "France", "#95181B"),
//     new WheelSegment("Germany", "Germany", "#214697", 'assets/image/sarah.png'),
//     new WheelSegment("Spain", "Spain", "#95181B"),
//     new WheelSegment("China", "China", "#214697", 'assets/image/sarah.png'),
//     new WheelSegment("Portugal", "Portugal", "#95181B"),
//     new WheelSegment("Lebanon", "Lebanon", "#214697", 'assets/image/sarah.png')
// ];

const Spinner: React.FC = () => {
    const search = useSearchParams();
    const { fetchProgram, defaultProgram, loadingProgram } = useLoyaltyPrograms();
    const { getUserLoyaltyPrograms, loadingMyLoyaltyPrograms } = useAssets();
    const { play } = usePlayGame();
    const { fetchPrizes, isLoadingPrizes } = usePrize();
    const id = search.get('program_id')
    const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
    const [selectedPrizeId, setSelectedPrizeId] = useState<string>('')
    const [loyaltyProgramId, setLoyaltyProgramId] = useState<string>('')
    const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>()
    const { membership, fetchMembership } = useMemberShip(loyaltyProgram?.loyaltyCurrency?.id);
    const [myLoyaltyPrograms, setMyLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([])
    const { presentFailure, presentInfo } = useToast();
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string>();
    const { addListener } = useBlockchainContractExecution();
    const [prizesExpired, setPrizesExpired] = useState(false)
    const prizeInfo = "Spin now, list of prizes is reserved for 3 mins, if spinned after 3 mins the list of prizes might be different"
    const { walletAddress } = useDapp();

    const getMySelectedProgram = useMemo(() => {
        if (myLoyaltyPrograms.length !== 0 && !!loyaltyProgram) {
            return myLoyaltyPrograms.find((program) => program.currency.loyaltyCurrency === loyaltyProgram.loyaltyCurrency.id)
        }
        return
    }, [myLoyaltyPrograms, loyaltyProgram])

    const getSelectedPrize = useMemo(() => {
        return wheelSegments && wheelSegments.find(item => item.id === selectedPrizeId)
    }, [wheelSegments, selectedPrizeId])


    const { showModal: showSpinCondition } = useDialog({
        id: 'spinConditionModal',
        component: <SpinCondition
            cost={getMySelectedProgram?.redemption?.spinCost ? getMySelectedProgram?.redemption?.spinCost : 100}
            onSuccess={handlePlaying}
            dismiss={dismissSpinCondition} />
    });

    const { showModal: showSuccessModal } = useDialog({
        id: 'spinSuccessModal',
        component: <SpinSuccess
            dismiss={dismissSpinSuccess}
            text={`You just won ${getSelectedPrize?.text}`}
        />,
        onDismiss: () => {
            setIsPlaying(false);
            setError(undefined);
            setSelectedPrizeId('');
            getPrizes()
            fetchMembership();
        }
    });

    function dismissSpinCondition() {
        modalController.dismiss(null, undefined, "spinConditionModal");
    }

    function dismissSpinSuccess() {
        modalController.dismiss(null, undefined, "spinSuccessModal");
    }

    function getLoyaltyProgram() {
        fetchProgram(loyaltyProgramId ?? '')
            .then(program => {
                if (program) setLoyaltyProgram(program);
            })
    }

    function getPrizes() {
        if (!loyaltyProgram) return
        fetchPrizes(loyaltyProgram.brand?.key ?? '')
            .then(prizes => {
                if (prizes) {
                    setWheelSegments(prizes)
                    setPrizesExpired(false)
                    // wait for 3 minutes
                    setTimeout(() => setPrizesExpired(true), 180000);
                    presentInfo(prizeInfo)
                }
            })
    }

    function listenerCallBack(id: any, amount: any, playerAddress: string, gameToken: string) {
        // console.log("listening to event prizeSelected with id: ${0}, amount: ${1}, playerAddress: ${2}, gameToken: ${3}", id, amount, playerAddress, gameToken);
        console.log("listening to event prizeSelected with id:", id)
        if (playerAddress.toLocaleLowerCase() == walletAddress?.toLocaleLowerCase()) {
            setSelectedPrizeId(id)
        }
    }

    function getMyPrograms() {
        getUserLoyaltyPrograms()
            .then(programs => {
                if (defaultProgram) programs.push(defaultProgram)
                setMyLoyaltyPrograms(programs);
            })
    }

    async function handlePlaying() {
        setIsPlaying(true);
        if (prizesExpired) await getPrizes()
        const playingResult = await play(loyaltyProgram?.brand?.key ?? '', loyaltyProgram?.partnerId ?? '');
        if (!playingResult?.isSuccess || !playingResult.data) {
            setError('Server is busy, try again later')
            setIsPlaying(false);
            return;
        }
    }

    const programsOpts: ProgramSelectOption[] = useMemo(() => {
        if (myLoyaltyPrograms.length !== 0) {
            var programs = [...myLoyaltyPrograms]
            programs = programs.filter((program) => program.currency.isRedemption)
            return programs.map((loyaltyProgram) => {
                return new ProgramSelectOption(loyaltyProgram?.currency?.loyaltyCurrencyName, loyaltyProgram?.currency?.loyaltyCurrency, loyaltyProgram?.currency?.programLogo)
            })

        }
        return []
    }, [myLoyaltyPrograms])

    const prizesOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item) => {
                return new AccordionItemData(item.id, item.description, item.description, item.image as string)
            })
        }
        return []
    }, [wheelSegments])

    const wheelSegmentsOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item, index) => {
                if (index % 2) item.fillStyle = loyaltyProgram?.brand?.color2
                else item.fillStyle = loyaltyProgram?.brand?.color1
                return item
            })
        }
        return []
    }, [wheelSegments, loyaltyProgram])

    const handleSelectedValue = (name: string) => {
        const lp = myLoyaltyPrograms.find(item => item?.currency?.loyaltyCurrencyName === name)
        if (lp) setLoyaltyProgramId(lp?.currency?.programId)
    }

    useIonViewWillEnter(() => {
        addListener(
            appConfig.gozoGameContract,
            contractsAbi.game,
            'prizeSelected',
            listenerCallBack
        );

        id ? setLoyaltyProgramId(id) : setLoyaltyProgramId("");
    }, [id])

    useEffect(() => {
        getMyPrograms();
    }, [])

    useEffect(() => {
        getPrizes()
    }, [loyaltyProgram])

    useEffect(() => {
        getLoyaltyProgram()
    }, [loyaltyProgramId])

    useEffect(() => {
        if (error) {
            setIsPlaying(false)
            presentFailure(error)
            setError(undefined)
        }
    }, [error])

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar className={styles.headerToolbar}>
                    <div className='flex-row-container ion-padding-horizontal'>
                        <ProgramSelection
                            options={programsOpts}
                            selectedBalance={membership?.balance ?? 0}
                            selectedValue={loyaltyProgram?.loyaltyCurrency?.shortName ?? ''}
                            setSelectedValue={handleSelectedValue} />
                        <PrimaryButton
                            customStyles='flex-row-1'
                            onClick={showSpinCondition}
                            size='m'
                            disabled={isPlaying}>
                            spin!
                        </PrimaryButton>
                    </div>
                </IonToolbar>
            </IonHeader>
            <PrimaryContainer className={styles.accordionContent}>
                {(!loadingProgram && !isLoadingPrizes && !loadingMyLoyaltyPrograms) ?
                    <>
                        <div className={`${styles.wheelWrapper}`}>
                            {
                                isPlaying && !selectedPrizeId ?
                                    <div className={styles.loaderWrapper}>
                                        <ParticlesLoader />
                                        <PrimaryTypography
                                            customClassName={styles.loaderOverlay}>
                                            Please wait one moment while we are connecting with blockchain to activate the Spin wheel...
                                        </PrimaryTypography>
                                    </div>
                                    :
                                    <FortuneWheel
                                        logoAtCenter={loyaltyProgram?.brand?.logo}
                                        spinDuration={0.3} data={wheelSegmentsOpts}
                                        spin={isPlaying}
                                        selectedPrizeId={selectedPrizeId}
                                        onStopSpinning={() => {
                                            setTimeout(() => showSuccessModal(), 1000);
                                        }} />
                            }
                        </div>
                        <div className={styles.accordionHeaderwrapper}>
                            <PrimaryTypography
                                customClassName={styles.accordionHeader}
                                isBold
                                size='m'
                                color='light'>
                                Available Prizes
                            </PrimaryTypography>
                            <IonButtons>
                                <IonButton id="hover-trigger">
                                    <IonIcon color="light" icon={informationCircleOutline} />
                                </IonButton>
                            </IonButtons>
                            <PrimaryPopover id="hover-trigger" content={prizeInfo} />
                        </div>
                        <PrimaryAccordion accordionItemData={prizesOpts} />
                    </>
                    : <PageLoader />
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
