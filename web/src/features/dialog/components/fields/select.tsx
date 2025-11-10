import { MultiSelect, Select } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const SelectField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  return (
    <>
      {props.row.type === 'select' ? (
        <Select
          data={props.row.options}
          value={controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={controller.field.onChange}
          disabled={props.row.disabled}
          label={props.row.label}
          description={props.row.description}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          searchable={props.row.searchable}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          styles={{
            icon: {
              color: 'white',
            },
            label: {
              color: 'white',
            },
            dropdown: {
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.90)',
              border: 'none',
            },
            wrapper: {
              color: 'white',
            },
            input: {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        />
      ) : (
        <>
          {props.row.type === 'multi-select' && (
            <MultiSelect
              data={props.row.options}
              value={controller.field.value}
              name={controller.field.name}
              ref={controller.field.ref}
              onBlur={controller.field.onBlur}
              onChange={controller.field.onChange}
              disabled={props.row.disabled}
              label={props.row.label}
              description={props.row.description}
              withAsterisk={props.row.required}
              clearable={props.row.clearable}
              searchable={props.row.searchable}
              maxSelectedValues={props.row.maxSelectedValues}
              icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
              styles={{
                icon: {
                  color: 'white',
                },
                label: {
                  color: 'white',
                },
                dropdown: {
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                },
                input: {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default SelectField;
