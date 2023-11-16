import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  FormControlLabel,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import apiService from '../../services/apiService';
import Iconify from '../../components/iconify';
import { parseSearchInput } from '../../utils/functionsUtils';
import { SOCKET } from '../../App';
import Scrollbar from '../../components/scrollbar';

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
  const [importCompleted, setImportCompleted] = useState(false);
  const [ordersImportResults, setOrdersImportResults] = useState([]);
  const [syncOrders, setSyncOrders] = useState(false);

  const [open, setOpen] = React.useState({});

  const handleClick = (item) => {
    setOpen((prevState) => ({ ...prevState, [item]: !prevState[item] }));
  };

  useEffect(() => {
    const handleImportedOrder = (data) => {
      setOrdersImportResults((prev) => [...prev, data]);
      console.log(`ImportedOrder event`, data);
    };

    const handleImportedOrderFinish = (data) => {
      console.log(`ImportedOrderFinish event`, data);
    };

    SOCKET.on('ImportedOrder', handleImportedOrder);
    SOCKET.on('ImportedOrderFinish', handleImportedOrderFinish);

    // Devuelve una función de limpieza que se ejecutará cuando el componente se desmonte
    // o antes de que se vuelva a ejecutar el efecto
    return () => {
      SOCKET.off('ImportedOrder', handleImportedOrder);
      SOCKET.off('ImportedOrderFinish', handleImportedOrderFinish);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setImportCompleted(false);
    setLoading(true);
    setOrdersImportResults([]);
    apiService
      .importOrders(orders, syncOrders)
      .then((response) => {
        console.log('response from importOrders', response);
        if (response?.data && response.statusCode === 200) {
          setOrders('');
          inputRef.current.querySelector('input').value = '';
          setImportCompleted(true);
        } else {
          setImportCompleted(false);
        }
      })
      .catch((error) => {
        console.log('error from importOrders', error);
        setImportCompleted(false);
      })
      .finally(() => {
        setLoading(false);
        setSyncOrders(false);
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
    setImportCompleted(false);
    setOrdersImportResults([]);
  };

  const importResult = ordersImportResults.reduce((acc, item) => {
    if (acc[item.order]) {
      acc[item.order].push({
        tableName: item.tableName,
        importResults: item.importResults,
        error: item.error,
      });
    } else {
      acc[item.order] = [
        {
          tableName: item.tableName,
          importResults: item.importResults,
          error: item.error,
        },
      ];
    }

    return acc;
  }, {});

  const getImportFinishMessage = () => {
    if (hasErrorInImports) {
      return 'Import finish with errors';
    }
    return 'Import finish';
  };

  const hasErrorInImports = ordersImportResults.some((item) => item.error);

  return (
    <Card>
      <CardHeader
        title={'Import Orders'}
        action={
          loading ? (
            <CircularProgress size={30} />
          ) : importCompleted ? (
            <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ color: 'rgb(64,157,95)' }} />
          ) : (
            <></>
          )
        }
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center', m: 0, display: 'flex' } }}
      />

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
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
            <Box>
              <Button type="submit" color={'error'} variant="contained" disabled={!orders}>
                Import
              </Button>
            </Box>
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ my: 3 }}>
            <Typography variant={'caption'} sx={{ color: hasErrorInImports ? 'rgb(248,29,56)' : 'inherit' }}>
              {loading ? 'Importing' : ordersImportResults.length === 0 ? 'Start process' : getImportFinishMessage()}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={syncOrders}
                  size={'small'}
                  onChange={(event) => setSyncOrders(event.target.checked)}
                />
              }
              label="Sync tables"
            />
          </Stack>
        </form>

        <Scrollbar sx={{ height: { xs: 240, sm: 350, lg: 450 } }}>
          <Stack spacing={1} sx={{ p: 0 }}>
            {importResult &&
              Object.keys(importResult).map((order, index) => (
                <React.Fragment key={order}>
                  <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {order}
                      </ListSubheader>
                    }
                  >
                    {importResult[order] &&
                      importResult[order].map((item, indexN) => (
                        <React.Fragment key={indexN}>
                          <ListItemButton onClick={() => (item.error ? handleClick(item.tableName) : null)}>
                            <ListItemIcon>
                              {item.error ? (
                                <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ color: 'rgb(248,29,56)' }} />
                              ) : (
                                <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ color: 'rgb(64,157,95)' }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={`${item.tableName} ${
                                item?.importResults ? `(${item?.importResults?.join(', ')})` : ''
                              }`}
                              size={'small'}
                            />
                            {item.error && (
                              <Icon icon="material-symbols:chevron-right" rotate={open[item.tableName] ? 3 : 1} />
                            )}
                          </ListItemButton>
                          {item.error && (
                            <Collapse in={open[item.tableName]} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                  <ListItemText
                                    primary={`Code: ${item.error.original.code}, Message: ${item.error.original.sqlMessage}`}
                                  />
                                </ListItemButton>
                              </List>
                            </Collapse>
                          )}
                        </React.Fragment>
                      ))}
                    {index + 1 < Object.keys(importResult).length && <Divider sx={{ mt: 2 }} />}
                  </List>
                </React.Fragment>
              ))}
          </Stack>
        </Scrollbar>
      </CardContent>
    </Card>
  );
};

export default ImportOrdersForm;
