'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import ClearIcon from '@mui/icons-material/Clear';

function SelectComponent() {
  const searchParams = useSearchParams()
  const priorityParams = searchParams.get('priority')
  const stateParams = searchParams.get('state')
  const [priority, setPriority] = useState(priorityParams || '');
  const [state, setState] = useState(stateParams || '');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault()
    // Redirect to the search page with the search query as a parameter
    router.push(`?priority=${priority}&state=${state}&search=${encodeURIComponent(searchQuery)}`);
  };

  const handleClear = () => {
    setPriority('')
    setState('')
    setSearchQuery('')
    router.replace('/orders', undefined, { shallow: true });
  }

  const handleSelectChange = (event, type) => {
  const selectedValue = event.target.value;

  if (type === 'priority') {
    setPriority(() => {
      // Update the URL with the selected value
      
      return selectedValue;
    });
    router.push(`/orders?priority=${selectedValue}&state=${state}&search=${encodeURIComponent(searchQuery)}`);
  }

  if (type === 'state') {
    setState(() => {
      // Update the URL with the selected value
      return selectedValue;
    });
    router.push(`/orders?priority=${priority}&state=${selectedValue}&search=${encodeURIComponent(searchQuery)}`);
  }
};

  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      <FormControl sx={{width: '40%'}} size='small'>
        <InputLabel id="priority-label">Пріоритет</InputLabel>
        <Select
          labelId="priority-label"
          id="priority-select"
          value={priority}
          label="Пріоритет"
          onChange={(e) => handleSelectChange(e, 'priority')}
        >
          <MenuItem value="">-</MenuItem>
          <MenuItem value="high">Вис.</MenuItem>
          <MenuItem value="medium">Норм.</MenuItem>
          <MenuItem value="low">Низ.</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{width: '40%'}} size='small'>
        <InputLabel id="state-label">Стан</InputLabel>
        <Select
          labelId="state-label"
          id="state-select"
          value={state}
          label="Стан"
          onChange={(e) => handleSelectChange(e, 'state')}
        >
          <MenuItem value="">-</MenuItem>
          <MenuItem value="recieved">Прийнято</MenuItem>
          <MenuItem value="in-progress">В роботі</MenuItem>
          <MenuItem value="completed">Виконано</MenuItem>
          <MenuItem value="cancelled">Відміна</MenuItem>
        </Select>
      </FormControl>
          <Box component="form" onSubmit={handleSearch} autoComplete="off" sx={{display: 'flex', width: '100%'}}>
      <TextField
        fullWidth
        label="Пошук"
            variant="outlined"
            size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button onClick={handleClear} sx={{ml: 1}}>
        <ClearIcon/>
      </Button>
    </Box>
    </Box>
  );
}

export default SelectComponent;