'use client'
import React, { createContext, ReactNode, useState } from 'react';
import { accountList, allBranches, allUsers, payoutsList, TerminalList } from '../app/arrays/usecontextData';

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    price: number;
    tax: number;
}

interface ContextType {
    toggle: boolean;
    setToggle: (toggle: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (sidebarOpen: boolean) => void;
    link: string;
    setLinks: (link: string) => void;
    programs: any;
    setPrograms: (programs: any) => void;
    programDays: any;
    setProgramDays: (programDays: any) => void;
    isCashBack: boolean;
    setIsCashBack: (isCashBack: boolean) => void;
    isLoyaltyPoints: boolean;
    setIsLoyaltyPoints: (isLoyaltyPoints: boolean) => void;
    terminals: any;
    setTerminals: (terminals: any) => void;
    accounts: any;
    setAccounts: (accounts: any) => void;
    branches: any;
    setBranches: (branches: any) => void;
    users: any;
    setUsers: (users: any) => void;
    payouts: any;
    setPayouts: (payouts: any) => void;
    isDiscounts: boolean;
    setIsDiscounts: (isDiscounts: boolean) => void;
    isGiftCards: boolean;
    setIsGiftCards: (isGiftCards: boolean) => void;
    dateRangeValue: {
        startDate: Date | null;
        endDate: Date | null;
    };
    setDateRangeValue: (value: { startDate: Date | null; endDate: Date | null }) => void;
    invoiceItems: InvoiceItem[];
    setInvoiceItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
}

const ContextData = createContext<ContextType | null>(null);

interface Children {
    children: ReactNode;
}

const DataProvider: React.FC<Children> = ({ children }) => {
    const [toggle, setToggle] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [link, setLinks] = useState<string>('');
    const [programs, setPrograms] = useState<any>([]);
    const [programDays, setProgramDays] = useState<any>([]);
    const [isCashBack, setIsCashBack] = useState<boolean>(true);
    const [isLoyaltyPoints, setIsLoyaltyPoints] = useState<boolean>(false);
    const [isDiscounts, setIsDiscounts] = useState<boolean>(false);
    const [isGiftCards, setIsGiftCards] = useState<boolean>(false);
    const [terminals, setTerminals] = useState(TerminalList);
    const [accounts, setAccounts] = useState(accountList);
    const [branches, setBranches] = useState(allBranches);
    const [users, setUsers] = useState(allUsers);
    const [payouts, setPayouts] = useState(payoutsList);

    const [dateRangeValue, setDateRangeValue] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null,
    });

    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
        {
            id: 1,
            description: '',
            quantity: 0,
            price: 0,
            tax: 0,
        },
    ]);

    return (
        <ContextData.Provider value={{
            toggle,
            setToggle,
            sidebarOpen,
            setSidebarOpen,
            link,
            setLinks,
            programs,
            setPrograms,
            programDays,
            setProgramDays,
            isCashBack,
            setIsCashBack,
            isLoyaltyPoints,
            setIsLoyaltyPoints,
            terminals,
            setTerminals,
            accounts,
            setAccounts,
            branches,
            setBranches,
            users,
            setUsers,
            payouts,
            setPayouts,
            dateRangeValue,
            setDateRangeValue,
            invoiceItems,
            setInvoiceItems,
            isDiscounts,
            setIsDiscounts,
            isGiftCards,
            setIsGiftCards
        }}>
            {children}
        </ContextData.Provider>
    );
};

export { ContextData, DataProvider };