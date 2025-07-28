import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import MainLayout from '../components/layout/MainLayout'
import BalanceCard from '../components/ui/BalanceCard'
import Dashboard from '../components/layout/Dashboard'
import TransactionList from '../components/ui/TransactionList'
import { deleteTransaction, fetchTransactions, setEditingState, updateTransaction } from '../store/transactionSlice'
import { AppDispatch, RootState } from '../store'
import { useSnackbar } from 'notistack'

export default function InvestmentsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { transactions } = useSelector((state: RootState) => state.transactions)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-40 mx-auto max-w-6xl">
        <div className="md:col-span-2 flex flex-col gap-6">
          <BalanceCard transactions={transactions} />
          <Dashboard transactions={transactions} />
        </div>

        <div>
          <TransactionList
            transactions={transactions}
            onEdit={(id) => {
              dispatch(setEditingState(id))
              enqueueSnackbar('Edição iniciada.', { variant: 'info' })
            }}
            onDelete={async (id) => {
              try {
                await dispatch(deleteTransaction(id)).unwrap()
                enqueueSnackbar('Transação excluída com sucesso!', { variant: 'success' })
              } catch (error) {
                enqueueSnackbar('Erro ao excluir transação.', { variant: 'error' })
              }
            }}
            onSave={async (id, updated) => {
              try {
                await dispatch(updateTransaction({ id, updated })).unwrap()
                enqueueSnackbar('Transação atualizada com sucesso!', { variant: 'success' })
              } catch (error) {
                enqueueSnackbar('Erro ao atualizar transação.', { variant: 'error' })
              }
            }}
          />

        </div>
      </div>
    </MainLayout>
  )
}
