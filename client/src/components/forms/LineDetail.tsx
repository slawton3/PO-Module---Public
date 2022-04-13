import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { IBranch } from '../types/globalTypes';


type props = {
    count: number,
    branches: IBranch[],
    lineTotal: (total: number, lineID: number) => void
    item: {
        qty: number,
        part_num: string,
        description: string,
        branch: string,
        unit_price: number
    }
}

type Line = {
    qty: number[],
    part_num: string[],
    description: string[],
    branch: string[],
    unit_price: number[]
}

const LineDetail = ({ count, branches, lineTotal, item }: props): JSX.Element  => {

    const { register, handleSubmit, watch, control, formState: { errors } } = useForm<Line>();

    const [qty, setQty] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const handleQtyChange = (e: any): void => {
        let parsedQty: number = parseFloat(e.target.value);
        if(Number.isNaN(parsedQty)){
            parsedQty = 0;
        }
        let final = parsedQty * price;
        console.log("Final => ", final);
        lineTotal(final, count)
        setQty(parsedQty);
        setTotal(final);
    }

    const handlePriceChange = (e: any): void => {
        let parsedPrice: number = parseFloat(e.target.value);
        if(Number.isNaN(parsedPrice)){
            parsedPrice = 0;
        }
        let final = parsedPrice * qty;
        console.log("Final =>", final);
        lineTotal(final, count)
        setPrice(parsedPrice);
        setTotal(final);
    }

return (
        <>
                    <div className="w-full px-2 md:w-1/6">
                        <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="qty" {...register("qty")} onBlur={(e) => handleQtyChange(e)} />
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="part_num" {...register("part_num")}/>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="description" {...register("description")} />
                    </div>
                    <div className="w-full px-2 md:w-1/6">
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
                                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Branch Select" id="branch" {...register("branch")}>
                                    <option value="Select a Branch">Select a Branch</option>
                                    {branches?.map((branch) => (
                                        <option key={branch.name}>{branch.name}</option>
                                    ))}
                                </select>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" placeholder="0.00" id="unit_price" {...register("unit_price")} onBlur={(e) => handlePriceChange(e) }  />
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <input readOnly className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="line_total" value={"$"+total} />
                    </div>
        </>
    )
}

export default LineDetail

