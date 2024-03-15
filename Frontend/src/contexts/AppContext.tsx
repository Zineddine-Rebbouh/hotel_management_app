import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api/api-client'

type ToastMessage = {
    message: string, // Change String to string
    type: "SUCCESS" | "ERROR" // Correct typo in "SUCCESS"
}

type AppContextType = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean
}

const AppContext = createContext<undefined | AppContextType>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => { // Correct typo in "AppContextProvider"
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
    const { isError } = useQuery("VALIDATETOKEN", apiClient.getToken, { retry: false })
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => { setToast(toastMessage) } // Remove extra colon after showToast
            ,
            isLoggedIn: !isError
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => { setToast(undefined) }}></Toast>}
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)!; // Add a type assertion or null check to context
    return context as AppContextType; // Return context as AppContextType
}
