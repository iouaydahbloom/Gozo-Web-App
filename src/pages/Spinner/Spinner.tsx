import { IonHeader, IonPage, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
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

const options: any = [
    { name: 'Air France Loyalty Program', balance: '400', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
    { name: 'Air France Loyalty', balance: '500', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
    { name: 'Air France', balance: '600', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
    { name: 'Air', balance: '700', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
    { name: 'Ai', balance: '800', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" },
    { name: 'A', balance: '900', icon: "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318" }
]

const prizes: AccordionItemData[] = [
    new AccordionItemData("test", "test", "test", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
    new AccordionItemData("test1", "test1", "test1", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
    new AccordionItemData("test2", "test2", "test2", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
    new AccordionItemData("test3", "test3", "test3", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
    new AccordionItemData("test4", "test4", "test4", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
    new AccordionItemData("test5", "test5", "test5", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
    new AccordionItemData("test6", "test6", "test6", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
]

const data: WheelSegment[] = [
    new WheelSegment("United kingdom", "United kingdom", "#95181B"),
    new WheelSegment("United States", "United States", "#214697", 'assets/image/sarah.png'),
    new WheelSegment("France", "France", "#95181B"),
    new WheelSegment("Germany", "Germany", "#214697", 'assets/image/sarah.png'),
    new WheelSegment("Spain", "Spain", "#95181B"),
    new WheelSegment("China", "China", "#214697", 'assets/image/sarah.png'),
    new WheelSegment("Portugal", "Portugal", "#95181B"),
    new WheelSegment("Lebanon", "Lebanon", "#214697", 'assets/image/sarah.png')
];

const Spinner: React.FC = () => {
    const search = useSearchParams();
    const { fetchProgram, defaultProgram, loadingProgram } = useLoyaltyPrograms();
    const { getUserLoyaltyPrograms, loadingMyLoyaltyPrograms } = useAssets();
    const { play, isPlaying, setIsPlaying, errorInSpin, setErrorInSpin } = usePlayGame();
    const { fetchPrizes, isLoadingPrizes } = usePrize();
    const id = search.get('program_id')
    const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
    const [spinWheel, setSpinWheel] = useState(false);
    const [selectedPrizeId, setSelectedPrizeId] = useState<string>('')
    const [loyaltyProgramId, setLoyaltyProgramId] = useState<string>()
    const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>({} as LoyaltyProgram)
    const { membership, fetchMembership } = useMemberShip(loyaltyProgram?.loyaltyCurrency?.id);
    const [myLoyaltyPrograms, setMyLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([])
    const { presentFailure } = useToast();

    const { addListener } = useBlockchainContractExecution();

    const getMySelectedProgram = useMemo(() => { 
        if (myLoyaltyPrograms.length !== 0 && Object.keys(loyaltyProgram).length !== 0) {
            return myLoyaltyPrograms.find((program) => program.currency.loyaltyCurrency === loyaltyProgram.loyaltyCurrency.id)
        }
        return
    }, [myLoyaltyPrograms, loyaltyProgram])

    const { showModal: showSpinCondition } = useDialog({
        id: 'spinConditionModal',
        component: <SpinCondition cost={getMySelectedProgram?.redemption?.spinCost ? getMySelectedProgram?.redemption?.spinCost : 100} setSpinWheel={setSpinWheel} dismiss={dismissSpinCondition} />
    });

    const { showModal: showSuccessModal } = useDialog({
        id: 'spinSuccessModal',
        component: <SpinSuccess dismiss={dismissSpinSuccess} text={`You just won ${getSelectedPrize()?.text}`} />,
        onDismiss: () => {
            setSpinWheel(false)
            setIsPlaying(false)
            fetchMembership()
        }
    });

    function dismissSpinCondition() {
        modalController.dismiss(null, undefined, "spinConditionModal");
    }

    function dismissSpinSuccess() {
        modalController.dismiss(null, undefined, "spinSuccessModal");
    }

    const handleSpinClick = () => {
        showSpinCondition()
    }

    const handleStopWheelSpinning = () => {
        showSuccessModal()
    }

    function getLoyaltyProgram() {
        fetchProgram(loyaltyProgramId ?? '')
            .then(program => {
                if (program) setLoyaltyProgram(program);
            })
    }

    function getPrizes() {
        if (Object.keys(loyaltyProgram).length === 0) return
        fetchPrizes(loyaltyProgram?.brand?.name ?? '')
            .then(prizes => {
                if (prizes) setWheelSegments(prizes)
            })
    }

    function listenerCallBack(id: any) {
        console.log("listening to event id =", id)
        // add condition that checks if the event belongs to the desired player_address
        // if(result.player_address === walletAddress) setSelectedPrizeId(id)
        // else console.log("error")
        setSelectedPrizeId(id)
    }

    function getSelectedPrize() {
        return wheelSegments.find(item => item.id === selectedPrizeId)
    }

    function getMyPrograms() {
        getUserLoyaltyPrograms()
            .then(programs => {
                if (defaultProgram) programs.push(defaultProgram)
                setMyLoyaltyPrograms(programs);
            })
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
                return new AccordionItemData(item.id, item.text, item.text, item.image as string)
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

    function releaseListener() {
        if(!selectedPrizeId) {
            console.log("entered")
            setErrorInSpin(true)
            presentFailure("Unknown Error")
        } else {
            setSelectedPrizeId('')
        }
    }

    useIonViewDidEnter(() => {
        if (id) {
            setLoyaltyProgramId(id)
        } else {
            setLoyaltyProgramId("")
        }
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
      if(errorInSpin) {
        setSpinWheel(false)
        setErrorInSpin(false)
      }
    }, [errorInSpin])
    

    useEffect(() => {
        if (spinWheel && (Object.keys(loyaltyProgram).length !== 0)) {
            addListener(appConfig.gozoGameContract, contractsAbi.game, 'prizeSelected', listenerCallBack)
            play(loyaltyProgram?.brand?.key ?? '')
            setTimeout(releaseListener, 50000);
        }
    }, [spinWheel])

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar className={styles.headerToolbar}>
                    <div className='flex-row-container ion-padding-horizontal'>
                        <ProgramSelection options={programsOpts} selectedBalance={membership?.balance ?? 0} selectedValue={loyaltyProgram?.loyaltyCurrency?.shortName} setSelectedValue={handleSelectedValue} />
                        <PrimaryButton
                            customStyles='flex-row-1'
                            onClick={handleSpinClick}
                            size='m'
                            disabled={spinWheel}
                        >
                            spin!
                        </PrimaryButton>
                    </div>
                </IonToolbar>
            </IonHeader>
            <PrimaryContainer className={styles.accordionContent}>
                {(!loadingProgram && !isLoadingPrizes && !loadingMyLoyaltyPrograms) ?
                    <>
                        <div className={`${styles.wheelWrapper}`}>
                            {spinWheel && !selectedPrizeId ?
                                <div className={styles.loaderWrapper}>
                                    <ParticlesLoader />
                                    <PrimaryTypography customClassName={styles.loaderOverlay}>Please wait one moment while we are connecting with blockchain to activate the Spin wheel...</PrimaryTypography>
                                </div>

                                :
                                <FortuneWheel logoAtCenter={loyaltyProgram?.brand?.logo} spinDuration={0.3} data={wheelSegmentsOpts} spin={spinWheel} selectedPrizeId={selectedPrizeId} onStopSpinning={handleStopWheelSpinning} />
                            }
                        </div>
                        <PrimaryTypography customClassName={styles.accordionHeader} isBold size='m' color='light'>Available Prizes</PrimaryTypography>
                        <PrimaryAccordion accordionItemData={prizesOpts} />
                    </>
                    : <PageLoader />
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
