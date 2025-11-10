import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    color: theme.white,
    backgroundColor: theme.fn.rgba('#ffffff', 0.03),
    borderRadius: 10,
    padding: 8,
    height: 68,
    scrollMargin: 8,
    border: `1px solid ${theme.fn.rgba(theme.colors.dark ? theme.colors.dark[6] : '#000', 0.12)}`,
    transition: 'background-color 160ms ease, transform 140ms ease, box-shadow 180ms ease, border-color 160ms ease',
    cursor: 'default',
    '&:hover': {
      background: theme.fn.rgba('#ffffff', 0.05),
      transform: 'translateY(-2px)',
      boxShadow: `0 10px 30px ${theme.fn.rgba('#000', 0.36)}`,
    },
    '&:focus': {
      border: `1px solid ${theme.colors.red ? theme.colors.red[6] : '#ef4444'}`,
      backgroundColor: theme.fn.rgba('#ffffff', 0.06),
      outline: 'none',
      boxShadow: `0 12px 36px ${theme.fn.rgba('#000', 0.38)}`,
    },
  },
  iconImage: {
    width: 34,
    height: 34,
    maxWidth: 34,
    maxHeight: 34,
    objectFit: 'cover',
    borderRadius: 6,
    display: 'block',
    boxShadow: `0 4px 10px ${theme.fn.rgba('#000', 0.35)}`,
  },
  buttonWrapper: {
    paddingLeft: 12,
    paddingRight: 14,
    height: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 8,
    background: theme.fn.rgba('#000', 0.15),
    flex: '0 0 40px',
    boxShadow: `inset 0 1px 0 ${theme.fn.rgba('#fff', 0.02)}`,
  },
  icon: {
    fontSize: 20,
    color: params.iconColor || theme.white,
    lineHeight: 1,
  },
  label: {
    color: theme.white,
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 700,
    verticalAlign: 'middle',
    letterSpacing: 0.6,
  },
  chevronIcon: {
    fontSize: 14,
    color: theme.fn.rgba('#ffffff', 0.62),
  },
  scrollIndexValue: {
    color: theme.fn.rgba('#ffffff', 0.66),
    textTransform: 'uppercase',
    fontSize: 13,
  },
  progressStack: {
    width: '100%',
    marginRight: 6,
  },
  progressLabel: {
    color: theme.white,
    fontSize: 12,
    marginBottom: 6,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'dark.0'}
              styles={(theme) => ({ root: { backgroundColor: theme.colors.dark[3] } })}
            />
          </Stack>
        ) : (
          <Text>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
