import React, { useState, useEffect, useMemo } from 'react'
import { IPO_Header } from '../types/globalTypes'
import axios from 'axios';

type props = {
  searchTerm: string,
}

const TableDisplay = ({ searchTerm }: props) => {

  const [tableData, setTableData] = useState<IPO_Header[]>([])
  const columns: string[] = ["PO UID", "Company", "PO Number", "Vendor Name", "PO Date", "Placed By", "Ship Date", "Ship Via", "Emailed To"];

  const handlePrint = async (header: IPO_Header) => {
      const res = await axios.post('/print', header, {responseType: 'blob'});
      const file = new Blob([res.data], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }

  useEffect(() => {
    let url: string = `/search/${searchTerm}`;
    if(searchTerm){
      console.log(url);
      const fetchPos = async () => {
          const res = await fetch(url);
          const data = await res.json()
          console.log(data)
          setTableData(data);
      }
      fetchPos();
    }
  }, [searchTerm])

  return (
    <div className="flex flex-col items-center justify-center mb-auto">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="mt-5 mb-5">
            </div>
            <table className="table-auto min-w-5/6">
              <thead className="bg-white border-b">
                <tr>
                  {columns.map((col) => (
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-center" key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                  {tableData?.map((data) => (
                    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" key={data.id}>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.id}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.company}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.po_num}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.vendor_name}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.po_date}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.placed_by.split(";")[2]}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.ship_date}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.ship_via}</td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{data.email}</td>
                      <td><button className="px-4 text-white bg-gray-600 border-l" onClick={() => handlePrint(data)} >Print</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableDisplay