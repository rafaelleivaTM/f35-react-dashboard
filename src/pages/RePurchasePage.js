import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography,
} from '@mui/material';
// components
import { useSelector } from 'react-redux';
import * as moment from 'moment';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { RePurchaseListHead, RePurchaseListToolbar, RePurchaseOptions } from '../sections/@dashboard/repurchase';

import apiService from '../services/apiService';
import { BRAND_COLORS, F35_ROBOTS, F35_STATUS, F35_STATUS_COLORS, ROBOTS_VISUAL_DATA } from '../utils/constants';
import { getAbbreviation } from '../utils/functionsUtils';
import LetterAvatar from '../components/letter-avatar';
import { api } from '../redux/api/apiSlice';
import UpdatePurchaseMethodScheduleDialog from '../sections/re-purchase/dialogs/UpdatePurchaseMethodScheduleDialog';

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

  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [rePurchaseWithVendor, setRePurchaseWithVendor] = useState('');

  const [searchOrders, setSearchOrders] = useState([]);

  const [schedulesData, setSchedulesData] = useState([]);

  const [confirmModalScheduleRemovalOpen, setConfirmModalScheduleRemovalOpen] = useState(false);
  const [confirmModalUpdateOrdersOpen, setConfirmModalUpdateOrdersOpen] = useState(false);

  const [searchingOrdersLoading, setSearchingOrdersLoading] = useState(false);

  const [openEditPurchaseMethodScheduleDialog, setOpenEditPurchaseMethodScheduleDialog] = useState(false);

  const handleClickOpenUpdatePurchaseMethodScheduleDialog = () => {
    setOpenEditPurchaseMethodScheduleDialog(true);
  };

  const handleClosePurchaseMethodScheduleDialog = () => {
    setOpenEditPurchaseMethodScheduleDialog(false);
  };

  const f35SchedulesMetadata = useSelector((state) => state.appConfig.f35SchedulesMetadata);

  const [deleteSchedules, { isLoading: isDeletingSchedules }] = api.endpoints.deleteSchedules.useMutation();

  const [updateOrdersToRePurchase, { isLoading: isUpdatingOrdersToRepurchase }] =
    api.endpoints.updateOrdersToRePurchase.useMutation();

  useEffect(() => {
    const selectSchedulesToRePurchase = (robotIds) => {
      const schedules = [...schedulesData];
      const robotSchedules = schedules.filter((sched) => robotIds.indexOf(sched.robot) > -1).map((sched) => sched.id);
      let orders = schedules.filter((sched) => robotIds.indexOf(sched.robot) > -1).map((sched) => sched.orderId);
      orders = [...new Set(orders)];
      setSelectedSchedules(robotSchedules);
      setSelectedOrders(orders);
    };

    const selectMIRASchedules = () => {
      const schedules = [...schedulesData];
      const robotSchedules = schedules.filter((sched) => sched.robot > 27).map((sched) => sched.id);
      let orders = schedules.filter((sched) => sched.robot > 27).map((sched) => sched.orderId);
      orders = [...new Set(orders)];
      setSelectedSchedules(robotSchedules);
      setSelectedOrders(orders);
    };

    if (rePurchaseWithVendor && schedulesData && schedulesData.length > 0) {
      switch (rePurchaseWithVendor) {
        case 'amz': {
          selectSchedulesToRePurchase([F35_ROBOTS.ZINC_AMZ_ID, 20]);
          break;
        }
        case 'ebay': {
          selectSchedulesToRePurchase([F35_ROBOTS.EBAY_ID]);
          break;
        }
        case 'wrt': {
          selectSchedulesToRePurchase([F35_ROBOTS.ZINC_WRT_ID]);
          break;
        }
        case 'mira': {
          selectMIRASchedules();
          break;
        }

        default:
          break;
      }
    }
  }, [rePurchaseWithVendor]);

  const handleConfirmDeleteSchedulesAction = () => {
    setConfirmModalScheduleRemovalOpen(true);
  };

  const deleteScheduleAction = () => {
    handleCloseConfirmScheduleRemovalModal();
    deleteSchedules(selectedSchedules)
      .then((response) => {
        if (response?.data && response.data.statusCode === 200) {
          searchOrdersTrigger();
          console.log('Response success from deleteSchedulesAction', response);
        } else {
          console.error('Response fail from deleteSchedulesAction', response);
        }
      })
      .catch((error) => {
        console.log('error from deleteSchedulesAction', error);
      });
  };

  const deleteSingleSchedule = (id) => {
    // deleteSchedules([id])
    //   .then((response) => {
    //     if (response?.data && response.data.statusCode === 200) {
    //       searchOrdersTrigger();
    //       console.log('Response success from deleteSingleSchedule', response);
    //     } else {
    //       console.error('Response fail from deleteSingleSchedule', response);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('error from deleteSingleSchedule', error);
    //   });
  };

  const handleConfirmUpdateOrdersToRepurchaseAction = () => {
    handleOpenConfirmUpdateOrdersModal();
  };

  const updateOrdersToRePurchaseAction = () => {
    handleCloseConfirmUpdateOrdersModal();
    updateOrdersToRePurchase(selectedOrders)
      .then((response) => {
        if (response?.data && response.data.statusCode === 200) {
          console.log('Response success from updateOrdersToRePurchase', response);
          searchOrdersTrigger();
        } else {
          console.log('Response fail from updateOrdersToRePurchase', response);
        }
      })
      .catch((error) => {
        console.log('error from updateOrdersToRePurchase', error);
      });
  };

  const editSingleSchedule = (schedId) => {
    setSelectedSchedules([schedId]);
    const order = schedulesData.find((sched) => sched.id === schedId).orderId;
    setSelectedOrders([order]);
    handleClickOpenUpdatePurchaseMethodScheduleDialog();
    setOpen(false);
  };

  const searchOrdersTrigger = () => {
    searchOrdersAction(searchOrders);
  };

  const searchOrdersAction = (orders) => {
    if (!orders) {
      console.log('No orders selected');
      return;
    }

    setSearchingOrdersLoading(true);
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
        setSearchingOrdersLoading(false);
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
      const newSelects = schedulesData.map((n) => n.id);
      setSelectedSchedules(newSelects);
      let orders = schedulesData.map((n) => n.orderId);
      orders = [...new Set(orders)];
      setSelectedOrders(orders);
      return;
    }
    setSelectedSchedules([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selectedSchedules.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedSchedules, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedSchedules.slice(1));
    } else if (selectedIndex === selectedSchedules.length - 1) {
      newSelected = newSelected.concat(selectedSchedules.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedSchedules.slice(0, selectedIndex),
        selectedSchedules.slice(selectedIndex + 1)
      );
    }
    setSelectedSchedules(newSelected);
    let orders = schedulesData.filter((s) => newSelected.indexOf(s.id) > -1).map((s) => s.orderId);
    orders = [...new Set(orders)];
    setSelectedOrders(orders);
  };

  const handleSelectAllSchedules = (robotId) => {
    console.log('Select all', robotId);
  };

  const handleUnSelectAllSchedules = (robotId) => {
    console.log('Unselect all', robotId);
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
    searchOrdersAction(orders);
  };

  const handleCloseConfirmScheduleRemovalModal = () => {
    setConfirmModalScheduleRemovalOpen(false);
  };

  const handleOpenConfirmUpdateOrdersModal = () => {
    setConfirmModalUpdateOrdersOpen(true);
  };

  const handleCloseConfirmUpdateOrdersModal = () => {
    setConfirmModalUpdateOrdersOpen(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - schedulesData.length) : 0;

  const filteredSchedules = applySortFilter(schedulesData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredSchedules.length && !!filterName;

  const handleSeeOrderDetails = (orderId) => {
    // navigate(`/dashboard/order-details/${orderId}`);
    const url = `/dashboard/order-details/${orderId}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Helmet>
        <title> Re-Purchase </title>
      </Helmet>

      <Container maxWidth={'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Re-Purchase Orders
          </Typography>

          <RePurchaseOptions vendorSelected={rePurchaseWithVendor} venderSelectedHandler={setRePurchaseWithVendor} />
        </Stack>

        <Card>
          <RePurchaseListToolbar
            numSelected={selectedSchedules.length}
            onFilterOrdersChange={handleFilterAction}
            vendorSelected={rePurchaseWithVendor}
            onUpdateSchedule={handleClickOpenUpdatePurchaseMethodScheduleDialog}
            onDeleteSchedules={handleConfirmDeleteSchedulesAction}
            onUpdateOrders={handleConfirmUpdateOrdersToRepurchaseAction}
            deletingSchedules={isDeletingSchedules}
            updatingOrders={isUpdatingOrdersToRepurchase}
            searchOrders={searchOrders}
            selectedOrders={selectedOrders}
            setSearchOrders={setSearchOrders}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RePurchaseListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={schedulesData.length}
                  numSelected={selectedSchedules.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  tableLoading={searchingOrdersLoading || isDeletingSchedules || isUpdatingOrdersToRepurchase}
                  searchAction={searchOrdersTrigger}
                  onSelectALlSchedules={handleSelectAllSchedules}
                  onUnSelectAllSchedules={handleUnSelectAllSchedules}
                />
                <TableBody>
                  {filteredSchedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, orderId, robot, orderStatus, scheduleStatus, created } = row;
                    const selectedSchedule = selectedSchedules.indexOf(id) !== -1;

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
                            {/* <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ color: 'rgb(64,157,95)' }} /> */}
                            <IconButton size="large" color="inherit" onClick={() => handleSeeOrderDetails(orderId)}>
                              <Iconify icon={'mdi:eye'} />
                            </IconButton>
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
        <MenuItem onClick={() => editSingleSchedule(open.schedId)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteSingleSchedule(open.schedId)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={confirmModalScheduleRemovalOpen} onClose={handleCloseConfirmScheduleRemovalModal}>
        <DialogTitle>Confirm schedules removal</DialogTitle>
        <DialogContent>
          <Typography variant={'body2'} color={'textSecondary'}>
            {`You will delete some schedules to create a re-purchase with ${rePurchaseWithVendor.toUpperCase()}. This process can not be undone.`}
          </Typography>
          <Typography variant={'body2'} color={'textSecondary'} sx={{ mt: 2 }}>
            {`${selectedSchedules?.length} schedules will be deleted. Please confirm to continue.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmScheduleRemovalModal}>Cancel</Button>
          <Button onClick={deleteScheduleAction} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmModalUpdateOrdersOpen} onClose={handleCloseConfirmUpdateOrdersModal}>
        <DialogTitle>Confirm update orders to re-purchase</DialogTitle>
        <DialogContent>
          <Typography variant={'body2'} color={'textSecondary'}>
            {`You will update the orders to BUYING to create a re-purchase with ${rePurchaseWithVendor.toUpperCase()}. This process can not be undone.`}
          </Typography>
          <Typography variant={'body2'} color={'textSecondary'} sx={{ mt: 2 }}>
            {`${selectedOrders?.length} orders will be updated. Please confirm to continue.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmUpdateOrdersModal}>Cancel</Button>
          <Button onClick={updateOrdersToRePurchaseAction} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <UpdatePurchaseMethodScheduleDialog
        open={openEditPurchaseMethodScheduleDialog}
        onClose={handleClosePurchaseMethodScheduleDialog}
        selectedSchedules={selectedSchedules}
        onSubmitSchedule={searchOrdersTrigger}
      />
    </>
  );
}
