import { Box, IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../iconify';
import { getScheduleCronInterval } from '../../utils/constants';
import { updateCronRefreshStatsInterval, updateCronRefreshStatsStatus } from '../../redux/appConfigSlide';
import {
  fetchDOOrdersStats,
  fetchEbayOrdersStats,
  fetchF35GeneralSummaryToday,
  fetchMiraOrdersStats,
  fetchRobotsErrorInfo,
  fetchZincOrdersStats,
} from '../../services/apiCalls';

const CronRefreshStats = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const schedulerTimeValue = useSelector((state) => state.appConfig.cronRefreshStatsInterval);
  const isCronActive = useSelector((state) => state.appConfig.cronRefreshStatsStatus);

  const [isSchedulerTimeInputValid, setIsSchedulerTimeInputValid] = useState(true);

  useEffect(() => {
    let intervalId;
    const interval = getScheduleCronInterval(schedulerTimeValue);
    if (!interval) setIsSchedulerTimeInputValid(false);
    else {
      setIsSchedulerTimeInputValid(true);
      if (isCronActive) {
        intervalId = setInterval(() => {
          console.log(`Update stats running every ${schedulerTimeValue}. Executed now! ${new Date()}`);

          fetchF35GeneralSummaryToday(dispatch).then();
          fetchRobotsErrorInfo(dispatch).then();
          fetchDOOrdersStats(dispatch).then();
          fetchZincOrdersStats(dispatch).then();
          fetchEbayOrdersStats(dispatch).then();
          fetchMiraOrdersStats(dispatch).then();
        }, interval);
      }

      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [isCronActive, schedulerTimeValue, dispatch]);

  const getScheduleInputValue = (event) => {
    if (!event.target.value) return;
    const value = event.target.value.toLowerCase();
    dispatch(updateCronRefreshStatsInterval({ cronRefreshStatsInterval: value }));
  };

  const ToggleScheduler = () => {
    dispatch(updateCronRefreshStatsStatus({ cronRefreshStatsStatus: !isCronActive }));
  };

  return (
    <Box sx={{ width: 115 }}>
      <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
        <TextField
          size={'small'}
          placeholder={'30m'}
          defaultValue={schedulerTimeValue}
          inputProps={{
            style: {
              fontSize: '0.8rem',
              color: !isSchedulerTimeInputValid
                ? theme.palette.error.main
                : isCronActive
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
            },
          }}
          onChange={getScheduleInputValue}
        />
        <IconButton
          sx={{
            padding: 0,
            width: 44,
            height: 44,
            // ...(isSchedulerButtonActive && {
            //   bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
            // }),
          }}
          disabled={!isSchedulerTimeInputValid}
          onClick={ToggleScheduler}
        >
          <Iconify icon={isCronActive ? 'mdi:clock' : 'mdi:clock-outline'} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default CronRefreshStats;
