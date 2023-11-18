import PropTypes from "prop-types";
// @mui
import { alpha, styled } from "@mui/material/styles";
import { Button, InputAdornment, OutlinedInput, Stack, Toolbar, Typography } from "@mui/material";
// component
import { useRef, useState } from "react";
import Iconify from "../../../components/iconify";
import { parseSearchInput } from "../../../utils/functionsUtils";

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

RePurchaseListToolbar.propTypes = {
  numSelected: PropTypes.number,
  onFilterOrdersChange: PropTypes.func,
  onDeleteSchedules: PropTypes.func,
  onUpdateOrders: PropTypes.func,
  onUpdateSchedule: PropTypes.func,
  loading: PropTypes.bool,
  deletingSchedules: PropTypes.bool,
  updatingOrders: PropTypes.bool,
  removeSchedulesDone: PropTypes.bool,
  updateOrdersDone: PropTypes.bool,
  vendorSelected: PropTypes.string,
  searchOrders: PropTypes.array,
  selectedOrders: PropTypes.array,
  setSearchOrders: PropTypes.func,
};

export default function RePurchaseListToolbar({
  numSelected,
  onFilterOrdersChange,
  onDeleteSchedules,
  onUpdateOrders,
  onUpdateSchedule,
  searchOrders,
  selectedOrders,
  setSearchOrders,
}) {
  const inputRef = useRef();

  const [inputSearchValue, setInputSearchValue] = useState('');

  const onChangeInputSearchValue = (event) => {
    if (event.target.value === '') {
      inputRef.current.querySelector('input').blur();
    } else {
      const orders = parseSearchInput(event.target.value);
      setSearchOrders(orders);
      inputRef.current.focus();
    }
    setInputSearchValue(event.target.value);
  };

  const handleSearch = () => {
    onFilterOrdersChange(searchOrders);
  };

  const handleDeleteScheduleAction = () => {
    onDeleteSchedules();
  };

  const handleUpdateOrdersAction = () => {
    onUpdateOrders();
  };

  const handleUpdateScheduleAction = () => {
    onUpdateSchedule();
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
          {numSelected && numSelected > 1 ? `${numSelected} selected orders` : `${numSelected} selected order`}
        </Typography>
      ) : (
        <StyledSearch
          ref={inputRef}
          value={inputSearchValue}
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
        <Stack direction={'row'} spacing={3}>
          {/* <Button */}
          {/*  variant="contained" */}
          {/*  color={'error'} */}
          {/*  startIcon={<Iconify icon="eva:trash-2-fill" />} */}
          {/*  onClick={handleDeleteScheduleAction} */}
          {/*  disabled={selectedOrders.length === 0} */}
          {/* > */}
          {/*  Delete Schedules */}
          {/* </Button> */}
          <Button
            variant="contained"
            color={'warning'}
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={handleUpdateScheduleAction}
            disabled={selectedOrders.length === 0}
          >
            Update Schedules
          </Button>
          <Button
            variant="contained"
            color={'primary'}
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={handleUpdateOrdersAction}
            disabled={selectedOrders.length === 0}
          >
            Update Orders
          </Button>
        </Stack>
      ) : (
        <Stack direction={'row'} spacing={2}>
          <Button
            variant="contained"
            color={'error'}
            disabled={!searchOrders?.length}
            onClick={handleSearch}
            startIcon={<Iconify icon="eva:search-fill" />}
            sx={{ minWidth: '105px' }}
          >
            Search
          </Button>
        </Stack>
      )}
    </StyledRoot>
  );
}
