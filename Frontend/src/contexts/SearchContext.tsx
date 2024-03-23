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
    const [destination, setDestination] = useState<string>(() => sessionStorage.getItem("destination") || '');
    const [checkIn, setcheckIn] = useState<Date>(() => {
        const storedCheckIn = sessionStorage.getItem("checkIn");
        return storedCheckIn ? new Date(storedCheckIn) : new Date();
    });
    const [checkOut, setcheckOut] = useState<Date>(() => {
        const storedCheckOut = sessionStorage.getItem("checkOut");
        return storedCheckOut ? new Date(storedCheckOut) : new Date();
    });
    const [adultCount, setadultCount] = useState<number>(() => {
        const storedAdultCount = sessionStorage.getItem("adultCount");
        return storedAdultCount ? parseInt(storedAdultCount) : 0;
    });
    const [childCount, setchildCount] = useState<number>(() => {
        const storedChildCount = sessionStorage.getItem("childCount");
        return storedChildCount ? parseInt(storedChildCount) : 0;
    });
    const [hotelId, sethotelId] = useState<string>(() => sessionStorage.getItem("hotelId") || '');



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
            sessionStorage.setItem("destination", destination);
            sessionStorage.setItem("checkIn", checkIn.toISOString());
            sessionStorage.setItem("checkOut", checkOut.toISOString());
            sessionStorage.setItem("adultCount", adultCount.toString());
            sessionStorage.setItem("childCount", childCount.toString());
            if (hotelId) {
                sessionStorage.setItem("hotelId", hotelId);
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