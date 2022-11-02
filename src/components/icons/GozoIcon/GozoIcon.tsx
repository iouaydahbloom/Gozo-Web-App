import { memo } from "react";

const GozoIconComponent: React.FC = () => {
    return (
        <img src='assets/icon/Gozo logo.svg' />
    )
}

const GozoIcon = memo(GozoIconComponent);
export default GozoIcon;