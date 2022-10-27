import { IonPage, useIonViewWillEnter } from '@ionic/react'
import { useState } from 'react';
import PrimaryGrid from '../../components/grids/PrimaryGrid/PrimaryGrid';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import useReward from '../../hooks/useReward';
import { Reward } from '../../models/reward';
import PrimaryRewardGrid from './PrimaryRewardGrid/PrimaryRewardGrid';
import ReferralBanner from './ReferralBanner/ReferralBanner';

// const data = [
//     new Reward("test", "test", "test", "2022-12-12", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new Reward("test", "test", "test", "2022-12-12", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new Reward("test", "test", "test", "2022-12-12", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new Reward("test", "test", "test", "2022-12-12", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
//     new Reward("test", "test", "test", "2022-12-12", "https://currencyalliance-uploads.s3.amazonaws.com/partner/company-pictures/part_erihtzpqr00o7.jpg?AWSAccessKeyId=ASIA4TUXDFEVBG7MNT5F&Signature=wXyyuRr15OD%2FoP1Btgc088wnA4Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQD%2FGZCBKGoOAKNddvZhACwMsq%2Bhod5uwYKYH4fA655bawIgA0MlurBNSgxC0bqRBOOKK94MZzyTwFHy2MBR%2FIFP97wq1QQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4NjY4MjY1MjkwNjYiDB6Wl0LOZPbzT8px6CqpBOSVjbGgQ333Dkf2yZAGCJ9gt2Sox16IGdn9QlRuVo8zqSQuY%2FBSDmBqKTWO8DNyPgMJR1GCAY%2BSqyyiiRwbqmqxRorTGyJprP3FmvicSjdDRHEooEKOwkeOi%2BmEOj1wEI8rU7ylCKWBl0DSPDG7%2BSW7M6%2Fz75UvEDdRO%2BdypH3Yy4W7aN1C4w7t5fWNgvSK3AsVL4m8rffW0BHim87iCezDVBNj87msFE0N4nyjPVv7uTKJhP8oMIKwBf6BZalDn1cKggqjANawT0nGBv8YDvhrO06xBFpIb7YMW7pW9TbyNHQOO6mck1%2Fk7nco3aXuwaT%2FbizEsPlSAXI1YJ4S2Zp7RpRQWZx8dPQ71sycARxqpiWhPa%2Fv8iX8jk4W1tRUQa6GHP%2BzZrDHTu299nopXGeIIVLT%2FRlhyysY%2FZPGo72HG9gajVcEKmPffyEgfogArqWspdZnBkwnmZuSRHHYZSgCL3E0MliAgjQkmudLLfcxBttE%2FG1W56Ub4PeKsOES2EeKh%2F96XOFy4baCS7nCXJ96eynmJYiOHFl9HuaGaRinSlWX5CY0jR6DlVpmBZ0RTUW3cKdMGA9LucOf2Ub%2BkYEpNukAAv7xoNe%2BJGKySVmp%2BEksmSjeKEfl%2FzcOKOhMejtM1%2F%2FjEVdIgK6L2bwLBpdj%2F1v5We4KNUPRiUMMW%2B5NNFzpfNJ6B7xQW1kg2xMaOV52KelsR4%2BsQcFaQBzp%2Fnvu6CMvIeDfVMAwgpmlmgY6qQHQrq6e5VxmmHYfu2mlNwqwlhcSkGdnS%2FtktmD4iDVdLoWNko5ygnL5SEuC6XOsqbZm0VyVsclqxQ4xBN7WuBB9wgP5M6hrs0gJmES7JhvFyGmA5k%2FHiuw1%2B5qfReCH4bpKxsGmObf2qU3oLGLEPzltPh%2Bne3QRQ84Ug9%2F5jGrU6FLI6Kkx%2B6lfnatUxxIRV7REGe5KXQaDj43od9n5PGneCH5hKa%2F%2FsGNk&Expires=1666358318"),
// ]

const Rewards: React.FC = () => {
    const [rewards, setRewards] = useState<Reward[]>([])
    const { fetchRewards, isLoadingRewards } = useReward()

    function getRewards() {
        fetchRewards().then(rewards => {
            if (rewards) setRewards(rewards)
        })
    }

    useIonViewWillEnter(() => {
        getRewards()
    }, [])
    return (
        <IonPage>
            <TertiaryHeader title='Rewards' className='ion-text-center' />
            <PrimaryContainer className='ion-text-center'>
                <ReferralBanner />
                {!isLoadingRewards ? <PrimaryRewardGrid
                    headers={['Reward', 'Description', 'Date']}
                    data={rewards}
                /> :
                    <PageLoader />}
            </PrimaryContainer>
        </IonPage>
    )
}

export default Rewards