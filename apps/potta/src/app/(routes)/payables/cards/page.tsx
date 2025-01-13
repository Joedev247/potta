'use client'
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import CustomPopover from "@/components/popover";
import Search from "@/components/search";
import RootLayout from "../../layout";

interface CardProps { }

const Card: FC<CardProps> = () => {
    const [heights, setHeights] = useState<string>("");
    const [dashTopHeight, setDashTopHeight] = useState<string>("");

    const [allCards, setAllCards] = useState<boolean>(true);
    const [physicalCards, setPhysicalCards] = useState<boolean>(false);
    const [virtualCards, setVirtualCards] = useState<boolean>(false);
    const [debitCards, setDebitCards] = useState<boolean>(false);
    const [creditCards, setCreditCards] = useState<boolean>(false);

    const [listView, setListView] = useState<boolean>(true);
    const [gridView, setGridView] = useState<boolean>(false);

    useEffect(() => {
        setHeights(window.innerHeight.toString());
        setDashTopHeight(localStorage.getItem("dashTopHeight") || "");
    }, []);

    const HandleCardFilterChange = (cardFilter: string) => {
        setAllCards(cardFilter === "All");
        setPhysicalCards(cardFilter === "Physical");
        setVirtualCards(cardFilter === "Virtual");
        setDebitCards(cardFilter === "Debit");
        setCreditCards(cardFilter === "Credit");
    };

    const cards: Array<{
        id: number;
        cardHolder: string;
        issuer: string;
        issuerUrl: string;
        issuerUrl2: string;
        isPhysical: boolean;
        isDebit: boolean;
        cardNumber: string;
        valid: string;
        cardBalance: string;
        cardCurrency: string;
        blockedAmount: string;
        status: string;
    }> = [
            {
                id: 1,
                cardHolder: "Vrain Tyson",
                issuer: "visa",
                issuerUrl: "/images/Visa.svg",
                issuerUrl2: "/images/VisaR.svg",
                isPhysical: true,
                isDebit: true,
                cardNumber: "8520152224896610",
                valid: "03/18",
                cardBalance: "88.200,00",
                cardCurrency: "$",
                blockedAmount: "1.200,00",
                status: "Active",
            },
            // Add other card objects here
        ];

    const [searchCardHolder, setSearchCardHolder] = useState<string>("");

    const filteredCards = cards.filter((card) => {
        if (allCards) {
            return card.cardNumber && card.cardHolder.toLowerCase().includes(searchCardHolder.toLowerCase());
        } else if (physicalCards) {
            return card.isPhysical && card.cardHolder.toLowerCase().includes(searchCardHolder.toLowerCase());
        } else if (virtualCards) {
            return !card.isPhysical && card.cardHolder.toLowerCase().includes(searchCardHolder.toLowerCase());
        } else if (debitCards) {
            return card.isDebit && card.cardHolder.toLowerCase().includes(searchCardHolder.toLowerCase());
        } else if (creditCards) {
            return !card.isDebit && card.cardHolder.toLowerCase().includes(searchCardHolder.toLowerCase());
        }
    });

    const [dataIsSorted, setDataIsSorted] = useState<boolean>(false);

    const filteredCards2 = dataIsSorted ? filteredCards.reverse() : filteredCards;

    return (
        <RootLayout>
            <div style={{ height: parseInt(heights) - parseInt(dashTopHeight) - 20 }} className=" pl-16 pr-5 mt-10 flex flex-col">

                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl sm:text-5xl font-bold">$120,420.50</h1>
                        <h1 className="text-gray-400 text-sm">Today balance from all accounts <span className="font-semibold text-blue-800">USD</span></h1>
                    </div>
                </div>
                <div className="flex justify-between mt-5">
                    <div className="flex  space-x-3 w-[50%]">
                        <div className=" w-full  ">
                            <Search />
                        </div>
                        <div title="Sort" onClick={() => { setDataIsSorted(!dataIsSorted) }} className="flex h-12 mt-4 border   cursor-pointer py-1.5 px-2">
                            <i className={`${dataIsSorted ? "ri-sort-asc" : "ri-sort-desc"} text-2xl`}></i>
                        </div>
                        <div className="mt-4">
                            <CustomPopover>
                                <div className="flex gap-4 bg-gray-100 mt-7  px-3 py-1">
                                    <div
                                        onClick={() => HandleCardFilterChange("All")}
                                        className={`flex text-center  py-1.5 cursor-pointer px-4 text-xs sm:text-base ${allCards ? "bg-black text-white" : "text-black pr-4"}`}>All</div>
                                    <div
                                        onClick={() => HandleCardFilterChange("Physical")}
                                        className={`flex text-center  py-1.5 cursor-pointer px-4 text-xs sm:text-base ${physicalCards ? "bg-black text-white" : "text-black px-4"}`}>Physical</div>
                                    <div
                                        onClick={() => HandleCardFilterChange("Virtual")}
                                        className={`flex text-center  py-1.5 cursor-pointer px-4 text-xs sm:text-base ${virtualCards ? "bg-black text-white" : "text-black px-4"}`}>Virtual</div>
                                    <div
                                        onClick={() => HandleCardFilterChange("Debit")}
                                        className={`flex text-center  py-1.5 cursor-pointer px-4 text-xs sm:text-base ${debitCards ? "bg-black text-white" : "text-black px-4"}`}>Debit</div>
                                    <div
                                        onClick={() => HandleCardFilterChange("Credit")}
                                        className={`flex text-center  py-1.5 cursor-pointer px-4 text-xs sm:text-base ${creditCards ? "bg-black text-white" : "text-black px-4"}`}>Credit</div>
                                </div>
                            </CustomPopover>
                        </div>

                    </div>


                    <div className="flex items-center gap-3">
                        <div className="sm:flex divide-x border  hidden h-12 cursor-pointer">
                            <div
                                onClick={(e) => {
                                    setListView(true)
                                    setGridView(false)
                                }}
                                className={`flex px-4   items-center justify-evenly ${listView ? "bg-gray-100" : "bg-white"}`}>
                                <i className="ri-list-check text-lg"></i>
                            </div>
                            <div
                                onClick={(e) => {
                                    setListView(false)
                                    setGridView(true)
                                }}
                                className={`flex px-4  items-center justify-evenly ${gridView ? "bg-gray-100" : "bg-white"}`}>
                                <i className="ri-layout-grid-line text-lg"></i>
                            </div>
                        </div>
                        <Link href={`/sidebar/card/newCard/`}>
                            <div className="flex justify-end items-center gap-2 cursor-pointer text-white bg-[#154406]  py-2.5 px-6">
                                <i className="ri-add-circle-line"></i>
                                Add new card
                            </div>
                        </Link>
                    </div>

                </div>

                <div className={`hidden ${listView ? "sm:block" : "hidden"} pb-5`}>

                    <div className={`flex flex-col `}>
                        <div className="flex flex-col mt-5">
                            <h1 className="text-gray-400 text-sm">{allCards ? ("All") : physicalCards ? ("Physical") : virtualCards ? ("Virtual") : debitCards ? ("Debit") : creditCards ? ("Credit") : ""} cards</h1>
                            <div className="flex flex-col gap-3 mt-3">
                                {filteredCards2.map((card, index) => (
                                    <Link href={`/sidebar/card/detail/${card.id}`}>
                                        <div key={index} className="flex justify-between border  px-7 py-3">
                                            <div className="flex items-center gap-6">
                                                <div className="h-6 w-6 flex justify-evenly items-center rounded-full ">
                                                    <img src={card.issuerUrl2} alt="" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h1 className="font-bold text-sm">{card.cardNumber.slice(0, 4)} **** **** {card.cardNumber.slice(12)}</h1>
                                                    <h1 className="text-gray-400 text-sm">Card number</h1>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h1 className="font-bold text-sm">{card.valid}</h1>
                                                <h1 className="text-gray-400 text-sm">Valid</h1>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h1 className="font-bold text-sm">{card.cardCurrency}{card.cardBalance}</h1>
                                                <h1 className="text-gray-400 text-sm">Card balance</h1>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h1 className="font-bold text-sm">{card.cardCurrency}{card.blockedAmount}</h1>
                                                <h1 className="text-gray-400 text-sm">Blocked amount</h1>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className={`py-1.5 w-24 text-center  font-medium text-md ${card.status == "Active" ? ("bg-green-100 text-green-400") : card.status == "On Hold" ? ("bg-indigo-100 text-indigo-400") : card.status == "Expired" ? ("bg-orange-100 text-orange-400") : ""}`}>
                                                    {card.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1 justify-center cursor-pointer">
                                                <i className="ri-more-line text-xl"></i>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className={`p-4 w-full mt-8 flex justify-evenly items-center ${filteredCards.length < 1 ? "" : "hidden"}`}>
                            <h1 className="font-medium text-xl">Sorry, No data</h1>
                        </div>
                    </div>
                </div>
                <div className={`block ${gridView ? "" : "block sm:hidden"} pb-5`}>
                    <div className="grid grid-cols-1 gap-6 mt-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredCards2.map((card, index) => (
                            <Link href={`/sidebar/card/detail/${card.id}`}>
                                <div key={index} className="flex flex-col justify-between border  px-4 py-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="font-bold text-sm">Card number</h1>
                                            <h1 className="text-gray-400 text-sm">{card.cardNumber.slice(0, 4)} **** **** {card.cardNumber.slice(12)}</h1>
                                        </div>
                                        <div className="">
                                            <img src={card.issuerUrl} alt={card.cardNumber} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-8">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="font-bold text-3xl">{card.cardCurrency}{card.cardBalance}</h1>
                                            <h1 className="text-gray-400 text-sm">Blocked amount {card.cardCurrency}{card.blockedAmount}</h1>
                                        </div>
                                        <div className="">
                                            <h1 className="font-bold text-sm">{card.valid}</h1>
                                            <h1 className="text-gray-400 text-sm">Valid</h1>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
};

export default Card;