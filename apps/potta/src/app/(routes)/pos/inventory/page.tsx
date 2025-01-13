import React from "react";
import RootLayout from "../../layout";
import App from "./components/tabelComponent";
import Filter from "../../expenses/components/filters";
import SlideOverInventory from "./components/slides";



const Files = () => {
    return (
        <RootLayout>
            <div className="pl-16 pr-5 w-full mt-10">
                <Filter />
                <SlideOverInventory />
                <App />
            </div>
        </RootLayout>
    )
}
export default Files