import React, { useState } from 'react'
import { useSearchContext } from '../contexts/SearchContext'
import { MdTravelExplore } from 'react-icons/md'
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react'
import { useNavigate } from 'react-router-dom';
const Searchbar = () => {
    const search = useSearchContext()
    const navigate = useNavigate()
    const [destination, setDestination] = useState<string>(search.destination)
    const [checkIn, setcheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setcheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setadultCount] = useState<number>(search.adultCount);
    const [childCount, setchildCount] = useState<number>(search.childCount);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount);
        navigate("/search")
    }

    const minDate = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    return (
        <form onSubmit={handleSubmit} className='-mt-8 p-3 bg-gray-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4'>
            <div className='flex flex-row items-center flex-1 bg-white p-2 '>
                <MdTravelExplore size={25} className='mr-2' />
                <input
                    type="text"
                    placeholder='Where are you going ?'
                    className='text-md w-full focus:outline-none'
                    value={destination}
                    onChange={(evnet) => setDestination(evnet.target.value)}
                />

            </div>

            <div className="flex bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                    Adults:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={1}
                        max={20}
                        value={adultCount}
                        onChange={(event) => setadultCount(parseInt(event.target.value))}
                    />
                </label>
                <label className="items-center flex">
                    Children:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={0}
                        max={20}
                        value={childCount}
                        onChange={(event) => setchildCount(parseInt(event.target.value))}
                    />
                </label>
            </div>
            <div>
                <ReactDatePicker
                    selected={checkIn}
                    onChange={(date) => setcheckIn(date as Date)}
                    selectsStart
                    endDate={checkOut}
                    startDate={checkIn}
                    maxDate={maxDate}
                    minDate={minDate}
                    className='min-w-full bg-white p-2 focus:outline-none'
                    wrapperClassName='min-w-full'
                />
            </div>
            <div>
                <ReactDatePicker
                    selected={checkOut}
                    onChange={(date) => setcheckIn(date as Date)}
                    selectsStart
                    endDate={checkOut}
                    startDate={checkIn}
                    maxDate={maxDate}
                    minDate={minDate}
                    className='min-w-full bg-white p-2 focus:outline-none'
                    wrapperClassName='min-w-full'
                />
            </div>
            <div className='flex gap-1 '>
                <button className='w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500'>Search</button>
                <button className='w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500'>Clear</button>
            </div>
        </form>
    )
}

export default Searchbar
