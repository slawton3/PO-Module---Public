import React from 'react'

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className="fixed inset-x-0 bottom-0 bg-gray-100 text-center lg:text-center">
        <div className="text-center text-gray-700 p-4">
            <p>© {date} Copyright Weimer Bearing & Transmission</p>
        </div>
    </footer>
  )
}

export default Footer