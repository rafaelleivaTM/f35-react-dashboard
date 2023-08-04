import { useEffect } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { dateRangeUpdated } from '../../../redux/dateRangeSlide';

export const DateRangePickerToolbar = () => {
  const dateRange = useSelector((state) => state.dateRange);
  const dispatch = useDispatch();

  const { afterToday } = DateRangePicker;

  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  useEffect(() => {
    console.log(`El valor del rango ha sido cambiado en el store ${JSON.stringify(dateRange)}`);
  }, [dateRange]);

  const onChangeRangeAction = (range) => {
    dispatch(
      dateRangeUpdated({
        startDate: range[0].toISOString(),
        endDate: range[1].toISOString(),
      })
    );
  };

  return (
    <DateRangePicker
      appearance="subtle"
      disabledDate={afterToday()}
      defaultValue={[new Date(dateRange.startDate), new Date(dateRange.endDate)]}
      defaultCalendarValue={[lastMonth, now]}
      cleanable={false}
      placement={'autoVerticalEnd'}
      menuStyle={{ zIndex: 9999, marginTop: '.3rem' }}
      preventOverflow
      onChange={(range) => onChangeRangeAction(range)}
    />
  );
};
