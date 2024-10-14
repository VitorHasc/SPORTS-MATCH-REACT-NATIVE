import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Flatlistsearch from '../../compcentral/search/flatlistSearch';
import styles from '../../../../styles/StylesCentral';
import FilterModel from '../../compcentral/search/filterModal';

export default function Search() {
  const [button, setButton] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [genero, setGenero] = useState(undefined);
  const [idade, setIdade] = useState([0, 120]);
  const [esporte, setEsporte] = useState(undefined);

  function botaoChama(but) {
    setButton(but);
  }

  function botaoChamaModal() {
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.row}>
        <TextInput style={styles.input} keyboardType="email-address" />
        <TouchableOpacity style={styles.iconContainer} onPress={botaoChamaModal}>
          <Icon name="filter-list" color='black' size={60} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={[styles.botaoGU, { backgroundColor: button === 1 ? '#2FDC7A' : 'black', marginLeft: 14 }]}
          onPress={() => botaoChama(1)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoGU, { backgroundColor: button === 2 ? '#2FDC7A' : 'black', marginRight: 14 }]}
          onPress={() => botaoChama(2)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Grupos</Text>
        </TouchableOpacity>
      </View>
      <Flatlistsearch but={button} genero={genero} idademin={idade[0]} idademax={idade[1]} esporte={esporte} />
      <FilterModel modalVisible={modalVisible} setModalVisible={setModalVisible} setGenero={setGenero} setIdade={setIdade}setEsporte={setEsporte} genero={genero} idade={idade} esporte={esporte}/>
    </View>
  );
}
