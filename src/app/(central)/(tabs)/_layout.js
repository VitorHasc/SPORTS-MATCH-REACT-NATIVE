import { Tabs } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TabsRoutesCentral() {
  
  return (
    <Tabs
      screenOptions={() => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused }) => {
          let iconColor = focused ? '#2FDC7A' : 'black';
          return <Icon color={iconColor} size={40} />;
        },
      })}
    >
      <Tabs.Screen
        name="search/search"
        options={{ tabBarIcon: ({ focused }) => <Icon name="map" color={focused ? '#2FDC7A' : 'black'} size={40} /> }}
      />
      <Tabs.Screen
        name="profile/profile"
        options={{ tabBarIcon: ({ focused }) => <Icon name="person" color={focused ? '#2FDC7A' : 'black'} size={45} /> }}
      />
      <Tabs.Screen
        name="chat/chat"
        options={{ tabBarIcon: ({ focused }) => <Icon name="chat-bubble-outline" color={focused ? '#2FDC7A' : 'black'} size={40} /> }}
      />
    </Tabs>
  );
}