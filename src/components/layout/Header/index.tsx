'use client'

import { FaUserCircle } from 'react-icons/fa'
import { FiMenu } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { RootState } from '../../../store'
import { logout } from '../../../store/authSlice'

type Props = {
  onToggleMenu: () => void
}

export default function Header({ onToggleMenu }: Props) {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const [username, setUsername] = useState('')

  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedName = localStorage.getItem('username')
    if (storedName) setUsername(storedName)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-[var(--primary-blue)] text-white px-6 py-4 flex items-center justify-between relative">
      <button onClick={onToggleMenu} className="md:hidden text-xl">
        <FiMenu />
      </button>

      <div className="ml-auto flex items-center gap-3 relative" ref={menuRef}>
        <span className="text-sm">{user?.name || username}</span>

        <FaUserCircle
          className="text-xl cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
          title="Menu"
        />

        {showMenu && (
          <div className="absolute top-full right-0 mt-2 bg-white text-black shadow-lg rounded-md w-32 z-10 ">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
