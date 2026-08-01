import { StyleSheet, View } from 'react-native';

import { TennisBallLoader } from '@/components/ui/tennis-ball-loader';
import { Spacing } from '@/constants/theme';

export function LoadingState() {
  return (
    <View style={styles.container}>
      <TennisBallLoader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
});
