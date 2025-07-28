import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box
} from '@mui/material'

type Props = {
  open: boolean
  onClose: () => void
  onClear: () => void
  onApply: () => void
  filterType: string
  setFilterType: (value: string) => void
  filterMonth: string
  setFilterMonth: (value: string) => void
  minValue: number | null
  setMinValue: (value: number | null) => void
  maxValue: number | null
  setMaxValue: (value: number | null) => void
  startDate: string
  setStartDate: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
}

function getMonthName(month: number) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return meses[month - 1]
}

export default function FilterModal({
  open,
  onClose,
  onClear,
  onApply,
  filterType,
  setFilterType,
  filterMonth,
  setFilterMonth,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: 'var(--background-gray)', color: 'var(--azureish-White)' }}>
        Filtrar Transações
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: 'var(--background-gray)', pt: 3, pb: 2 }}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flex="1 1 45%">
            <FormControl fullWidth>
              <InputLabel id="type-label">Tipo</InputLabel>
              <Select
                labelId="type-label"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="">Todos os tipos</MenuItem>
                <MenuItem value="Entrada">Entrada</MenuItem>
                <MenuItem value="Saída">Saída</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box flex="1 1 45%">
            <FormControl fullWidth>
              <InputLabel id="month-label">Mês</InputLabel>
              <Select
                labelId="month-label"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                label="Mês"
              >
                <MenuItem value="">Todos os meses</MenuItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={(i + 1).toString()}>
                    {getMonthName(i + 1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box flex="1 1 45%">
            <TextField
              label="Valor mínimo"
              type="number"
              fullWidth
              value={minValue}
              onChange={(e) => setMinValue(e.target.value === '' ? null : Number(e.target.value))}
            />
          </Box>

          <Box flex="1 1 45%">
            <TextField
              label="Valor máximo"
              type="number"
              fullWidth
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value === '' ? null : Number(e.target.value))}
            />
          </Box>

          <Box flex="1 1 45%">
            <TextField
              label="Data inicial"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Box>

          <Box flex="1 1 45%">
            <TextField
              label="Data final"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: 'var(--background-gray)', p: 2 }}>
        <Button onClick={() => { onClear(); onClose(); }} variant="text" sx={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
          Limpar
        </Button>
        <Button
          onClick={onApply}
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
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
