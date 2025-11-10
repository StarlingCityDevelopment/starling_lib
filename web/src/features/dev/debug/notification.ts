import { NotificationProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugCustomNotification = () => {
  // debugData<{
  //   top: number;
  //   left: number;
  //   width: number;
  //   height: number;
  // }>([
  //   {
  //     action: 'setNotifyposition',
  //     data: {
  //       top: 82.39,
  //       left: 0.0,
  //       width: 360.0,
  //       height: 270.0,
  //     },
  //   },
  // ]);

  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Success',
        description: 'Notification description',
        type: 'success',
        id: 'pogchamp',
        duration: 20000,
      },
    },
  ]);

  setTimeout(() => {
    debugData<NotificationProps>([
      {
        action: 'notify',
        data: {
          title: 'Error',
          description: 'Notification description',
          type: 'error',
        },
      },
    ]);
  }, 1000);

  setTimeout(() => {
    debugData<NotificationProps>([
      {
        action: 'notify',
        data: {
          title: 'Error',
          description: 'Notification description',
          type: 'error',
        },
      },
    ]);
    debugData<NotificationProps>([
      {
        action: 'notify',
        data: {
          title: 'Custom icon success',
          description: 'Notification description',
          type: 'success',
          icon: 'microchip',
          id: 'unique-notification-id',
          showDuration: false,
        },
      },
    ]); 
  }, 2000);

  setTimeout(() => {
    debugData<NotificationProps>([
      {
        action: 'notify',
        data: {
          title: 'Warning',
          description: 'Notification description',
          type: 'warning',
        },
      },
    ]);

    debugData<NotificationProps>([
      {
        action: 'notify',
        data: {
          title: 'Warning',
          description: 'Notification description',
          type: 'warning',
        },
      },
    ]);

    debugData<NotificationProps>([
      {
        action: 'notify',
        data: {
          title: 'Custom icon success',
          description: 'Notification description',
          type: 'success',
          icon: 'microchip',
          id: 'unique-notification-id',
          showDuration: false,
        },
      },
    ]);
  }, 3000);
};
