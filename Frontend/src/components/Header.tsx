import { Link } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'
import SignOutButtom from './SignOutButtom';

const Header = () => {
    const { isLoggedIn } = useAppContext();
    return (
        <div className="bg-blue-800 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">
                        Holidays.com
                    </Link>
                </span>
                {/* space-x-2 will add some spacing between child element */}
                <span className='flex space-x-2'>
                    {
                        isLoggedIn ?
                            <>
                                <Link
                                    to='/my-bookings'
                                    className='flex items-center justify-center text-white px-3 font-bold bg-black hover:bg-gray-100 hover:text-green-500'
                                >
                                    My Bookings
                                </Link>
                                <Link
                                    to='/my-hotels'
                                    className='flex items-center justify-center text-white px-3 font-bold bg-black hover:bg-gray-100 hover:text-green-500'
                                >
                                    My Hotels
                                </Link>
                                <SignOutButtom />
                            </>
                            :
                            <>
                                <Link
                                    to='/sign-in'
                                    className='flex items-center justify-center text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 hover:text-green-500'
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to='/sign-up'
                                    className='flex items-center justify-center text-white px-3 font-bold bg-black hover:bg-gray-100 hover:text-green-500'
                                >
                                    Sign Up
                                </Link>
                            </>
                    }
                </span>
            </div>
        </div >
    )
}

export default Header
