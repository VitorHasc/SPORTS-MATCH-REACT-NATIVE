import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from '../../../../styles/StylesCentral';
import { useState } from 'react';
import FlatlistChat from '../../compcentral/chat/flatlistConversas';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Chat() {
  const [button, setButton] = useState(1);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
        <TouchableOpacity
          style={[styles.botaoGU, { backgroundColor: button === 1 ? '#2FDC7A' : 'black', marginLeft: 14 }]}
          onPress={() => setButton(1)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoGU, { backgroundColor: button === 2 ? '#2FDC7A' : 'black', marginRight: 14 }]}
          onPress={() => setButton(2)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Grupos</Text>
        </TouchableOpacity>
      </View>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatlistChat uOg={button} />
      </GestureHandlerRootView>
    </View>
  );
}
