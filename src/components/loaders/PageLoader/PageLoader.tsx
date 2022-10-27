import SectionLoader from "../section-loader/SectionLoader";
import styles from './pageLoader.module.scss';

interface IProps {
    text?: string
}

const PageLoader: React.FC<IProps> = ({ text }) => {
    return (
        <div className='middle-screen-content'>
            <SectionLoader text={text} />
        </div>
    )
}

export default PageLoader