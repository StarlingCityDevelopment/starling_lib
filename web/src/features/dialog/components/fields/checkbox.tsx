import { Checkbox } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const CheckboxField: React.FC<Props> = (props) => {
  return (
    <Checkbox
      {...props.register}
      sx={{ display: 'flex' }}
      required={props.row.required}
      label={props.row.label}
      defaultChecked={props.row.checked}
      disabled={props.row.disabled}
      styles={{
        label: {
          color: 'white',
        },
        inner: {
          color: 'white',
        },
        input: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }
      }}
    />
  );
};

export default CheckboxField;
