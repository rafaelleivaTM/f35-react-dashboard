import PropTypes from "prop-types";
// @mui
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "@mui/material";
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

OrdersListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
  onUpdateTableData: PropTypes.func,
  tableLoading: PropTypes.bool,
};

export default function OrdersListHead({ order, orderBy, headLabel, onRequestSort, onUpdateTableData, tableLoading }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const handleRefresh = () => {
    onUpdateTableData();
  };

  return (
    <TableHead>
      <TableRow>
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
  );
}
