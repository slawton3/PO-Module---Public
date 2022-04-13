import React, { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import TableDisplay from './components/tables/TableDisplay'


const Search = () => {
  
    const [searchTerm, setSearchTerm] = useState<string>("")
    let textInput = React.createRef<HTMLInputElement>();

    const handleSearch = (e: any): void => {
        let term = textInput.current!.value;
        setSearchTerm(term);
    }
    

    return (
    <>
        <div className="App">
            <Navbar />
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-red-400">PO Module</h1>
                </div>
            </main>
            <div className="flex items-center justify-center ">
                <div className="flex border-2 border-gray-200 rounded">
                    <input type="text" className="px-4 py-2 w-80" placeholder="Search..." ref={textInput} />
                    <button className="px-4 text-white bg-gray-600 border-l " onClick={(e) => handleSearch(e)}>
                        Search
                    </button>
                </div>
            </div>
            <TableDisplay searchTerm={searchTerm} />
            <Footer />
        </div>
    </>
    )
}

export default Search