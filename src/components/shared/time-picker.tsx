import React from 'react';
import CotopiaInput from '../shared-ui/c-input';

interface TimePickerProps {
  value?: string;
  onChange: (time: string | null) => void;
  format?: '12' | '24'; // 12-hour or 24-hour format
  className?: string;
  disabled?: boolean;
  label?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  format = '24',
  className = '',
  disabled = false,
  label,
}) => {
  // Convert 24-hour to 12-hour format for display
  const convertTo12HourFormat = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${suffix}`;
  };

  // Convert 12-hour to 24-hour format
  const convertTo24HourFormat = (time: string): string => {
    if (!time.includes('AM') && !time.includes('PM')) return time;
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let time = e.target.value;
    if (!time) {
      onChange(null);
      return;
    }
    if (format === '12') {
      time = convertTo24HourFormat(time);
    }
    onChange(time);
  };

  return (
    <CotopiaInput
      label={label}
      type="time"
      value={value ?? ''} // Handle null value correctly
      onChange={handleChange}
      className={`border p-2 rounded ${className}`}
      disabled={disabled}
      step="60"
    />
  );
};

export default TimePicker;
