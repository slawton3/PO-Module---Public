import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import LineDetail from './LineDetail'
import { IBranch } from '../types/globalTypes';

type Line = {
    qty: number[],
    part_num: string[],
    description: string[],
    branch: string[],
    unit_price: number[]
}



const Line = () => {
    const { register, handleSubmit, watch, control, formState: { errors } } = useFormContext<Line>();
    
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [count, setCount] = useState<number[]>([0]);
    const [total, setTotal] = useState<number[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    

    const add = (): void => {
        try{
            setCount(count => [...count, count.length]);
        }
        catch(err){
            console.log(err)
        }
    }

    const calculateGrandTotal = (): void => {
        //reduces the total array to single value
        if(total.length > 0) {
            const reducer = (a: number, b: number) => a + b; 
            let gt: number = total.reduce(reducer);
            setGrandTotal(gt);
        }
    }
    
    const addLineTotal = (num: number, lineID: number): void => {
        //calculates line total and triggers re-render of component
        let newTotal: number[] = [...total];

        newTotal[lineID] = num;

        setTotal(newTotal);
        
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
                <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
                    {branches && count.map((i) => (
                        //<LineDetail key={i} count={i} branches={branches} lineTotal={addLineTotal} />
                        <></>
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
                <button onClick={() => add()} className="inline-block px-6 py-2.5 mt-4 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out mr-2"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light">Add Line</button>
            </>
    )
}

export default Line
