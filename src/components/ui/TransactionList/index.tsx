'use client'

import { useEffect, useState } from 'react'
import EditTransactionModal from '../EditTransactionModal'
import FilterModal from '../FilterModal'
import FilterListIcon from '@mui/icons-material/FilterList'
import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Badge, Tooltip } from '@mui/material'
import { Transaction } from "../../../store/transactionSlice"

type Props = {
  transactions: Transaction[]
  onDelete: (id: number) => void
  onEdit: (id: number) => void
  onSave: (id: number, updated: Partial<Transaction>) => void
}

const ITEMS_PER_PAGE = 10

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/')
  return `${year}-${month}-${day}`
}

const groupByMonth = (transactions: Transaction[]) => {
  return transactions.reduce((groups, tx) => {
    const parsedDate = tx.date.includes('/')
      ? new Date(parseDate(tx.date))
      : new Date(tx.date)

    const month = parsedDate.getMonth() // 0 = Jan
    if (!groups[month]) groups[month] = []
    groups[month].push(tx)
    return groups
  }, {} as { [key: number]: Transaction[] })
}


function getMonthName(month: number) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return meses[month] || 'Mês inválido'
}

function countActiveFilters(filters: Record<string, any>) {
  return Object.values(filters).filter(val => val !== '' && val !== null).length
}

export default function TransactionList({ transactions, onDelete, onSave }: Props) {
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const [filterType, setFilterType] = useState('')
  const [minValue, setMinValue] = useState<number | null>(null)
  const [maxValue, setMaxValue] = useState<number | null>(null)
  const [filterMonth, setFilterMonth] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [appliedFilters, setAppliedFilters] = useState<{
    filterType: string
    filterMonth: string
    minValue: number | null
    maxValue: number | null
    startDate: string
    endDate: string
  }>({
    filterType: '',
    filterMonth: '',
    minValue: null,
    maxValue: null,
    startDate: '',
    endDate: ''
  })

  const [open, setOpen] = useState(false)
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleEditClick = (tx: Transaction) => {
    setCurrentTx(tx)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentTx(null)
  }

  const clearFilters = () => {
    setFilterType('')
    setFilterMonth('')
    setMinValue(null)
    setMaxValue(null)
    setStartDate('')
    setEndDate('')
    setAppliedFilters({
      filterType: '',
      filterMonth: '',
      minValue: null,
      maxValue: null,
      startDate: '',
      endDate: ''
    })
  }

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((tx) => {
      if (!tx.date) return false

      const dateObj = new Date(tx.date)
      const day = String(dateObj.getDate()).padStart(2, '0')
      const month = String(dateObj.getMonth() + 1).padStart(2, '0') // zero-based
      const year = String(dateObj.getFullYear())
      const txMonth = Number(month)
      const txDateISO = `${year}-${month}-${day}`
      const matchType = appliedFilters.filterType
        ? tx.type === appliedFilters.filterType
        : true

      const matchMin = appliedFilters.minValue !== null
        ? tx.value >= Number(appliedFilters.minValue)
        : true

      const matchMax = appliedFilters.maxValue !== null
        ? tx.value <= Number(appliedFilters.maxValue)
        : true

      const matchMonth = appliedFilters.filterMonth
        ? txMonth === Number(appliedFilters.filterMonth)
        : true

      const matchDateStart = appliedFilters.startDate
        ? new Date(txDateISO) >= new Date(appliedFilters.startDate)
        : true

      const matchDateEnd = appliedFilters.endDate
        ? new Date(txDateISO) <= new Date(appliedFilters.endDate)
        : true

      return (
        matchType &&
        matchMin &&
        matchMax &&
        matchMonth &&
        matchDateStart &&
        matchDateEnd
      )
    })
    : []


  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const grouped = groupByMonth(paginatedTransactions)
  const activeFiltersCount = countActiveFilters(appliedFilters)

  return (
    <div className="bg-white shadow rounded p-4 w-full lg:min-w-[270px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Extrato</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-1 rounded hover:bg-gray-100"
            title="Filtrar"
            aria-label="Abrir filtros"
          >
            <Badge
              badgeContent={activeFiltersCount}
              color="primary"
              overlap="circular"
              invisible={activeFiltersCount === 0}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#004D61',
                  color: 'white',
                  fontSize: '0.6rem',
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px'
                }
              }}
            >
              <FilterListIcon className="text-gray-700" />
            </Badge>
          </button>
          <button
            onClick={clearFilters}
            className="p-1 rounded hover:bg-gray-100"
            title="Limpar filtros"
            aria-label="Limpar filtros"
          >
            <ClearIcon className="text-gray-700" />
          </button>
        </div>
      </div>

      {hasMounted && paginatedTransactions.length === 0 ? (
        <p className="text-gray-400 text-sm italic text-center">
          Nenhuma transação encontrada.
        </p>
      ) : (
        hasMounted &&
        Object.keys(grouped)
          .sort((a, b) => Number(b) - Number(a))
          .map((month) => (
            <div key={month} className="mb-4">
              <h4 className="text-[var(--primary-blue)] text-[13px]">
                {getMonthName(Number(month))}
              </h4>
              <ul className="divide-y divide-gray-200 text-[var(--background-gray)]">
                {grouped[Number(month)].map((tx) => (
                  <li key={tx.id} className="py-2 text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <Tooltip title={tx.category || 'Sem categoria'}>
                          <p className="cursor-help">
                            {tx.type} - {new Date(tx.date.includes('/') ? parseDate(tx.date) : tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </p>
                        </Tooltip>
                        <p className={tx.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                          R$ {tx.value.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(tx)} aria-label="Editar transação">
                          <img src="/pincel.svg" alt="Editar" className="w-5 h-5 cursor-pointer" />
                        </button>
                        <button onClick={() => onDelete(tx.id)} aria-label="Excluir transação">
                          <img src="/trash.svg" alt="Excluir" className="w-5 h-5 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>
          <span className="text-sm text-gray-600">{currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </div>
      )}

      <EditTransactionModal
        open={open}
        onClose={handleClose}
        onSave={onSave}
        transaction={currentTx}
      />

      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onClear={() => {
          clearFilters()
          setShowFilterModal(false)
        }}
        filterType={filterType}
        setFilterType={setFilterType}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        minValue={minValue}
        setMinValue={setMinValue}
        maxValue={maxValue}
        setMaxValue={setMaxValue}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={() => {
          setAppliedFilters({
            filterType,
            filterMonth,
            minValue,
            maxValue,
            startDate,
            endDate
          })
          setShowFilterModal(false)
        }}
      />
    </div>
  )
}