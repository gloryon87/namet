'use client'
import React, { useState, useEffect, useMemo } from 'react';
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
import _debounce from 'lodash/debounce';

function SelectComponent() {
  const searchParams = useSearchParams()
  const priorityParams = searchParams.get('priority')
  const stateParams = searchParams.get('state')
  const [priority, setPriority] = useState(priorityParams || '');
  const [state, setState] = useState(stateParams || '');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
  setSearchQuery(e.target.value);
};

// Use _debounce outside of the component to persist its identity
const delayedRouterPush = _debounce((queryString) => {
  router.push(`?${queryString}`);
}, 800);

useEffect(() => {
  let queryString = '';

  if (priority !== '') {
    queryString += `priority=${priority}&`;
  }

  if (state !== '') {
    queryString += `state=${state}&`;
  }

  if (searchQuery !== '') {
    queryString += `search=${encodeURIComponent(searchQuery)}`;
  }

  // Invoke the delayedRouterPush with the updated queryString
  delayedRouterPush(queryString);

  // Cleanup function to cancel any pending debounced execution on unmount
  return delayedRouterPush.cancel;
}, [searchQuery]);


  const handleClear = () => {
    setPriority('')
    setState('')
    setSearchQuery('')
    router.push('/orders?all=true');
  }

  const handleSelectChange = (event, type) => {
  const selectedValue = event.target.value;

  if (type === 'priority') {
    setPriority(() => selectedValue);
  }

  if (type === 'state') {
    setState(() => selectedValue);
  }
};

useEffect(() => {
  // Construct the query string with non-empty values
  let queryString = '';
  if (priority !== '') {
    queryString += `priority=${encodeURIComponent(priority)}&`;
  }
  if (state !== '') {
    queryString += `state=${encodeURIComponent(state)}&`;
  }
  if (searchQuery !== '') {
    queryString += `search=${searchQuery}`;
  }

  // Construct the final URL and navigate using router.push
  router.push(`?${queryString}`);
}, [priority, state]);


  return (
    <Box sx={{ display: 'flex', gap: {xs: 1, md: 2}, width: '100%' }}>
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
          <MenuItem value="вис.">Вис.</MenuItem>
          <MenuItem value="норм.">Норм.</MenuItem>
          <MenuItem value="низ.">Низ.</MenuItem>
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
          <MenuItem value="прийнято">Прийнято</MenuItem>
          <MenuItem value="в роботі">В роботі</MenuItem>
          <MenuItem value="виконано">Виконано</MenuItem>
          <MenuItem value="відміна">Відміна</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Пошук"
            variant="outlined"
            size="small"
        value={searchQuery}
        onChange={handleSearch}
      />
      <Button sx={{minWidth: {xs: 36, md: 64}}} onClick={handleClear}>
        <ClearIcon/>
      </Button>
    </Box>
  );
}

export default SelectComponent;