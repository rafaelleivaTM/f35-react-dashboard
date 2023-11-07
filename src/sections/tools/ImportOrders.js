import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
  Stack,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import apiService from '../../services/apiService';
import Iconify from '../../components/iconify';
import { parseSearchInput } from '../../utils/functionsUtils';
import { SOCKET } from '../../App';

const StyledSearch = styled(OutlinedInput, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})(({ theme, hasValue }) => ({
  width: hasValue ? '100%' : 240,
  marginRight: theme.spacing(2),
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: '100%',
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

const ImportOrdersForm = () => {
  const inputRef = useRef();
  const [orders, setOrders] = useState('');
  const [loading, setLoading] = useState(false);
  const [successFullImport, setSuccessFullImport] = useState(false);

  useEffect(() => {
    SOCKET.on('ImportedOrder', (data) => {
      console.log(`ImportedOrder event`, data);
    });
    SOCKET.on('ImportedOrderFinish', (data) => {
      console.log(`ImportedOrder event`, data);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessFullImport(false);
    setLoading(true);
    apiService
      .importOrders(orders)
      .then((response) => {
        console.log('response from importOrders', response);
        if (response?.data && response.statusCode === 200) {
          setOrders('');
          inputRef.current.querySelector('input').value = '';
          setSuccessFullImport(true);
        } else {
          setSuccessFullImport(false);
        }
      })
      .catch((error) => {
        console.log('error from importOrders', error);
        setSuccessFullImport(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeInputSearchValue = (event) => {
    if (event.target.value === '') {
      inputRef.current.querySelector('input').blur();
    } else {
      const orders = parseSearchInput(event.target.value);
      setOrders(orders);
      inputRef.current.focus();
    }
  };

  return (
    <Card>
      <CardHeader
        title={'Import Orders'}
        action={
          loading ? (
            <CircularProgress size={30} />
          ) : successFullImport ? (
            <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ color: 'rgb(64,157,95)' }} />
          ) : (
            <></>
          )
        }
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center', m: 0, display: 'flex' } }}
      />

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <StyledSearch
              ref={inputRef}
              onChange={onChangeInputSearchValue}
              placeholder="Enter orders..."
              hasValue={orders.length > 0}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:cloud-download-outline" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
            />
            <Button type="submit" color={'error'} variant="contained" disabled={!orders}>
              Import
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImportOrdersForm;
