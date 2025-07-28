'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { Transaction } from "../../../store/transactionSlice"

type Props = {
  transactions: Transaction[]
}

export default function InvestmentLineChart({ transactions }: Props) {
  const dataByMonth = useMemo(() => {
    const grouped: Record<string, { entrada: number; saida: number }> = {}

    for (const t of transactions) {
      const [day, month, year] = t.date.split('/')
      const key = `${month}/${year}`

      if (!grouped[key]) {
        grouped[key] = { entrada: 0, saida: 0 }
      }

      if (t.type === 'Entrada') {
        grouped[key].entrada += t.value
      } else if (t.type === 'Saída') {
        grouped[key].saida += Math.abs(t.value)
      }
    }

    return Object.entries(grouped)
      .map(([month, { entrada, saida }]) => ({
        month,
        entrada,
        saida
      }))
      .sort((a, b) => {
        const [ma, ya] = a.month.split('/').map(Number)
        const [mb, yb] = b.month.split('/').map(Number)
        return ya === yb ? ma - mb : ya - yb
      })
  }, [transactions])

  return (
    <div className="bg-white rounded-lg p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Evolução dos Investimentos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataByMonth} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
          <Tooltip
            formatter={(value: number, name: string) =>
              [`R$ ${value.toLocaleString('pt-BR')}`, name === 'entrada' ? 'Entrada' : 'Saída']
            }
          />
          <Line type="monotone" dataKey="entrada" stroke="#28C76F" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="saida" stroke="#FF4D4F" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
