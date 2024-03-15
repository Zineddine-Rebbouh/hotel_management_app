import { useMutation, useQueryClient } from "react-query"
import * as apiClient from '../api/api-client'
import { useAppContext } from "../contexts/AppContext"
import { useNavigate } from "react-router-dom"

const SignOutButtom = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const { showToast } = useAppContext()
    const mutation = useMutation(apiClient.logout, {
        onSuccess: async () => {
            console.log('Signout success');
            await queryClient.invalidateQueries("VALIDATETOKEN")
            showToast({ message: "Sign Out !", type: "SUCCESS" })
            navigate("/sign-in")
        },
        onError: (error: Error) => {
            console.log('Signout failed');
            showToast({ message: error.message, type: "ERROR" })
        }
    })

    const handleClick = () => {
        mutation.mutate()
    }
    return (
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">
            Sign Out
        </button>
    )
}

export default SignOutButtom
