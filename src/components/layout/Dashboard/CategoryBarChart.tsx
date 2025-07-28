'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Transaction } from "../../../store/transactionSlice"

type Props = {
  transactions: Transaction[]
}

const CATEGORIAS_VALIDAS = [
  'Fundos de investimento',
  'Tesouro Direto',
  'Previdência Privada',
  'Bolsa de Valores',
  'Criptomoedas',
  'FII',
  'ETFs',
  'CDB / RDB',
  'LCI',
  'LCA',
  'Poupança'
]

const categoryColors: Record<string, string> = {
  'Fundos de investimento': '#2E7DFF',
  'Tesouro Direto': '#28C76F',
  'Previdência Privada': '#FF4081',
  'Bolsa de Valores': '#FF9800',
  'Criptomoedas': '#AB47BC',
  'FII': '#00BCD4',
  'ETFs': '#8BC34A',
  'CDB / RDB': '#FF5722',
  'LCI': '#3F51B5',
  'LCA': '#9C27B0',
  'Poupança': '#009688'
}

export default function CategoryBarChart({ transactions }: Props) {
  const aggregatedData = transactions.reduce((acc, tx) => {
    if (!tx.category || !CATEGORIAS_VALIDAS.includes(tx.category)) return acc

    const existing = acc.find(item => item.name === tx.category)
    const absValue = Math.abs(tx.value)

    if (existing) {
      existing.value += absValue
    } else {
      acc.push({ name: tx.category, value: absValue })
    }

    return acc
  }, [] as { name: string; value: number }[])

  const sortedData = aggregatedData.sort((a, b) => b.value - a.value)

  return (
    <div className="bg-[#004b59] rounded-lg p-6 shadow w-full text-white">
      <h3 className="text-lg font-semibold mb-4">Investimentos por Categoria</h3>
      {sortedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} layout="vertical" margin={{ left: 40 }}>
            <XAxis
              type="number"
              tickFormatter={value =>
                `R$ ${value.toLocaleString('pt-BR', {
                  minimumFractionDigits: 0
                })}`
              }
              stroke="#ffffff"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              stroke="#ffffff"
              tick={{ fontSize: 14 }}
            />
            <Tooltip
              formatter={(value: number) => [
                `R$ ${value.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2
                })}`,
                'Valor'
              ]}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Bar dataKey="value">
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || '#8884d8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-white opacity-75">Nenhum dado para exibir.</p>
      )}
    </div>
  )
}
