import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderBottom: `1px solid ${theme.fn.rgba(theme.colors.dark ? theme.colors.dark[6] : '#000', 0.25)}`,
    height: 64,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  heading: {
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 1.2,
    color: theme.white,
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
