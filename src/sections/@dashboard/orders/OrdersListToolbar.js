import PropTypes from "prop-types";
// @mui
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
// component
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "../../../components/iconify";
import { parseSearchInput } from "../../../utils/functionsUtils";
import { searchOrdersUpdated } from "../../../redux/searchOrdersSlice";
import { useSearchOrdersInF35Query } from "../../../redux/api/apiSlice";

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})(({ theme, hasValue }) => ({
  width: hasValue ? '100%' : 240,
  marginRight: theme.spacing(3),
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

// ----------------------------------------------------------------------

OrdersListToolbar.propTypes = {
  numSelected: PropTypes.number,
  onFilterName: PropTypes.func,
};

export default function OrdersListToolbar({ numSelected, onFilterName }) {
  const inputRef = useRef();
  const buttonSearchRef = useRef();
  const dispatch = useDispatch();

  const searchOrders = useSelector((state) => state.searchOrders.searched);
  const [ordersInput, setOrdersInput] = useState(searchOrders ? searchOrders.join(', ') : '');
  const filter = useSelector((state) => state.searchOrders.filter);
  const { isFetching: loading } = useSearchOrdersInF35Query({ orders: ordersInput === '' ? [] : searchOrders, filter });

  const onChangeInputSearchValue = (event) => {
    if (event.target.value === '') {
      dispatch(searchOrdersUpdated([]));
      setOrdersInput('');
    } else {
      setOrdersInput(event.target.value);
    }
  };

  const handleSearch = () => {
    if (ordersInput && ordersInput.length > 0) {
      const orders = parseSearchInput(ordersInput);
      dispatch(searchOrdersUpdated(orders));
      onFilterName(ordersInput, filter);
    } else {
      setOrdersInput('');
      dispatch(searchOrdersUpdated([]));
    }
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mr: 2, width: '100%' }}>
          <StyledSearch
            value={ordersInput}
            ref={inputRef}
            onChange={onChangeInputSearchValue}
            placeholder="Search orders..."
            hasValue={searchOrders.length > 0}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Box sx={{ width: '30px' }}>{loading ? <CircularProgress size={30} /> : <></>}</Box>
            <Button
              variant="contained"
              color={'error'}
              ref={buttonSearchRef}
              disabled={ordersInput.length === 0}
              onClick={handleSearch}
              sx={{ minWidth: '115px' }}
              startIcon={<Iconify icon="eva:search-fill" />}
            >
              Search
            </Button>
          </Stack>
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
