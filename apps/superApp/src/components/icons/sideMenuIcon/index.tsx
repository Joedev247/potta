import React, { FC } from "react";
interface Icon {
    height: string;
    width: string;
    color: string;
}

const AudienceIcon: FC<Icon> = ({ width, height, color }) => {
    return (
        <div className="h-screen bg-blue-600">

        </div>
    )
}
export default AudienceIcon