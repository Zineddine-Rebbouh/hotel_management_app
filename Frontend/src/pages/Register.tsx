import { useForm } from "react-hook-form"
import * as apiClient from '../api/api-client'
import { useMutation, useQueryClient } from "react-query"
import { useAppContext } from "../contexts/AppContext"
import { Link, useNavigate } from "react-router-dom"
export type Inputs2 = {
    firstname: string
    lastname: string
    email: string
    password: string
    confirmPassword: string
}

const Register = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const { showToast } = useAppContext()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs2>()

    const mutation = useMutation(apiClient.register, {
        onError: (error: Error) => {
            console.log(error.message);
            showToast({ message: error.message, type: "ERROR" })
        }
        , onSuccess: async () => {
            console.log('register success');
            await queryClient.invalidateQueries("VALIDATETOKEN")
            showToast({ message: "Registration Success", type: "SUCCESS" })
            navigate("/")
        },
    })
    const onSubmit = handleSubmit((data) => mutation.mutate(data));
    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-5'>
            <h2 className='text-3xl font-bold '>Create an Account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="rounded w-full py-1 border px-2 font-normal" {...register('firstname', { required: 'This field is Required ' })} type="text" name="firstname" id="firstname" />
                    {errors.firstname && <span className="text-red-500">{errors.firstname.message}</span>}
                </label>
                <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="rounded w-full py-1 border px-2 font-normal" {...register('lastname', { required: 'This field is Required ' })} type="text" name="lastname" id="lastname" />
                    {errors.lastname &&
                        <span className="text-red-500">{errors.lastname.message}</span>}
                </label>
            </div>
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input className="rounded w-full py-1 border px-2 font-normal" {...register('email', { required: 'This field is Required ' })} type="text" name="email" id="email" />
                {errors.email &&
                    <span className="text-red-500">{errors.email.message}</span>}
            </label>
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                Passowrd
                <input className="rounded w-full py-1 border px-2 font-normal" {...register('password', { required: 'This field is Required ', minLength: { value: 6, message: 'Passowrd should contain 6 caraceters at least' } })} type="password" name="password" id="password" />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}

            </label>
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                Confirm Passowrd
                <input className="rounded w-full py-1 border px-2 font-normal" {...register('confirmPassword', {
                    validate: (val) => {
                        if (!val) {
                            return "This field is Required  "
                        } else if (watch("password") !== val) {
                            return 'Passwords do not match'
                        }
                    }
                })} type="password" name="confirmPassword" id="confirmPassword" />
                {errors.confirmPassword &&
                    <span className="text-red-500">{errors.confirmPassword.message}</span>}
            </label>
            {/* <form onSubmit={handleSubmit(onSubmit)}>
            </form> */}
            <span className="flex justify-between items-center">
                <span className="">Already have Account ? <Link className="underline font-semibold" to={"/sign-in"}>Sign in</Link></span>
                <button type="submit" className="bg-blue-600 w-40 text-white p-2 font-bold hover:bg-blue-500 text-xl"> Create Account </button>
            </span>
        </form>
    )
}

export default Register
