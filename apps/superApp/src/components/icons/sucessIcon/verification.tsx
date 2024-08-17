import React, { FC } from "react";
interface Icon {
    height: string;
    width: string;
    color: string;
}

const SuccessIcon: FC<Icon> = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.9165 30.2082L24.1665 37.4582L41.0832 20.5415" stroke="#52C41A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M29.0002 53.1668C42.3469 53.1668 53.1668 42.3469 53.1668 29.0002C53.1668 15.6533 42.3469 4.8335 29.0002 4.8335C15.6533 4.8335 4.8335 15.6533 4.8335 29.0002C4.8335 42.3469 15.6533 53.1668 29.0002 53.1668Z" stroke="#52C41A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}
export default SuccessIcon