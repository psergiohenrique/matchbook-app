import { TabList, TabSlot, TabTrigger, TabTriggerSlotProps, Tabs } from 'expo-router/ui';
import { BarChart3, LayoutDashboard, Radar, User } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';

const TABS = [
  { name: 'index', href: '/', label: 'Painel', Icon: LayoutDashboard },
  { name: 'analytics', href: '/analytics', label: 'Análise', Icon: BarChart3 },
  { name: 'insights', href: '/insights', label: 'Estilos', Icon: Radar },
  { name: 'profile', href: '/profile', label: 'Perfil', Icon: User },
] as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <View style={[styles.tabList, { paddingBottom: insets.bottom + Spacing.two }]}>
          {TABS.map(({ name, href, label, Icon }) => (
            <TabTrigger key={name} name={name} href={href} asChild>
              <TabButton label={label} Icon={Icon} />
            </TabTrigger>
          ))}
        </View>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  Icon: typeof LayoutDashboard;
};

const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { label, Icon, isFocused, ...props },
  ref,
) {
  const color = isFocused ? Colors.light.gold : 'rgba(248, 245, 235, 0.6)';

  return (
    <Pressable ref={ref} {...props} style={styles.tabButton}>
      <Icon size={22} color={color} />
      <ThemedText type="small" style={[styles.tabLabel, { color }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: Colors.light.forestDeep,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.one,
  },
  tabLabel: {
    fontSize: 11,
  },
});
