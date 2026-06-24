import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prometheusprotocol.game',
  appName: 'Prometheus Protocol',
  webDir: '../../V2/dist',
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    backgroundColor: '#e9f6f1',
  },
};

export default config;
