import { StatsigEnvironment } from './StatsigOptions';

export type StatsigUser = {
  userID?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  country?: string;
  locale?: string;
  appVersion?: string;
  custom?: Record<
    string,
    string | number | boolean | Array<string> | undefined
  >;
  privateAttributes?: Record<
    string,
    string | number | boolean | Array<string> | undefined
  > | null;
  customIDs?: Record<string, string>;
  statsigEnvironment?: StatsigEnvironment;
};
