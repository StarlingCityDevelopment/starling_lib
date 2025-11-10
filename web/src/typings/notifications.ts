import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Sx } from '@mantine/core';
import { IconAnimation } from '../components/LibIcon';

export interface NotificationProps {
  style?: Sx;
  description?: string;
  title?: string;
  duration?: number;
  showDuration?: boolean;
  icon?: IconProp;
  iconColor?: string;
  iconAnimation?: IconAnimation;
  position?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  id?: number | string;
  type?: string;
  alignIcon?: 'top' | 'center';
}

export interface ContainerPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}
