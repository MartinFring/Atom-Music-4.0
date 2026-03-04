import { createPlugin } from '@/utils';
import { onRendererLoad } from './renderer';

export default createPlugin({
  name: () => 'Settings',
  description: () => 'Centralized settings page for all plugins',
  restartNeeded: false,
  config: {
    enabled: true,
  },
  renderer: {
    start: onRendererLoad,
  },
});
