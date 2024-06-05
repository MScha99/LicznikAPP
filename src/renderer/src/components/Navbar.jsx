import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="mx-auto flex h-24 max-w-[1240px] items-center justify-start bg-black px-4 text-white">
      {/* Logo */}
      <h1 className="mx-12 text-3xl font-bold text-[#00df9a]">LICZNIK</h1>

      <ul className="hidden space-x-4 md:flex">
        <Link to="/">
          <li className="m-2 cursor-pointer rounded-xl p-4 duration-300 hover:bg-[#00df9a] hover:text-black">
            Urządzenia
          </li>
        </Link>
        <Link to="/tariffs">
          <li className="m-2 cursor-pointer rounded-xl p-4 duration-300 hover:bg-[#00df9a] hover:text-black">
            Taryfy
          </li>
        </Link>
        <Link to="/calculator">
          <li className="m-2 cursor-pointer rounded-xl p-4 duration-300 hover:bg-[#00df9a] hover:text-black">
            Kalkulator
          </li>
        </Link>
      </ul>
    </div>
  )
}

export default Navbar
