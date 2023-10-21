import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState } from "react";
// @mui
import {
  Box,
  Card,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material"; // components
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar"; // sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user"; // mock
import USERLIST from "../_mock/user";
import { searchOrdersFilterUpdated } from "../redux/searchOrdersSlice";
import { BRAND_COLORS, F35_STATUS, F35_STATUS_COLORS, ROBOTS_VISUAL_DATA } from "../utils/constants";
import LetterAvatar from "../components/letter-avatar";
import { getAbbreviation } from "../utils/functionsUtils";
import { useSearchOrdersInF35Query } from "../redux/api/apiSlice";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'brands' },
  { id: 'orderId', label: 'Order Id', alignRight: false },
  { id: 'so', label: 'SO', alignRight: false },
  { id: 'warehouseId', label: 'Warehouse', alignRight: false },
  { id: 'orderStatus', label: 'Status', alignRight: false },
  // { id: 'customerEmail', label: 'Email', alignRight: false },
  { id: 'schedules', label: 'Robots', alignRight: false },
  // { id: 'schedulesStatuses', label: 'Robots Status', alignRight: false },
  { id: 'createdAt', label: 'Created', alignRight: false },
  { id: 'action' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const f35SchedulesMetadata = useSelector((state) => state.appConfig.f35SchedulesMetadata);
  const warehouseMetadata = useSelector((state) => state.appConfig.warehouseMetadata);
  const searchOrders = useSelector((state) => state.searchOrders.searched);
  const filter = useSelector((state) => state.searchOrders.filter);

  let { data: listedOrders } = useSearchOrdersInF35Query({
    orders: searchOrders,
    filter,
  });
  listedOrders = listedOrders || [];

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage] = useState(filter.paginator.rowsPerPage || 50);

  // const [orderList, setOrderList] = useState([]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    // filter.paginator.rowsPerPage = parseInt(event.target.value, 10);
    dispatch(
      searchOrdersFilterUpdated({
        ...filter,
        paginator: { ...filter.paginator, rowsPerPage: parseInt(event.target.value, 10) },
      })
    );
  };

  const handleFilterByName = (searchOrders, filter) => {
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleIconClick = (orderId) => {
    navigate(`/dashboard/order-details/${orderId}`);
  };

  const getRobotInfo = (id) => {
    const robotName = f35SchedulesMetadata.find((robot) => robot.id === id)?.method_code || 'mira';
    const robotData = ROBOTS_VISUAL_DATA.find(
      (r) => r.name.toLowerCase() === robotName.toLowerCase() || r.displayAvatarCode === robotName.toUpperCase()
    );
    return robotData ? { avatar: robotData.displayAvatarCode, color: robotData.color } : {};
  };

  const displayRobots = (schedules) => {
    const robotsIds = schedules ? schedules.trim().split(',') : [];
    return (
      <Stack spacing={1} direction={'row'}>
        {robotsIds
          .map((robotId, index) => ({ info: getRobotInfo(robotId), index }))
          .filter(({ info }) => info)
          .map(({ info, index }) => (
            <Box key={index}>
              <LetterAvatar name={info.avatar} color={info.color} />
            </Box>
          ))}
      </Stack>
    );
  };

  const getLabelData = (brand) => {
    try {
      const registerBrand = BRAND_COLORS.find((b) => b.code === brand);
      const customColor = registerBrand
        ? registerBrand.color
        : ROBOTS_VISUAL_DATA.find((r) => r.name === 'MIRA')?.color;
      const label = registerBrand ? brand : getAbbreviation(brand);
      if (!label) {
        throw new Error(`Label is not defined for brand: ${brand}`);
      }
      return { customColor, label };
    } catch (e) {
      console.log(`Error getLabelData of brand: ${brand}`);
      console.log(e);
      return { customColor: 'rgba(62,61,61,0.33)', label: brand };
    }
  };

  const getBrandTooltip = (schedules) => {
    const robotsIds = schedules ? schedules.trim().split(',') : [];
    const brands = robotsIds.map(
      (robotId) => f35SchedulesMetadata.find((robot) => robot.id === robotId)?.group_name || 'mira'
    );
    const uniqueBrands = [...new Set(brands)];
    return uniqueBrands.join(', ');
  };

  const displayBrands = (schedules) => {
    const robotsIds = schedules ? schedules.trim().split(',') : [];
    const brands = robotsIds.map(
      (robotId) => f35SchedulesMetadata.find((robot) => robot.id === robotId)?.group_code || 'mira'
    );
    const uniqueBrands = [...new Set(brands)];
    const tooltipText = getBrandTooltip(schedules);
    return (
      <Stack>
        {uniqueBrands.map((brand, index) =>
          brand ? (
            <Tooltip key={index} title={tooltipText}>
              <Label customColor={getLabelData(brand).customColor}>{sentenceCase(getLabelData(brand).label)}</Label>
            </Tooltip>
          ) : (
            <></>
          )
        )}
      </Stack>
    );
  };

  const getWareHouseName = (id) => warehouseMetadata.find((w) => w.id === id)?.name;

  return (
    <>
      <Helmet>
        <title> Orders </title>
      </Helmet>

      <Container maxWidth={'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Orders
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}> */}
          {/*  New User */}
          {/* </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listedOrders?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {listedOrders.map((row) => {
                    const {
                      id,
                      orderId,
                      so,
                      warehouseId,
                      orderStatus,
                      customerEmail,
                      schedules,
                      schedulesStatuses,
                      createdAt,
                    } = row;
                    const selectedUser = selected.indexOf(id) !== -1;
                    if (orderId === '201540021') {
                      console.log('row', row);
                    }

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {/* <TableCell padding="checkbox"> */}
                        {/*  <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} /> */}
                        {/* </TableCell> */}
                        <TableCell padding="checkbox">{displayBrands(schedules)}</TableCell>

                        <TableCell component="th" scope="row">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {orderId}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{so}</TableCell>

                        <TableCell align="left">{getWareHouseName(warehouseId)}</TableCell>

                        <TableCell align="left">
                          <Label customColor={F35_STATUS_COLORS[orderStatus]}>
                            {sentenceCase(F35_STATUS[orderStatus])}
                          </Label>
                        </TableCell>

                        {/* <TableCell align="left">{customerEmail}</TableCell> */}

                        <TableCell align="center">{displayRobots(schedules)}</TableCell>

                        {/* <TableCell align="left">{schedulesStatuses}</TableCell> */}

                        <TableCell align="left">{createdAt}</TableCell>

                        {/* <TableCell align="right"> */}
                        {/* <IconButton size="large" color="inherit" onClick={handleOpenMenu}> */}
                        {/*  <Iconify icon={'eva:more-vertical-fill'} /> */}
                        {/* </IconButton> */}
                        {/* </TableCell> */}
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={() => handleIconClick(orderId)}>
                            <Iconify icon={'mdi:eye'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={listedOrders?.length}
            rowsPerPage={filter?.paginator?.rowsPerPage || 50}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-displayedRows': {
                display: 'none',
              },
            }}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
