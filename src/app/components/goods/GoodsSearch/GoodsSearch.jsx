'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import Tooltip from '@mui/material/Tooltip';
import ClearIcon from '@mui/icons-material/Clear';
import _debounce from 'lodash/debounce';

function GoodsSearch() {
  const searchParams = useSearchParams()
  const seasonParams = searchParams.get('season')
  const aParams = searchParams.get('a')
  const bParams = searchParams.get('b')
  const [a, setA] = useState(aParams || '')
  const [b, setB] = useState(bParams || '')
  const [season, setSeason] = useState(seasonParams || '');
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

  if (a !== '') {
    queryString += `a=${a}&`;
  }

  if (b !== '') {
    queryString += `b=${b}&`;
  }

  if (season !== '') {
    queryString += `season=${season}&`;
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
    setSeason('')
    setSearchQuery('')
    setA('')
    setB('')
    router.push('/goods');
  }

  const handleChange = (event, type) => {
  const value = event.target.value;

  if (type === 'season') {
    setSeason(() => value);
  }

  if (type === 'a') {
    setA(() => value);
  }

  if (type === 'b') {
    setB(() => value);
  }
};

useEffect(() => {
  // Construct the query string with non-empty values
  let queryString = '';
  if (a !== '') {
    queryString += `a=${a}&`;
  }

  if (b !== '') {
    queryString += `b=${b}&`;
  }

  if (season !== '') {
    queryString += `season=${encodeURIComponent(season)}&`;
  }
  if (searchQuery !== '') {
    queryString += `search=${searchQuery}`;
  }

  // Construct the final URL and navigate using router.push
  router.push(`?${queryString}`);
}, [season, a, b]);


  return (
    <Box sx={{ display: 'flex', gap: {xs: 1, md: 2}, width: '100%' }}>
      <Tooltip title='розмір сітки'>
      <TextField
        label="a"
        variant="outlined"
        size="small"
        value={a || ''}
        type='number'
        InputProps={{ inputProps: { min: 2 } }}
        onChange={(e) => handleChange(e, 'a')}
      />
      </Tooltip>
      <Tooltip title='розмір сітки'>
      <TextField
        label="b"
        variant="outlined"
        size="small"
        value={b || ''}
        type='number'
        InputProps={{ inputProps: { min: 2 } }}
        onChange={(e) => handleChange(e, 'b')}
      />
      </Tooltip>
      <FormControl size='small' fullWidth sx={{maxWidth: 150}}>
        <InputLabel id="season-label">Сезон</InputLabel>
        <Select
          labelId="season-label"
          id="state-select"
          value={season}
          label="Сезон"
          onChange={(e) => handleChange(e, 'season')}
        >
          <MenuItem value="">-</MenuItem>
          <MenuItem value="весна">Весна</MenuItem>
          <MenuItem value="літо">Літо</MenuItem>
          <MenuItem value="осінь">Осінь</MenuItem>
          <MenuItem value="зима">Зима</MenuItem>
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

export default GoodsSearch;