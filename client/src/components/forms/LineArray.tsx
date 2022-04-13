import React, { useEffect, useState, useRef } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form';
import LineDetail from './LineDetail'
import { IBranch } from '../types/globalTypes';
import { RiDeleteBin5Line } from 'react-icons/ri'

type Line = {
    qty: number[],
    part_num: string[],
    description: string[],
    branch: string[],
    unit_price: number[]
}

type FormValues = {
    header: {
        id: number,
        company: string,
        po_num: string,
        vendor_name: string,
        po_date: string,
        placed_by: string,
        ship_date: string,
        ship_via: string,
        email: string,
    };
    lines: {
        qty: number
        part_num: string,
        description: string,
        branch: string,
        unit_price: number,
    }[];
}


const LineArray = () => {
    const {
        register,
        control,
        getValues,
        formState
      } = useFormContext<FormValues>();
    const { errors } = formState;
    
    const { fields, append, remove } = useFieldArray<FormValues>({
        control,
        name: "lines",
    });
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [count, setCount] = useState<number[]>([0]);
    const [qty, setQty] = useState<number[]>([]);
    const [price, setPrice] = useState<number[]>([]);
    const [total, setTotal] = useState<number[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    const handleChange = (e: any, index: number) => {
        const vals = getValues([`lines.${index}.qty`, `lines.${index}.unit_price`]);
        let t = vals[0] * vals[1];
        let temp = [...total];
        temp[index] = t;
        setTotal(temp);
    }

    const calculateGrandTotal = (): void => {
        //reduces the total array to single value
        if(total.length > 0) {
            const reducer = (a: number, b: number) => a + b; 
            let gt: number = total.reduce(reducer);
            setGrandTotal(gt);
        }
    }

    const add = (e: any) => {
        e.preventDefault();
        append({});
        let temp = [...total];
        temp.push(0);
        setTotal(temp);
    }

    const deleteLine = (e: any, index: number) => {
        e.preventDefault();
        remove(index);
        let temp = [...total];
        temp.splice(index, 1);
        setTotal(temp);
    }

    if (fields.length === 0) {
        append({});
        setTotal([0])
    }
    

    useEffect(() => {
        const fetchBranches = async () => {
            fetch('/branch')
                .then((data) => data.json())
                .then((data) => setBranches(data))
                .catch((err) => console.log(err));
        }
        fetchBranches();
        calculateGrandTotal();
    }, [total])

        return (
            <>
            <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
            <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="qty">Qty</label>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="part_num">Part Number</label>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="description">Description</label>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="branch">Branch</label>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="unit_price">Unit Price</label>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="line_total">Line Item Total</label>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-2">
                    {branches && fields.map((item, index) => (
                        //<LineDetail key={index} count={index} branches={branches} lineTotal={addLineTotal} item={item}/>
                        <React.Fragment key={item.id}>
                            <div className="w-full px-2 md:w-1/6">
                                <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" {...register(`lines.${index}.qty`)} onBlur={(e) => handleChange(e, index)} />
                            </div>
                            <div className="w-full px-2 md:w-1/6">
                                <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="part_num" {...register(`lines.${index}.part_num`)} />
                            </div>
                            <div className="w-full px-2 md:w-1/6">
                                <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="description" {...register(`lines.${index}.description`)} />
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
                                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Branch Select" id="branch" {...register(`lines.${index}.branch`)} >
                                            <option value="Select a Branch">Select a Branch</option>
                                            {branches?.map((branch) => (
                                                <option key={branch.name}>{branch.name}</option>
                                            ))}
                                        </select>
                            </div>
                            <div className="w-full px-2 md:w-1/6">
                                <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" placeholder="0.00" id="unit_price" {...register(`lines.${index}.unit_price`)} onBlur={(e) => handleChange(e, index)} />
                            </div>
                            <div className="w-full px-2 md:w-1/6">
                                <input readOnly className="w-9/12 mr-2 h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="line_total" value={"$"+ total[index]} />
                                <button onClick={(e) => deleteLine(e, index)}><RiDeleteBin5Line /></button>
                            </div>
                    </React.Fragment>
                    ))}
                </div>
                <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
            <div className="w-full px-2 md:w-1/6">
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="line_total">Grand Total:</label>
                    </div>
                    <div className="w-full px-2 md:w-1/6">
                        <label className="block mb-1" htmlFor="line_total"></label>
                        <input readOnly className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={"$" + grandTotal}></input>
                    </div>
                </div>
                <button onClick={(e) => add(e)} className="inline-block px-6 py-2.5 mt-4 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out mr-2"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light">Add Line</button>
            </>
    )
}

export default LineArray
