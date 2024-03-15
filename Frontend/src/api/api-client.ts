import { Inputs2 } from "../pages/Register";
import { Inputs1 } from "../pages/Login";

const url = import.meta.env.API_BASE_URl || "";

export const register = async (formData: Inputs2) => {

    const response = await fetch(url + '/api/users/register', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json' // Correct syntax for the headers object
        },
        body: JSON.stringify(formData) // Convert formData to JSON format
    });

    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }

};

export const Login = async (formData: Inputs1) => {

    const response = await fetch(url + '/api/auth/login', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json' // Correct syntax for the headers object
        },
        body: JSON.stringify(formData) // Convert formData to JSON format
    });
    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }

};

export const getToken = async () => {
    const response = await fetch(url + "/api/auth/validate-token", {
        credentials: "include"
    })
    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const logout = async () => {
    const response = await fetch(url + "/api/auth/logout", {
        credentials: "include",
        method: "POST"
    })
    const responseBody = await response.json()
    console.log(response);

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}
