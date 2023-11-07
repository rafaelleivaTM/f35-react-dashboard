import { Box, IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../iconify';
import { F35_ROBOTS, getScheduleCronInterval } from '../../utils/constants';
import { updateCronRefreshStatsInterval, updateCronRefreshStatsStatus } from '../../redux/appConfigSlice';
import { getDateFormatted } from '../../utils/formatTime';
import {
  useGetF35GeneralSummaryQuery,
  useGetSummaryEfficiencyByRobotQuery,
  useRobotsErrorInfoQuery,
} from '../../redux/api/apiSlice';

const CronRefreshStats = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const dateRange = useSelector((state) => state.dateRange);

  const schedulerTimeValue = useSelector((state) => state.appConfig.cronRefreshStatsInterval);
  const isCronActive = useSelector((state) => state.appConfig.cronRefreshStatsStatus);

  const [isSchedulerTimeInputValid, setIsSchedulerTimeInputValid] = useState(true);

  const date = getDateFormatted();
  const { refetch: refetchF35GeneralSummary } = useGetF35GeneralSummaryQuery(date);
  const { refetch: refetchDoSummaryStats } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.DO });
  const { refetch: refetchZincSummaryStats } = useGetSummaryEfficiencyByRobotQuery({
    date,
    robot: F35_ROBOTS.ZINC_AMZ,
  });
  const { refetch: refetchEbaySummaryStats } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.EBAY });
  const { refetch: refetchMiraSummaryStats } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.MIRA });
  const { refetch: refetchRobotsErrorInfo } = useRobotsErrorInfoQuery(dateRange, {
    skip: !dateRange,
  });
  // const { refetch: refetchIncomingOrdersByRange } = useGetIncomingOrdersByRange(dateRange, {
  //   skip: !dateRange,
  // });

  useEffect(() => {
    let intervalId;
    const interval = getScheduleCronInterval(schedulerTimeValue);
    if (!interval) setIsSchedulerTimeInputValid(false);
    else {
      setIsSchedulerTimeInputValid(true);
      if (isCronActive) {
        intervalId = setInterval(() => {
          console.log(`Update stats running every ${schedulerTimeValue}. Executed now! ${new Date()}`);

          refetchF35GeneralSummary();
          refetchDoSummaryStats();
          refetchZincSummaryStats();
          refetchEbaySummaryStats();
          refetchMiraSummaryStats();
          refetchRobotsErrorInfo();
          // refetchIncomingOrdersByRange();
        }, interval);
      }

      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [
    isCronActive,
    schedulerTimeValue,
    dispatch,
    refetchF35GeneralSummary,
    refetchDoSummaryStats,
    refetchZincSummaryStats,
    refetchEbaySummaryStats,
    refetchMiraSummaryStats,
    refetchRobotsErrorInfo,
    // refetchIncomingOrdersByRange,
  ]);

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
