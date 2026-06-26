import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hugoprigent.prometheusprotocol',
  appName: 'Prometheus Protocol',
  webDir: '../../V2/dist',
  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    backgroundColor: '#e9f6f1',
  },
};

export default config;
