import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';

LetterAvatar.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
};
function LetterAvatar({ name, color }) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar sx={{ p: 4, bgcolor: color, fontSize: '100%' }}>{name}</Avatar>
    </Stack>
  );
}

export default LetterAvatar;
