'use client'

import { useMemo, useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { Transaction } from "../../../store/transactionSlice"

const CATEGORIAS_DESPESAS = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Moradia'
]

const COLORS: Record<string, string> = {
  'Alimentação': '#FF6384',
  'Transporte': '#36A2EB',
  'Saúde': '#FFCE56',
  'Educação': '#4CAF50',
  'Lazer': '#9C27B0',
  'Moradia': '#FF8A65'
}

type Props = {
  transactions: Transaction[]
}

export default function ExpensePieChart({ transactions }: Props) {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])

  const chartData = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      if (t.type !== 'Saída' || !t.category || !CATEGORIAS_DESPESAS.includes(t.category)) continue
      map.set(t.category, (map.get(t.category) || 0) + Math.abs(t.value))
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        color: COLORS[name] || '#ccc'
      }))
  }, [transactions])

  if (!hasMounted || chartData.length === 0) return null

  return (
    <div className="bg-[#004b59] text-white rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Distribuição das Despesas</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="40%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            label={({ percent }) => percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `R$ ${value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2
              })}`,
              name
            ]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value) => (
              <span className="text-sm text-white">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
