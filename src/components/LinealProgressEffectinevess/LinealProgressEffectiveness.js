import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const LinealProgressEffectiveness = ({ total, value }) => (
  <Stack width={'100%'}>
    <Typography variant="body2" color="text.secondary">
      {`Effectiveness of ${total}`}
    </Typography>
    <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  </Stack>
);

LinealProgressEffectiveness.propTypes = {
  total: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export default LinealProgressEffectiveness;
