import { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export const DateRangePickerToolbar = () => {
  const [currentAppDateRange, setCurrentAppDateRange] = useState([new Date(), new Date()]);
  const { afterToday } = DateRangePicker;

  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const onChangeRangeAction = (range) => {
    setCurrentAppDateRange(range);
    console.log(`On change event action; ${range}`);
  };

  return (
    <DateRangePicker
      appearance="subtle"
      disabledDate={afterToday()}
      defaultValue={currentAppDateRange}
      defaultCalendarValue={[lastMonth, now]}
      cleanable={false}
      placement={'autoVerticalEnd'}
      menuStyle={{ zIndex: 9999, marginTop: '.3rem' }}
      preventOverflow
      onChange={(range) => onChangeRangeAction(range)}
    />
  );
};
