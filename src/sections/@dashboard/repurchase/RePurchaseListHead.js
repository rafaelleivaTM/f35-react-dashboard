import PropTypes from "prop-types";
// @mui
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from "@mui/material";
import { useState } from "react"; // ----------------------------------------------------------------------
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

RePurchaseListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
  tableLoading: PropTypes.bool,
  searchAction: PropTypes.func,
  onSelectALlSchedules: PropTypes.func,
  onUnSelectAllSchedules: PropTypes.func,
};

export default function RePurchaseListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  tableLoading,
  searchAction,
  onSelectALlSchedules,
  onUnSelectAllSchedules,
}) {
  const [open, setOpen] = useState(null);

  const [isAllDoSelected, setAllDoSelected] = useState(false);
  const [isAllZincSelected, setAllZincSelected] = useState(false);
  const [isAllEbaySelected, setAllEbaySelected] = useState(false);
  const [isAllSuccessSchedulesSelected, setAllSuccessSchedulesSelected] = useState(false);
  const [isAllFailSchedulesSelected, setAllFailSchedulesSelected] = useState(false);
  const [isAllSuccessOrdersSelected, setAllSuccessOrdersSelected] = useState(false);
  const [isAllFailOrdersSelected, setAllFailOrdersSelected] = useState(false);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const handleRefresh = () => {
    searchAction();
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const toggleAllDo = () => {
    if (isAllDoSelected) {
      onUnSelectAllSchedules(8);
    } else {
      onSelectALlSchedules(8);
    }
    setAllDoSelected(!isAllDoSelected);
    handleCloseMenu();
  };

  const toggleAllZinc = () => {
    if (isAllZincSelected) {
      onUnSelectAllSchedules(14);
    } else {
      onSelectALlSchedules(14);
    }
    setAllZincSelected(!isAllZincSelected);
    handleCloseMenu();
  };

  const toggleAllEbay = () => {
    if (isAllEbaySelected) {
      onUnSelectAllSchedules(3);
    } else {
      onSelectALlSchedules(3);
    }
    setAllEbaySelected(!isAllEbaySelected);
    handleCloseMenu();
  };

  const toggleAllSuccessSchedules = () => {
    if (isAllSuccessSchedulesSelected) {
      console.log('unselect all success schedules');
    } else {
      console.log('select all success schedules');
    }
    setAllSuccessSchedulesSelected(!isAllSuccessSchedulesSelected);
    handleCloseMenu();
  };

  const toggleAllFailSchedules = () => {
    if (isAllFailSchedulesSelected) {
      console.log('unselect all fail schedules');
    } else {
      console.log('select all fail schedules');
    }
    setAllFailSchedulesSelected(!isAllFailSchedulesSelected);
    handleCloseMenu();
  };

  const toggleAllSuccessOrders = () => {
    if (isAllSuccessOrdersSelected) {
      console.log('unselect all success orders');
    } else {
      console.log('select all success orders');
    }
    setAllSuccessOrdersSelected(!isAllSuccessOrdersSelected);
    handleCloseMenu();
  };

  const toggleAllFailOrders = () => {
    if (isAllFailOrdersSelected) {
      console.log('unselect all fail orders');
    } else {
      console.log('select all fail orders');
    }
    setAllFailOrdersSelected(!isAllFailOrdersSelected);
    handleCloseMenu();
  };

  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Stack direction={'row'} alignItems={'center'} justifyContent={'start'} spacing={0}>
              <Checkbox
                size="small"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
              />
              <IconButton size="small" color="inherit" onClick={(event) => handleOpenMenu(event)}>
                <Iconify icon={'eva:more-vertical-fill'} />
              </IconButton>
            </Stack>
          </TableCell>
          {headLabel.map((headCell, index) => (
            <TableCell
              key={headCell.id}
              align={headCell.alignRight ? 'right' : 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {index === headLabel.length - 1 ? (
                <Stack direction={'row'} alignItems={'center'} justifyContent={'start'} spacing={3}>
                  <IconButton color={'error'} onClick={handleRefresh}>
                    <Iconify icon={'tabler:refresh'} />
                  </IconButton>
                  {tableLoading ? (
                    <CircularProgress size={25} sx={{ display: 'table' }} />
                  ) : (
                    <Box sx={{ width: '25px' }} />
                  )}
                </Stack>
              ) : (
                <TableSortLabel
                  hideSortIcon
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                  ) : null}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Typography variant={'subtitle2'} sx={{ p: 1, pl: 2 }}>
          Select/Unselect all
        </Typography>

        <Divider />

        <MenuItem onClick={toggleAllDo} sx={{ px: 1, py: 0 }}>
          <Checkbox checked={isAllDoSelected} size={'small'} />
          <Typography variant="caption">DO Schedules</Typography>
        </MenuItem>

        <MenuItem onClick={toggleAllZinc} sx={{ px: 1, py: 0 }}>
          <Checkbox checked={isAllZincSelected} size={'small'} />
          <Typography variant="caption">Zinc Schedules</Typography>
        </MenuItem>

        <MenuItem onClick={toggleAllEbay} sx={{ px: 1, py: 0 }}>
          <Checkbox checked={isAllEbaySelected} size={'small'} />
          <Typography variant="caption">Ebay Schedules</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={toggleAllSuccessSchedules} sx={{ px: 1, py: 0 }}>
          <Checkbox checked={isAllSuccessSchedulesSelected} size={'small'} />
          <Typography variant="caption">Success Schedules</Typography>
        </MenuItem>

        <MenuItem onClick={toggleAllFailSchedules} sx={{ px: 1, py: 0 }}>
          <Checkbox checked={isAllFailSchedulesSelected} size={'small'} />
          <Typography variant="caption">Failed Schedules</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={toggleAllSuccessOrders} sx={{ px: 1, py: 0 }}>
          <Checkbox checked={isAllSuccessOrdersSelected} size={'small'} />
          <Typography variant="caption">Success Orders</Typography>
        </MenuItem>

        <MenuItem onClick={toggleAllFailOrders} sx={{ px: 1, py: 0 }}>
          <Checkbox checked={isAllFailOrdersSelected} size={'small'} />
          <Typography variant="caption">Failed Orders</Typography>
        </MenuItem>
      </Popover>
    </>
  );
}
