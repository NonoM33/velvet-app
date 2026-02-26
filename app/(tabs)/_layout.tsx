import { Tabs } from 'expo-router';
import { TabBar } from '../../src/components';
import { Colors } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar state={props.state} navigation={props.navigation} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        sceneStyle: { backgroundColor: Colors.background },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="trips" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
