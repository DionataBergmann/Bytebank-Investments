'use client'

import { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { Transaction } from "../../../store/transactionSlice"

type Props = {
  transactions: Transaction[]
}

const typeColors: Record<string, string> = {
  Entrada: '#28C76F',     
  Saída: '#FF4D4F'         
}

export default function InvestmentTypePieChart({ transactions }: Props) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => setHasMounted(true), [])

  const typeTotals = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      const abs = Math.abs(t.value)
      map.set(t.type, (map.get(t.type) || 0) + abs)
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        color: typeColors[name] || '#ccc'
      }))
  }, [transactions])

  if (!hasMounted) return null

  return (
    <div className="bg-[#004b59] rounded-lg p-6 text-white">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Tipo</h2>
      <div className="bg-[#00323f] rounded-lg p-4">
        {typeTotals.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeTotals}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ percent }) => percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false}
              >
                {typeTotals.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => <span className="text-sm text-white">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-white opacity-75">Nenhum dado encontrado.</p>
        )}
      </div>
    </div>
  )
}
