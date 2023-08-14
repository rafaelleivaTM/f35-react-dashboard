import PropTypes from "prop-types";
// @mui
import { alpha, styled } from "@mui/material/styles";
import {
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
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "../../../components/iconify";
import { parseSearchInput } from "../../../utils/functionsUtils";
import { searchOrdersUpdated } from "../../../redux/searchOrdersSlice";

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

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  loading: PropTypes.bool,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ numSelected, loading, onFilterName }) {
  const inputRef = useRef();
  const dispatch = useDispatch();

  const searchOrders = useSelector((state) => state.searchOrders.searched);
  const filter = useSelector((state) => state.searchOrders.filter);
  const listedOrders = useSelector((state) => state.searchOrders.list);

  useEffect(() => {
    if (searchOrders.length === 0 && listedOrders.length > 0) return;
    const isSearchOrdersInListedOrders = searchOrders.every((searchOrder) =>
      listedOrders.some((listedOrder) => listedOrder.orderId === searchOrder)
    );
    if (isSearchOrdersInListedOrders && listedOrders.length > 0 && searchOrders.length > 0) return;
    onFilterName(searchOrders, filter);
  }, [searchOrders, listedOrders, filter, onFilterName]);

  const onChangeInputSearchValue = (event) => {
    if (event.target.value === '') {
      dispatch(searchOrdersUpdated([]));
      inputRef.current.querySelector('input').blur();
    } else {
      const orders = parseSearchInput(event.target.value);
      dispatch(searchOrdersUpdated(orders));
      onFilterName(orders, filter);
      inputRef.current.focus();
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
        <StyledSearch
          value={searchOrders.join(',')}
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
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack direction={'row'} spacing={2} alignSelf={'center'}>
          {loading ? <CircularProgress size={30} /> : <></>}
          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </StyledRoot>
  );
}
