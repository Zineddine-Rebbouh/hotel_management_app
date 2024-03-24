import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api/api-client';
import { loadStripe, Stripe } from "@stripe/stripe-js";


const STRIPE_PUB_KEY = "pk_test_51OxLiTIO9Wp11eFfd5zKaBARhVANMOEwZL3R2E5MCpyjvO0FDnyx0CNlYJQOX6VYotxfrwXyXAYcqSlNT7HU1sGF00zKYWsxAP"
type ToastMessage = {
    message: string, // Change String to string
    type: "SUCCESS" | "ERROR" // Correct typo in "SUCCESS"
}

type AppContextType = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean
    stripePromise: Promise<Stripe | null>
}

const AppContext = createContext<undefined | AppContextType>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY)


export const AppContextProvider = ({ children }: { children: React.ReactNode }) => { // Correct typo in "AppContextProvider"
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
    const { isError } = useQuery("VALIDATETOKEN", apiClient.getToken, { retry: false })
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => { setToast(toastMessage) } // Remove extra colon after showToast
            ,
            isLoggedIn: !isError,
            stripePromise
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
