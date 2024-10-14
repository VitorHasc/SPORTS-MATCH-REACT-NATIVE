import { View, Text, FlatList, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, isToday, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalMensagens from './modalMensagens';

export default function FlatlistChat({ uOg }) {
  console.log(uOg);
  const [conversas, setConversas] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return isToday(date)
      ? format(date, 'HH:mm')
      : format(date, 'dd/MM/yyyy');
  };

  const apiUsuarios = async () => {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token,
      },
    };
    if (uOg === 1) {
      try {
        const curl = process.env.EXPO_PUBLIC_API_URL;
        const url = `${curl}/messages/conversar`;
        const resposta = await axios.get(url, config);
        const arrumado = resposta.data.sort((a, b) => new Date(b.horario) - new Date(a.horario));
        setConversas(arrumado);
        console.log(arrumado);
      } catch (error) {
        console.log(error);
      }
    } else if (uOg === 2) {
      try {
        const curl = process.env.EXPO_PUBLIC_API_URL;
        const url = `${curl}/messages/conversar`;
        const resposta = await axios.get(url, config);
        const arrumado = resposta.data.sort((a, b) => new Date(b.horario) - new Date(a.horario));
        setConversas(arrumado);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    apiUsuarios();

    const intervalId = setInterval(() => {
      apiUsuarios();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [uOg]);

  if (uOg === 2) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      </View>
    );
  }

  if (uOg === 1) {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ marginTop: 30 }}
          data={conversas}
          keyExtractor={item => item.idusuario}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomColor: '#ddd', marginTop: 12, marginBottom: 12 }}>
                <TouchableOpacity>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#D9D9D9', marginRight: 10, overflow: 'hidden' }}><ImageBackground source={{ uri: item.perfilFoto }} style={{paddingBottom:70}}></ImageBackground></View>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{item.nome}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#555' }}>{item.ultimaMensagem}</Text>
                    <Text>{formatDate(item.horario)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        {selectedUser && (
          <Modal
            visible={modalVisible}
            transparent={false}
            onRequestClose={closeModal}
          >
            <View style={{ flex: 1, justifyContent: 'flex-start', padding: 10 }}>
              <TouchableOpacity onPress={closeModal} style={{ marginBottom: 20 }}>
                <Icon name="arrow-back" size={40} />
              </TouchableOpacity>
              <ModalMensagens id={selectedUser.idusuario} />
            </View>
          </Modal>
        )}
      </View>
    );
  }
}