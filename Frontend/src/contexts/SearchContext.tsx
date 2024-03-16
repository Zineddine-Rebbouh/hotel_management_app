import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId: string,
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCout: number,
        childCount: number,
        hotelId?: string,
    ) => void;
}

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
    children: React.ReactNode;
};

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {

    const [destination, setDestination] = useState<string>("");
    const [checkIn, setcheckIn] = useState<Date>(new Date());
    const [checkOut, setcheckOut] = useState<Date>(new Date());
    const [adultCount, setadultCount] = useState<number>(1);
    const [childCount, setchildCount] = useState<number>(1);
    const [hotelId, sethotelId] = useState<string>("");

    const saveSearchValues =
        (
            destination: string,
            checkIn: Date,
            checkOut: Date,
            adultCount: number,
            childCount: number,
            hotelId?: string
        ) => {
            setDestination(destination)
            setadultCount(adultCount)
            setcheckIn(checkIn)
            setcheckOut(checkOut)
            setchildCount(childCount)
            if (hotelId) {
                sethotelId(hotelId)
            }
        }

    return (
        <SearchContext.Provider value={{
            destination, hotelId, saveSearchValues, childCount, checkIn, adultCount, checkOut,
        }}>
            {children}
        </SearchContext.Provider >
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext
}