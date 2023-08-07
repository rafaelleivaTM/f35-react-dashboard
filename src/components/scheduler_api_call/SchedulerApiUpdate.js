import { Box, IconButton, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Iconify from '../iconify';
import { TIME_INTERVAL } from '../../utils/constants';

const SchedulerApiUpdater = () => {
  const theme = useTheme();
  const [isCronActive, setIsCronActive] = useState(false);
  const [schedulerTimeValue, setSchedulerTimeValue] = useState('30m');
  const [schedulerInterval, setSchedulerInterval] = useState(TIME_INTERVAL.m(30));
  const [isSchedulerTimeInputValid, setIsSchedulerTimeInputValid] = useState(true);

  const getScheduleInputValue = (event) => {
    if (!event.target.value) return;
    const value = event.target.value.toLowerCase();
    let number;
    let time;
    const regex = /^\d+[mhd]$/;
    try {
      if (!regex.test(value)) {
        throw new Error('Scheduler input is incorrect');
      }
      time = value.charAt(value.length - 1);
      if (time !== 'm' && time !== 'h' && time !== 'd') throw new Error('Time is incorrect');
      number = parseInt(value.substr(0, value.length - 1), 10);
      if (Number.isNaN(number) || number === 0) throw new Error('Number is incorrect');

      setSchedulerInterval(TIME_INTERVAL[time](number));
      setIsSchedulerTimeInputValid(true);
    } catch (e) {
      setIsSchedulerTimeInputValid(false);
      // clearInterval(scheduleCron)
    }
  };

  const ToggleScheduler = () => {
    setIsCronActive(!isCronActive);
  };

  return (
    <Box sx={{ width: 120 }}>
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
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

export default SchedulerApiUpdater;
