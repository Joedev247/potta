import React from "react";
import TestimonialSlider from "../TestimonialSlider";

const SideMenu = () => {
    return (
        <div className="h-screen w-full flex justify-center items-center" style={{ background: `url('icons/bg.svg')`, backgroundPosition: 'center center', backgroundSize: 'cover' }}>
            <TestimonialSlider />
        </div>
    )
}
export default SideMenu