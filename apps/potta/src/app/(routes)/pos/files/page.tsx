import React from "react";
import RootLayout from "../../layout";
import Filter from "./components/filter";
import CardFile from "./components/cardFiles";
import RecentUpload from "./components/recentUpload";

const Files = () => {
    return (
        <RootLayout>
            <div className="pl-16 pr-5 flex w-full mt-10">
                <div className="w-[80%]">
                    <Filter />
                    <div className="mt-5">
                        <CardFile />
                    </div>
                </div>
                <div className="w-[20%]">
                    <RecentUpload />
                </div>
            </div>
        </RootLayout>
    )
}
export default Files