declare module 'react-date-range' {
  import * as React from 'react';

  export interface Range {
    startDate: Date;
    endDate: Date;
    key?: string;
  }

  export const DateRange: React.ComponentType<{
    ranges?: Range[];
    onChange?: (ranges: any) => void;
    moveRangeOnFirstSelection?: boolean;
    editableDateInputs?: boolean;
    [key: string]: any;
  }>;

  export const DateRangePicker: React.ComponentType<any>;
  export const Calendar: React.ComponentType<any>;

  const _default: any;
  export default _default;
}
