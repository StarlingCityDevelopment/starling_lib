import { debugData } from '../../../utils/debugData';
import { AlertProps } from '../../../typings';

export const debugAlert = () => {
  debugData<AlertProps>([
    {
      action: 'sendAlert',
      data: {
        header: 'Hello there',
        content: 'General kenobi  \n Markdown works too! **Bold** _Italic_ ~Strikethrough~ `Code`\n Image ![Starling Logo](https://r2.fivemanage.com/kMloakyTtNi8HCjJxLN8r/logo_bird.png)',
        centered: true,
        size: 'lg',
        overflow: true,
        cancel: true,
        // labels: {
        //   confirm: 'Ok',
        //   cancel: 'Not ok',
        // },
      },
    },
  ]);
};
