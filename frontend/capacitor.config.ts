import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.canteenreview.app',
  appName: 'Canteen Review',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
  },
};

export default config;
