import Constants, { ExecutionEnvironment } from 'expo-constants';

/** Expo Go can't load native modules (e.g. Google Sign-In) that aren't in its prebuilt binary. */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
