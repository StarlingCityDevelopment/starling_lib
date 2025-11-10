import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((_, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems:
      params?.position === 'top-center' ? 'flex-start' :
      params?.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent:
      params?.position === 'right-center' ? 'flex-end' :
      params?.position === 'left-center' ? 'flex-start' : 'center',
    pointerEvents: 'none',
    padding: 12,
    boxSizing: 'border-box',
  },
  container: {
    fontSize: 16,
    padding: '10px 14px',
    margin: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    color: '#ffffff',
    borderRadius: 8,
    boxShadow: '0 6px 18px rgba(255, 0, 0, 0.2)',
    maxWidth: 'min(70vw, 720px)',
    minWidth: 120,
    lineHeight: 1.4,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    pointerEvents: 'auto',
    backdropFilter: 'saturate(120%) blur(6px)',
    WebkitBackdropFilter: 'saturate(120%) blur(6px)',
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.container}>
            <Group spacing={12}>
              {data.icon && (
                <LibIcon
                  icon={data.icon}
                  fixedWidth
                  size="lg"
                  animation={data.iconAnimation}
                  style={{
                    color: data.iconColor,
                    alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                  }}
                />
              )}
              <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                {data.text}
              </ReactMarkdown>
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
