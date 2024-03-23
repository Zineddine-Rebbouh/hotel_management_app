import { useForm } from "react-hook-form"
import * as apiClient from '../api/api-client'
import { useMutation, useQueryClient } from "react-query"
import { useAppContext } from "../contexts/AppContext"
import { Link, useLocation, useNavigate } from "react-router-dom"


export type Inputs1 = {
    email: string
    password: string
}

const Login = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const location = useLocation();

    const { showToast } = useAppContext()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs1>()

    const mutation = useMutation(apiClient.Login, {
        onError: (error: Error) => {
            console.log(error.message);
            showToast({ message: error.message, type: "ERROR" })
        }
        ,
        onSuccess: async () => {
            console.log('SignIn success');
            await queryClient.invalidateQueries("VALIDATETOKEN")
            showToast({ message: "SignIn Success !", type: "SUCCESS" })
            navigate(location.state?.from?.pathname || "/");
        }
    })
    const onSubmit = handleSubmit((data) => mutation.mutate(data));
    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-5'>
            <h2 className='text-3xl font-bold '>Sign In</h2>
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
            {/* <form onSubmit={handleSubmit(onSubmit)}>
            </form> */}
            <span className="flex justify-between items-center">
                <span className="">Already have Account ? <Link className="underline font-semibold" to={"/sign-up"}>Sign in</Link></span>
                <button type="submit" className="bg-blue-600 w-40 text-white p-2 font-bold hover:bg-blue-500 text-xl"> Sign In </button>
            </span>
        </form>
    )
}

export default Login
