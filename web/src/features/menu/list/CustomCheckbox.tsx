import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    border: `1px solid ${theme.colors.dark ? theme.colors.dark[6] : '#0f172a'}`,
    borderRadius: 8,
    transition: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 120ms ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 4px ${theme.fn.rgba(theme.colors.red ? theme.colors.red[6] : '#f02121ff', 0.14)}`,
      transform: 'translateY(-1px)',
    },
    '&:checked': {
      backgroundColor: theme.colors.red ? theme.colors.red[6] : '#f02121ff',
      borderColor: theme.colors.red ? theme.colors.red[6] : '#f02121ff',
      boxShadow: `0 6px 18px ${theme.fn.rgba('#000', 0.35)}, 0 0 0 4px ${theme.fn.rgba(theme.colors.red ? theme.colors.red[6] : '#ef4444', 0.12)}`,
    },
  },
  inner: {
    '> svg > path': {
      fill: theme.white || '#ffffff',
      transition: 'fill 180ms ease, transform 120ms ease',
      transformOrigin: 'center center',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
