import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((_, params: { disabled?: boolean; readOnly?: boolean }) => {
  const disabledColor = 'rgba(128,128,128,1)';
  const textColor = params.disabled ? disabledColor : '#FFFFFF';
  const bg = params.disabled ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.65)';
  const hoverBg = params.readOnly || params.disabled ? (params.readOnly ? 'rgba(28,28,28,1)' : undefined) : 'rgba(48,48,48,0.65)';
  const hoverCursor = params.readOnly ? 'default' : params.disabled ? 'not-allowed' : 'pointer';
  const hoverBorder = params.readOnly || params.disabled ? 'none' : '1px solid red';

  return {
    inner: {
      justifyContent: 'flex-start',
      gap: 8,
    },
    label: {
      width: '100%',
      color: textColor,
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
    },
    button: {
      color: textColor,
      minHeight: 52,
      height: 'fit-content',
      width: '100%',
      padding: 10,
      backgroundColor: bg,
      borderRadius: 8,
      border: '1px solid transparent',
      transition: 'background-color 150ms, transform 80ms, box-shadow 150ms, border-color 150ms',
      '&:hover': {
        backgroundColor: hoverBg,
        cursor: hoverCursor,
        border: hoverBorder,
      },
      '&:active': {
        transform: params.readOnly || params.disabled ? 'none' : 'translateY(1px)',
      },
      '&:disabled': {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        cursor: 'not-allowed',
        opacity: 0.9,
      },
    },
    iconImage: {
      maxWidth: 24,
      maxHeight: 24,
      objectFit: 'contain',
      borderRadius: 4,
    },
    description: {
      color: textColor,
      fontSize: 12,
      opacity: params.disabled ? 0.8 : 0.95,
    },
    dropdown: {
      padding: 10,
      color: '#FFFFFF',
      fontSize: 14,
      maxWidth: 320,
      minWidth: 220,
      width: 'fit-content',
      border: 'none',
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderRadius: 8,
    },
    buttonStack: {
      gap: 6,
      flex: '1',
    },
    buttonGroup: {
      gap: 8,
      flexWrap: 'nowrap',
      alignItems: 'center',
    },
    buttonIconContainer: {
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonTitleText: {
      overflowWrap: 'break-word',
      fontWeight: 500,
    },
    buttonArrowContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 28,
      height: 28,
    },
  };
});

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly ? button.menu ? openMenu(button.menu) : clickContext(buttonKey) : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="lg"
                            style={{ color: button.iconColor }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress value={button.progress} size="sm" color={button.colorScheme || 'dark.3'} />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <>
                  <Text key={`context-metadata-${index}`}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'dark.3'}
                    />
                  )}
                </>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
