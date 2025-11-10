import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { ContainerPosition, NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    animation: `${slideIn} 300ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
    position: 'relative',
    height: 'fit-content',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: theme.colors.dark[0],
    padding: 14,
    paddingLeft: 20,
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    ":before": {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: 'red',
    },
  },
  title: {
    fontWeight: 500,
    lineHeight: 'normal',
  },
  description: {
    fontSize: 12,
    color: theme.colors.dark[2],
    lineHeight: 'normal',
  },
  descriptionOnly: {
    fontSize: 14,
    color: theme.colors.dark[2],
    lineHeight: 'normal',
  },
}));

const durationCircle = keyframes({
  '0%': { strokeDasharray: `0, ${15.1 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${15.1 * 2 * Math.PI}, 0` },
});

const slideIn = keyframes({
  '0%': { transform: 'translateX(-100%)', opacity: 0 },
  '100%': { transform: 'translateX(0)', opacity: 1 },
});

const Notifications: React.FC = () => {
  const { classes } = useStyles();

  const [toastKey, setToastKey] = useState(0);
  const [containerPosition, setContainerPosition] = useState<ContainerPosition>({
    top: 80.87,
    left: 1.5,
    width: 360,
    height: 270,
  });

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let iconColor: string;
    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey((prevKey) => prevKey + 1);

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    if (!data.iconColor) {
      switch (data.type) {
        case 'error':
          iconColor = 'red.6';
          break;
        case 'success':
          iconColor = 'teal.6';
          break;
        case 'warning':
          iconColor = 'yellow.6';
          break;
        default:
          iconColor = 'blue.6';
          break;
      }
    } else {
      iconColor = tinycolor(data.iconColor).toRgbString();
    }

    toast.custom(
      () => (
        <Box
          className={`${classes.container}`}
        >
          <Group noWrap spacing={12}>
            {data.icon && (
              <>
                {data.showDuration ? (
                  <RingProgress
                    key={toastKey}
                    size={38}
                    thickness={2}
                    sections={[{ value: 100, color: iconColor }]}
                    style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
                    styles={{
                      root: {
                        '> svg > circle:nth-of-type(2)': {
                          animation: `${durationCircle} linear forwards reverse`,
                          animationDuration: `${duration}ms`,
                        },
                        margin: -3,
                      },
                    }}
                    label={
                      <Center>
                        <ThemeIcon
                          color={iconColor}
                          radius="xl"
                          size={32}
                          variant={tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'}
                        >
                          <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                        </ThemeIcon>
                      </Center>
                    }
                  />
                ) : (
                  <ThemeIcon
                    color={iconColor}
                    radius="xl"
                    size={32}
                    variant={tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'}
                    style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
                  >
                    <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                  </ThemeIcon>
                )}
              </>
            )}
            <Stack spacing={0}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: 'bottom-center',
      }
    );
  });

  useNuiEvent('setNotifyPosition', (data: {
    top: number;
    left: number;
    width: number;
    height: number;
  }) => {
    setContainerPosition({
      top: data.top,
      left: data.left,
      width: data.width,
      height: data.height,
    });
  });

  return <Toaster containerStyle={{
    position: 'absolute',
    top: 0,
    left: `${containerPosition.left}%`,
    width: containerPosition.width,
    height: `${containerPosition.top}%`,
  }} />;
};

export default Notifications;
