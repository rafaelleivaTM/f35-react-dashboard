import React from 'react';
import { MaskedInput } from 'rsuite';

const NumberMask = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /[mhd]/]}
      placeholderChar={'\u2000'}
    />
  );
};

export default NumberMask;
