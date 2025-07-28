'use client'

import SummaryCards from './SummaryCards'
import CategoryPieChart from './CategoryPieChart'
import CategoryBarChart from './CategoryBarChart'
import InvestmentLineChart from './InvestmentLineChart'
import InvestmentTypePieChart from './InvestmentTypePieChart'
import { Transaction } from "../../../store/transactionSlice"
import ExpensePieChart from './ExpensePieChart'

type Props = {
  transactions: Transaction[]
}

export default function Dashboard({ transactions }: Props) {
  return (
    <div className="w-full lg:min-w-[690px] max-w-6xl mx-auto py-6 flex flex-col gap-8">
      <SummaryCards transactions={transactions} />

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <CategoryPieChart transactions={transactions} />
        <CategoryBarChart transactions={transactions} />
      </div>

      <InvestmentTypePieChart transactions={transactions} />
      <ExpensePieChart transactions={transactions} />
      <InvestmentLineChart transactions={transactions} />
    </div>
  )
}
