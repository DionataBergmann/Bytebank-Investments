'use client'

import { Transaction } from "../../../store/transactionSlice"

interface Props {
  transactions: Transaction[]
}

const rendaFixaCategorias = [
  'Tesouro Direto',
  'CDB / RDB',
  'LCI',
  'LCA',
  'Poupança'
]

const rendaVariavelCategorias = [
  'Bolsa de Valores',
  'Fundos de investimento',
  'Previdência Privada',
  'ETFs',
  'Criptomoedas',
  'FII'
]

export default function SummaryCards({ transactions }: Props) {
  const investimentos = transactions.filter(t =>
    t.type === 'Entrada' && typeof t.category === 'string' &&
    (rendaFixaCategorias.includes(t.category) || rendaVariavelCategorias.includes(t.category))
  )

  const total = investimentos.reduce((sum, t) => sum + t.value, 0)

  const fixed = investimentos
    .filter(t => typeof t.category === 'string' && rendaFixaCategorias.includes(t.category))
    .reduce((sum, t) => sum + t.value, 0)

  const variable = investimentos
    .filter(t => typeof t.category === 'string' && rendaVariavelCategorias.includes(t.category))
    .reduce((sum, t) => sum + t.value, 0)

  const outros = total - fixed - variable

  const categoryTotals: Record<string, number> = {}
  for (const t of investimentos) {
    if (typeof t.category === 'string') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.value
    }
  }

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-800 text-white p-4 rounded-lg shadow text-center">
        <p>Total Investido</p>
        <p className="text-xl font-bold">{formatCurrency(total)}</p>
      </div>

      <div className="bg-green-700 text-white p-4 rounded-lg shadow text-center">
        <p>Renda Fixa</p>
        <p className="text-xl font-bold">{formatCurrency(fixed)}</p>
      </div>

      <div className="bg-yellow-600 text-white p-4 rounded-lg shadow text-center">
        <p>Renda Variável</p>
        <p className="text-xl font-bold">{formatCurrency(variable)}</p>
      </div>

      <div className="bg-gray-700 text-white p-4 rounded-lg shadow text-center">
        <p>Mais investido em</p>
        <p className="text-xl font-bold">{topCategory}</p>
      </div>

      {outros > 0 && (
        <div className="col-span-full sm:col-span-2 lg:col-span-4 bg-red-700 text-white p-4 rounded-lg shadow text-center">
          <p>Outros investimentos não categorizados</p>
          <p className="text-xl font-bold">{formatCurrency(outros)}</p>
        </div>
      )}
    </div>
  )
}
