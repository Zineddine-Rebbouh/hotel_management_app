import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"

const GuestsSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>()
    return (
        <div className="flex-1">
            <h2 className='text-3xl font-bold mb-4'>Guests</h2>
            <div className="flex gap-4 bg-gray-300 px-8 py-6">
                <label className="text-gray-700 font-bold flex-1">
                    Adults
                    <input
                        type="number"
                        className="border rounded w-full py-1 px-2 font-normal"
                        min={1}
                        {...register("adultCount", { required: "This field is required" })}
                    ></input>
                    {errors.adultCount && (
                        <span className="text-red-500">{errors.adultCount.message}</span>
                    )}
                </label>
                <label className="text-gray-700  font-bold flex-1">
                    Children
                    <input
                        type="number"
                        className="border rounded w-full py-1 px-2 font-normal"
                        min={0}
                        {...register("childCount", { required: "This field is required" })}
                    ></input>
                    {errors.childCount && (
                        <span className="text-red-500">{errors.childCount.message}</span>
                    )}
                </label>
            </div>
        </div>
    )
}

export default GuestsSection
