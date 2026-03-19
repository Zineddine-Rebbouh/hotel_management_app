declare module "react-datepicker" {
  import { ComponentType } from "react";

  export interface ReactDatePickerProps {
    selected?: Date | null;
    onChange?: (date: Date | null, event: any) => void;
    startDate?: Date | null;
    endDate?: Date | null;
    selectsStart?: boolean;
    selectsEnd?: boolean;
    selectsRange?: boolean;
    minDate?: Date;
    maxDate?: Date;
    placeholderText?: string;
    className?: string;
    wrapperClassName?: string;
    [key: string]: any;
  }

  const ReactDatePicker: ComponentType<ReactDatePickerProps>;
  export default ReactDatePicker;
}
