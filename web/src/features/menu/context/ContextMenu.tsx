import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, Button, createStyles, Divider, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles(() => ({
  container: {
    position: 'fixed',
    inset: 0,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 32,
    background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
    color: '#fff',
    pointerEvents: 'none',
  },
  menuContainer: {
    pointerEvents: 'auto',
    width: 'min(26vw, 500px)',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4vh',
    borderRadius: 12,
    padding: 20,
    transition: 'transform 150ms ease, opacity 150ms ease',
    transformOrigin: 'top right',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  closeContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
  },
  closeKey: {
    borderRadius: 8,
    border: '1.5px solid red',
    padding: '4px 10px',
    fontWeight: 700,
    color: 'red',
    background: 'rgba(0,0,0,0.25)',
    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.4)',
  },
  optionsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    height: 64,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  titleContainer: {
    borderRadius: 6,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'column',
    fontWeight: 600,
    fontSize: 19,
    textTransform: 'uppercase',
    lineHeight: 1,
  },
  menuText: {
    fontSize: 15,
    fontWeight: 700,
    color: 'red',
    letterSpacing: 0.6,
  },
  titleText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.92)',
    fontSize: 'clamp(16px, 2.4vw, 20px)',
    lineHeight: 1.1,
  },
  buttonsContainer: {
    overflowY: 'auto',
    maxHeight: '50vh',
    paddingRight: 6,
    '&::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 999,
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
  buttonsFlexWrapper: {
    gap: 6,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return visible ? (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Box className={classes.menuContainer}>
          <Box className={classes.closeContainer}>
            Fermer le menu
            <Box className={classes.closeKey}>
              ESC
            </Box>
          </Box>

          <Box className={classes.optionsContainer}>
            <Flex className={classes.header}>
              <Box className={classes.titleContainer}>
                <Text className={classes.menuText}>
                  MENU
                </Text>
                <Text className={classes.titleText}>
                  <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
                </Text>
              </Box>
              <img src="https://r2.fivemanage.com/kMloakyTtNi8HCjJxLN8r/logo_bird.png" alt="Logo" width={64} height={64} />
            </Flex>

            <Divider />

            <Box className={classes.buttonsContainer}>
              <Stack className={classes.buttonsFlexWrapper}>
                {Object.entries(contextMenu.options).map((option, index) => (
                  <ContextButton option={option} key={`context-item-${index}`} />
                ))}
              </Stack>
            </Box>

            {contextMenu.menu && (
              <>
                <Divider />
                <Button variant="light" color="red" fullWidth onClick={() => openMenu(contextMenu.menu)}>
                  <Text className={classes.menuText}>RETOUR</Text>
                </Button>
              </>
            )}
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  ) : null;
};

export default ContextMenu;
