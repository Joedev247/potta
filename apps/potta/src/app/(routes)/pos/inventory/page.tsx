import React from "react";
import RootLayout from "../../layout";
import App from "./components/tabelComponent";
import Filter from "./components/filters";
import SlideOverInventory from "./components/slides";
import { Toaster } from "react-hot-toast";



const Files = () => {
    return (
        <RootLayout>
          <Toaster position="top-left" />
            <div className="pl-16 pr-5 w-full mt-10">
                <Filter />
                <App />
            </div>
        </RootLayout>
    )
}
export default Files
