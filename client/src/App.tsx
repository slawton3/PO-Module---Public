import React from 'react';
import './App.css';
import Navbar from './components/Navbar'
import Container from './components/Container';
import Footer from './components/Footer'

function App() {
  return (
    <>
    <div className="App">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-red-400">PO Module</h1>
          <div className="px-4 py-6 sm:px-0">
            <div className="p-6 max-w-full mx-auto h-150 bg-white rounded-xl shadow-lg flex space-x-4">
              <div className="w-full grid-cols-2 gap-4">
                <div className="text-xl font-medium text-black w-full"> 
                  <Container />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}

export default App;
