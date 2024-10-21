import './App.css';
import TokenTransferComponent from './components/TokenTransferList';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TokenTransferComponent/>
    </LocalizationProvider>
  );
}

export default App;
