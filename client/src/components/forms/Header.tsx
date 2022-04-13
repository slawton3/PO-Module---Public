import React, { FunctionComponent, useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form';
import { ILocations, INames } from '../types/globalTypes'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Header = {
    location: string,
    emailTo: string,
    poNumber: string,
    vendorName: string,
    poDate: Date,
    placedBy: string,
    shipDate: Date,
    shipVia: string
  };

const HeaderForm: FunctionComponent = () => {

    const { register, handleSubmit, watch, control, formState} = useFormContext<Header>();
    const { errors } = formState;

    const [locations, setLocations] = useState<ILocations[]>([]);
    const [names, setNames] = useState<INames[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            fetch('/locations')
                .then((data) => data.json())
                .then((data) => setLocations(data))
                .catch((err) => console.log(err));
        }

        const fetchNames = async () => {
            fetch('/name')
                .then((data) => data.json())
                .then((data) => setNames(data))
                .catch((err) => console.log(err));
        }
        fetchLocations();
        fetchNames();
    }, [])

    return (
        <>
                <div className="w-full text-gray-700 md:flex md:items-center">
                    <div className="mb-1 md:mb-0 md:w-1/3">
                        <label htmlFor="locationSelect">Select Location:</label>
                    </div>
                    <div className="md:w-2/3 md:flex-grow">
                        <select className="form-select appearance-none
                                            block
                                            w-full
                                            px-3
                                            py-1.5
                                            text-base
                                            font-normal
                                            text-gray-700
                                            bg-white bg-clip-padding bg-no-repeat
                                            border border-solid border-gray-300
                                            rounded
                                            transition
                                            ease-in-out
                                            m-0
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Location Select" id="locationSelect" required {...register("location")}>
                            <option value="Select a Location">Select a Location</option>
                            {locations?.map((loc) => (
                                <option key={loc.location_id}>{loc.location_id + "-" + loc.Location_PreFix + " - " + loc.phys_city + " - " + loc.phys_address1}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{errors.location?.message}</div>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full text-gray-700 md:flex md:items-center">
                        <div className="mb-1 md:mb-0 md:w-1/3">
                            <label htmlFor="emailTo">Email To (Separated by Comma):</label>
                        </div>
                        <div className="md:w-2/3 md:flex-grow">
                            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="emailTo" {...register("emailTo")} />
                            <div className="invalid-feedback">{errors.emailTo?.message}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
                    <div className="w-full px-2 md:w-1/2">
                    <label className="block mb-1" htmlFor="poNumber">PO Number</label>
                    <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="poNumber" required {...register("poNumber")}/>
                    <div className="invalid-feedback">{errors.poNumber?.message}</div>
                    <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
                    <div className="w-full px-2 md:w-1/2">
                        <label className="block mb-1" htmlFor="poDate">PO Date</label>
                        <Controller
                            control={control}
                            name='poDate'
                            render={({ field }) => (
                            <DatePicker
                                placeholderText='Select date'
                                onChange={(date: Date) => field.onChange(date)}
                                selected={field.value}
                            />
                        )}
                        />
                        <div className="invalid-feedback">{errors.poDate?.message}</div>
                    </div>
                    <div className="w-full px-2 md:w-1/2">
                        <label className="block mb-1" htmlFor="nameSelect">Placed By</label>
                        <select className="form-select appearance-none
                                            w-full
                                            px-3
                                            py-1.5
                                            text-base
                                            font-normal
                                            text-gray-700
                                            bg-white bg-clip-padding bg-no-repeat
                                            border border-solid border-gray-300
                                            rounded
                                            transition
                                            ease-in-out
                                            m-0
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Name Select" id="nameSelect" required {...register("placedBy")}>
                            <option value="Salesrep">Salesrep</option>
                            {names?.map((name) => (
                                <option key={name.id}>{name.name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{errors.placedBy?.message}</div>
                        </div>
                        
                    </div>
                    
                    </div>
                    <div className="w-full px-2 md:w-1/2">
                    <label className="block mb-1" htmlFor="vendorName">Vendor Name</label>
                    <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="vendorName" required {...register("vendorName")} />
                    <div className="invalid-feedback">{errors.vendorName?.message}</div>
                    <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
                    <div className="w-full px-2 md:w-1/2">
                        <label className="block mb-1" htmlFor="poDate">Ship Date</label>
                        <Controller
                            control={control}
                            name='shipDate'
                            render={({ field }) => (
                            <DatePicker
                                placeholderText='Select date'
                                onChange={(date: Date) => field.onChange(date)}
                                selected={field.value}
                            />
                        )}
                        />
                        <div className="invalid-feedback">{errors.shipDate?.message}</div>
                    </div>
                    <div className="w-full px-2 md:w-1/2">
                        <label className="block mb-1" htmlFor="nameSelect">Ship Via</label>
                        <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="shipVia" required {...register("shipVia")} />
                        <div className="invalid-feedback">{errors.shipVia?.message}</div>
                        </div>
                        
                    </div>
                    </div>
                </div>
            <hr className="my-6 border-gray-300" />
        </>
    )
}

export default HeaderForm