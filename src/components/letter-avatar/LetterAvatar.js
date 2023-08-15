import React from 'react';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';

LetterAvatar.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
};

function LetterAvatar({ name, color }) {
  return <Avatar sx={{ p: 1, bgcolor: color, fontSize: '60%', fontWeight: 'bold' }}>{name}</Avatar>;
}

export default LetterAvatar;
