'use client'
import React, { FC, useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ContextData } from "@/components/context";
import RootLayout from '../../../layout'
import BudgetTable from "./components/table";
import Filter from "../../components/filters";
import SingleBudget from "./components/data";

interface Terminal {
    id: number;
    // Add other properties as needed
}

const PayoutBudgetDetails: FC = () => {
    const context = useContext(ContextData)
    const router: any = useRouter();
    const pathname = usePathname()
    const string = pathname
    const res = string.split("/")
    const [data, setData] = useState<Terminal | null>(null);
    const id = res[3]

    useEffect(() => {
        console.log("res", res);
        context?.setLinks(res[2]);
        console.log("id", id);
        if (id) {
            const terminal: Terminal | undefined = context?.terminals.find(
                (terminal: any) => terminal.id === parseInt(id as string)
            );
            if (terminal) {
                setData(terminal);
            }
        }
    }, [id, context?.terminals]);

    const [heights, setHeights] = useState<number>(0);
    const [dashTopHeight, setDashTopHeight] = useState<string>("");

    useEffect(() => {
        setHeights(window.innerHeight);
        setDashTopHeight(localStorage.getItem("dashTopHeight") || "");
    }, []);

    return (
        <RootLayout>
            <div className="pl-16 pr-5 mt-10">
                <SingleBudget />
                {/* filter */}
                <Filter />
                {/*  Table */}
                <BudgetTable />
            </div>
        </RootLayout>
    );
}

export default PayoutBudgetDetails;