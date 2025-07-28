'use client'

import { useEffect, useState } from 'react'
import { Transaction } from "../../../store/transactionSlice"
import { FiEye } from 'react-icons/fi'

type Props = {
  transactions: Transaction[]
}

export default function BalanceCard({ transactions }: Props) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const total = Array.isArray(transactions)
    ? transactions.reduce((sum, t) => sum + t.value, 0)
    : 0

  const formattedDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const capitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  const [username, setUsername] = useState('')

  useEffect(() => {
    setHasMounted(true)
    const name = localStorage.getItem('username')
    if (name) setUsername(name)
  }, [])

  return (
    <div className="bg-[#004b59] text-white rounded-xl p-6 shadow-md flex gap-4 min-h-[160px] w-full lg:min-w-[690px] justify-between">
      <div>
        <h2 className="text-xl font-semibold">Olá, {username}! :)</h2>
        <p className="text-[13px] text-gray-200 mt-1">{capitalized}</p>
      </div>

      <div>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Saldo</span>
          <FiEye className="text-red-400 text-xs" />
        </div>
        <hr className="border-red-400 my-1 w-24" />
        <p className="text-[16px] text-gray-200">Conta Corrente</p>
        <h3 className="text-2xl ">
           R$ {hasMounted ? total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '...'}
        </h3>
      </div>
    </div>
  )
}
