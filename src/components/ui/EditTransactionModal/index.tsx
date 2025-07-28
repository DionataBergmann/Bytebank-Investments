import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Transaction } from "../../../store/transactionSlice"
import { useSnackbar } from 'notistack'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (id: number, updated: Partial<Transaction>) => void
  transaction: Transaction | null
}

const categoryOptions = [
  { label: 'Fundos de investimento', group: 'Investimentos' },
  { label: 'Tesouro Direto', group: 'Investimentos' },
  { label: 'Previdência Privada', group: 'Investimentos' },
  { label: 'Bolsa de Valores', group: 'Investimentos' },
  { label: 'Criptomoedas', group: 'Investimentos' },
  { label: 'CDB / RDB', group: 'Investimentos' },
  { label: 'FII', group: 'Investimentos' },
  { label: 'ETFs', group: 'Investimentos' },
  { label: 'Salário', group: 'Receitas' },
  { label: 'Renda Extra', group: 'Receitas' },
  { label: 'Alimentação', group: 'Despesas' },
  { label: 'Transporte', group: 'Despesas' },
  { label: 'Saúde', group: 'Despesas' },
  { label: 'Educação', group: 'Despesas' },
  { label: 'Lazer', group: 'Despesas' },
  { label: 'Moradia', group: 'Despesas' }
]

export default function EditTransactionModal({ open, onClose, onSave, transaction }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  const [type, setType] = useState<'Entrada' | 'Saída'>('Entrada')
  const [value, setValue] = useState<number>(0)
  const [category, setCategory] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [existingFileName, setExistingFileName] = useState<string | null>(null)

  useEffect(() => {
    if (transaction) {
      setType(transaction.type as 'Entrada' | 'Saída')
      setValue(Math.abs(transaction.value))
      setCategory(transaction.category ?? null)

      if (transaction.file && typeof transaction.file === 'string') {
        setExistingFileName(transaction.file)
      } else {
        setExistingFileName(null)
      }
    }
  }, [transaction])

  const handleClose = () => {
    setType('Entrada')
    setValue(0)
    setCategory(null)
    setFile(null)
    setExistingFileName(null)
    onClose()
  }

  const handleSave = () => {
    if (transaction) {
      const signedValue = type === 'Saída' ? -Math.abs(value) : Math.abs(value)
      const updatedData: Partial<Transaction> = {
        type,
        value: signedValue,
        category: category ?? '',
        file: file || transaction.file 
      }

      onSave(transaction.id, updatedData)
      enqueueSnackbar('Transação atualizada com sucesso!', { variant: 'success' })
    }

    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ backgroundColor: 'var(--background-gray)', color: 'var(--azureish-white)' }}>
        Editar Transação
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: 'var(--background-gray)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: 3
        }}
      >
        <div className="flex gap-2">
          <Button
            variant={type === 'Entrada' ? 'contained' : 'outlined'}
            onClick={() => setType('Entrada')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: type === 'Entrada' ? 'var(--green-entry)' : 'transparent',
              color: type === 'Entrada' ? 'white' : 'var(--green-entry)',
              borderColor: 'var(--green-entry)',
              minWidth: 120,
              '&:hover': {
                backgroundColor:
                  type === 'Entrada'
                    ? 'var(--green-entry-hover)'
                    : 'var(--green-entry-bg-light)'
              }
            }}
          >
            Entrada
          </Button>
          <Button
            variant={type === 'Saída' ? 'contained' : 'outlined'}
            onClick={() => setType('Saída')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: type === 'Saída' ? 'var(--red-exit)' : 'transparent',
              color: type === 'Saída' ? 'white' : 'var(--red-exit)',
              borderColor: 'var(--red-exit)',
              minWidth: 120,
              '&:hover': {
                backgroundColor:
                  type === 'Saída'
                    ? 'var(--red-exit-hover)'
                    : 'var(--red-exit-bg-light)'
              }
            }}
          >
            Saída
          </Button>
        </div>

        {/* Categoria */}
        <Autocomplete
          options={categoryOptions}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => option.label}
          value={categoryOptions.find((opt) => opt.label === category) || null}
          onChange={(_, newValue) => setCategory(newValue?.label ?? null)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Categoria"
              placeholder="Escolha ou digite uma categoria"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--primary-blue)' },
                  borderRadius: '8px'
                }
              }}
            />
          )}
        />

        {/* Valor */}
        <TextField
          type="number"
          label="Valor"
          placeholder="Digite o valor"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& input': {
              padding: '10px 14px'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--primary-blue)'
              },
              borderRadius: '8px'
            }
          }}
          fullWidth
        />

        {/* Upload comprovante */}
        <div className="flex flex-col gap-2">
          <Button
            variant="contained"
            component="label"
            startIcon={<AttachFileIcon />}
            sx={{
              backgroundColor: 'var(--primary-blue)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontWeight: 600,
              textTransform: 'none',
              width: 'fit-content',
              '&:hover': {
                backgroundColor: 'var(--primary-blue)'
              }
            }}
          >
            Anexar comprovante
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Button>

          {file && (
            <Typography sx={{ fontSize: 14, color: 'var(--outer-space-gray)' }}>
              Novo arquivo selecionado: <strong>{file.name}</strong>
            </Typography>
          )}

          {!file && existingFileName && (
            <Typography sx={{ fontSize: 14, color: 'var(--outer-space-gray)' }}>
              Arquivo atual: <strong>{existingFileName}</strong>
            </Typography>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: 'var(--background-gray)', p: 2 }}>
        <Button onClick={onClose} variant="text" sx={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: 'var(--primary-blue)',
            borderRadius: '8px',
            padding: '8px 18px',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'var(--primary-blue)' },
            textTransform: 'none'
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
