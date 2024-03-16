import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm";
import * as apiClient from '../api/api-client'
import { useAppContext } from "../contexts/AppContext";
const AddHotel = () => {
    const { showToast } = useAppContext()
    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({ message: 'Hotel  added successfully', type: 'SUCCESS' })
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: 'ERROR' })
        }
    });

    const handlesave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    }

    return (
        <ManageHotelForm onSave={handlesave} isLoading={false} />
    )
}

export default AddHotel;