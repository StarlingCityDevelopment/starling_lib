import { Button, createStyles, Group, Modal, Stack } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles(() => ({
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    border: 'none',
    boxShadow: 'none',
  },
  contentStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    color: 'white',
    border: 'none',
    boxShadow: 'none',
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        exitTransitionDuration={150}
        transition="fade"
        title={<ReactMarkdown className={classes.title} components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>}
        styles={{
          inner: {
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle,rgba(0, 0, 0, 0.45) 25%, rgba(0, 0, 0, 0) 100%)',
            border: 'none',
            boxShadow: 'none',
          },
          modal: {
            textAlign: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
          },
          title: {
            color: "white",
            textAlign: 'center',
            width: '100%',
            fontSize: 18,
          },
          body: {
            color: "white",
          },
        }}
      >
        <Stack className={classes.contentStack}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
          <Group position="center" spacing={24}>
            {dialogData.cancel && (
              <Button uppercase variant="light" color="red" onClick={() => closeAlert('cancel')} mr={3}>
                {dialogData.labels?.cancel || locale.ui.cancel}
              </Button>
            )}
            <Button
              uppercase
              color="green"
              variant="light"
              onClick={() => closeAlert('confirm')}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default AlertDialog;
