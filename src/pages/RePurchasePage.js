import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
// @mui
import {
  Box,
  Card,
  Checkbox,
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
  Typography
} from "@mui/material";
// components
import { useSelector } from "react-redux";
import * as moment from "moment";
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { RePurchaseListHead, RePurchaseListToolbar, RePurchaseOptions } from "../sections/@dashboard/repurchase";

import apiService from "../services/apiService";
import { BRAND_COLORS, F35_ROBOTS, F35_STATUS, F35_STATUS_COLORS, ROBOTS_VISUAL_DATA } from "../utils/constants";
import { getAbbreviation } from "../utils/functionsUtils";
import LetterAvatar from "../components/letter-avatar";
import { useDeleteSchedulesMutation } from "../redux/api/apiSlice";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'orderId', label: 'Order Id', alignRight: false },
  { id: 'orderStatus', label: 'Order Status', alignRight: false },
  { id: 'vendors', label: 'Vendors', alignRight: false },
  { id: 'scheduleStatus', label: 'Schedule Status', alignRight: false },
  { id: 'schedule', label: 'Robots', alignRight: false },
  // { id: 'note', label: 'Note', alignRight: false },
  { id: 'createdAt', label: 'Created', alignRight: false },
  { id: '' },
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
    return filter(array, (sched) => sched.orderId.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function RePurchasePage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [rePurchaseWithVendor, setRePurchaseWithVendor] = useState('');

  const [schedulesData, setSchedulesData] = useState([]);

  const [searchingOrders, setSearchingOrders] = useState(false);

  const [repurchasingOrders, setRepurchasingOrders] = useState(false);

  const f35SchedulesMetadata = useSelector((state) => state.appConfig.f35SchedulesMetadata);

  const [deleteSchedules, { isLoading: isDeletingSchedules }] = useDeleteSchedulesMutation();

  useEffect(() => {
    if (rePurchaseWithVendor && schedulesData && schedulesData.length > 0) {
      switch (rePurchaseWithVendor) {
        case 'amz': {
          selectSchedulesToRePurchase(F35_ROBOTS.ZINC_AMZ_ID);
          break;
        }
        case 'ebay': {
          selectSchedulesToRePurchase(F35_ROBOTS.EBAY_ID);
          break;
        }
        case 'wrt': {
          selectSchedulesToRePurchase(F35_ROBOTS.ZINC_WRT_ID);
          break;
        }
        case 'mira': {
          // todo
          break;
        }

        default:
          break;
      }
    }
  }, [rePurchaseWithVendor, schedulesData]);

  const deleteSchedulesAction = () => {
    deleteSchedules(selected)
      .then((response) => {
        console.log('Response from deleteSchedulesAction', response);
      })
      .catch((error) => {
        console.log('error from deleteSchedulesAction', error);
      });
  };

  const deleteSingleSchedule = (id) => {
    deleteSchedules([id])
      .then((response) => {
        console.log('Response from deleteSingleSchedule', response);
      })
      .catch((error) => {
        console.log('error from deleteSingleSchedule', error);
      });
  };

  const selectSchedulesToRePurchase = (robotId) => {
    const schedules = [...schedulesData];
    const robotSchedules = schedules.filter((sched) => sched.robot === robotId).map((sched) => sched.id);
    setSelected(robotSchedules);
  };

  const searchOrders = (orders) => {
    if (!orders) {
      console.log('No orders selected');
      return;
    }

    setSearchingOrders(true);
    apiService
      .getOrdersListSchedules(orders)
      .then((response) => {
        console.log('response from getOrdersListSchedules', response);
        if (response?.data) {
          setSchedulesData(response.data);
        }
      })
      .catch((error) => {
        console.log('error from getOrdersListSchedules', error);
      })
      .finally(() => {
        setSearchingOrders(false);
      });
  };

  const displayBrand = (schedule) => {
    if (schedule) {
      const brand = f35SchedulesMetadata.find((robot) => robot.id === schedule)?.group_code || 'mira';

      const tooltipText = getBrandTooltip(schedule.toString());
      return brand ? <Label customColor={getLabelData(brand).customColor}>{sentenceCase(tooltipText)}</Label> : <></>;
    }
    return <></>;
  };

  const getBrandTooltip = (schedules) => {
    const robotsIds = schedules ? schedules.trim().split(',') : [];
    const brands = robotsIds.map(
      (robotId) => f35SchedulesMetadata.find((robot) => robot.id === +robotId)?.group_name || 'mira'
    );
    const uniqueBrands = [...new Set(brands)];
    return uniqueBrands.join(', ');
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

  const displayRobots = (schedule) => {
    if (schedule) {
      const robotsIds = schedule ? [schedule.toString()] : [];
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
    }

    return <></>;
  };

  const getRobotInfo = (id) => {
    const robotName = f35SchedulesMetadata.find((robot) => robot.id === +id)?.method_code || 'mira';
    const robotData = ROBOTS_VISUAL_DATA.find(
      (r) => r.name.toLowerCase() === robotName.toLowerCase() || r.displayAvatarCode === robotName.toUpperCase()
    );
    return robotData ? { avatar: robotData.displayAvatarCode, color: robotData.color } : {};
  };

  const handleOpenMenu = (event, id) => {
    event.currentTarget.schedId = id;
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
      const newSelecteds = schedulesData.map((n) => n.id);
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
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterAction = (orders) => {
    setPage(0);
    searchOrders(orders);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - schedulesData.length) : 0;

  const filteredSchedules = applySortFilter(schedulesData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredSchedules.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Re-Purchase </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Re-Purchase Orders
          </Typography>

          <RePurchaseOptions vendorSelected={rePurchaseWithVendor} venderSelectedHandler={setRePurchaseWithVendor} />
        </Stack>

        <Card>
          <RePurchaseListToolbar
            numSelected={selected.length}
            onFilterOrdersChange={handleFilterAction}
            loading={searchingOrders}
            vendorSelected={rePurchaseWithVendor}
            onDeleteSchedules={deleteSchedulesAction}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RePurchaseListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={schedulesData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredSchedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, orderId, robot, orderStatus, scheduleStatus, created, note } = row;
                    const selectedSchedule = selected.indexOf(id) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedSchedule}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedSchedule} onChange={(event) => handleClick(event, id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Typography variant="subtitle2" noWrap>
                            {orderId}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">
                          <Label customColor={F35_STATUS_COLORS[orderStatus] || '#FFF'}>
                            {sentenceCase(F35_STATUS[orderStatus] || '')}
                          </Label>
                        </TableCell>

                        <TableCell align="left">{displayBrand(robot)}</TableCell>

                        <TableCell align="left">
                          <Label customColor={F35_STATUS_COLORS[scheduleStatus] || '#FFF'}>
                            {sentenceCase(F35_STATUS[scheduleStatus] || '')}
                          </Label>
                        </TableCell>

                        <TableCell align="center">{displayRobots(robot)}</TableCell>

                        <TableCell align="left">{created ? moment(created).format('YYYY-MM-DD HH:mm') : ''}</TableCell>

                        <TableCell align="center">
                          <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ color: 'rgb(64,157,95)' }} />
                            <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, id)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </Stack>
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
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={schedulesData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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

        <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteSingleSchedule(open.schedId)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
