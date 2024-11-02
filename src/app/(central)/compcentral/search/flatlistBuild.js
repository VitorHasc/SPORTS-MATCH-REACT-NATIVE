import { Text, View, FlatList, TouchableOpacity, Modal, StyleSheet, ImageBackground } from 'react-native';
import { useFonts, LeagueSpartan_400Regular } from '@expo-google-fonts/league-spartan';
import styles from '../../../../styles/StylesCentral';
import calcularIdade from '../../../compfunc/pegarIdade';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import Perfil from '../../(tabs)/profile/profile';
import ModalMensagens from '../chat/modalMensagens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function FlatlistBuild({ data, but, recall }) {
  const [fontsLoaded] = useFonts({
    LeagueSpartan_400Regular,
  });
  const [modalPerfilVisible, setModalPerfilVisible] = useState(false);
  const [modalMensagensVisible, setModalMensagensVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openPerfilModal = (user) => {
    setSelectedUser(user);
    setModalPerfilVisible(true);
  };

  const closePerfilModal = () => {
    setModalPerfilVisible(false);
    setSelectedUser(null);
  };

  const openMensagensModal = (user) => {
    setSelectedUser(user);
    setModalMensagensVisible(true);
  };

  const closeMensagensModal = () => {
    setModalMensagensVisible(false);
    setSelectedUser(null);
  };

  const pedidosend = async (grupoId) => {
    try {
      const grupo = {
        grupoId
      };
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          'authorization': token,
        },
      };
      const curl = process.env.EXPO_PUBLIC_API_URL;
      const url = curl + '/groups/pedido';
      const respostaconfirm = await axios.post(url, grupo, config);
      console.log(respostaconfirm)
    } catch (error) {
      console.error(error);
    }
  };

  if (but == 1) {
    try {
      const { usuarios } = data;

      return (
        <View style={{ alignItems: 'center', marginTop: 50, flex: 1 }}>
          <FlatList
            contentContainerStyle={{ alignSelf: 'flex-start' }}
            numColumns={2}
            data={usuarios}
            keyExtractor={(item) => item.idusuario}
            renderItem={({ item }) => {
              const idade = calcularIdade(item.datanasc);
              const imageUrl = item.perfilFoto.includes('cloudinary')
                ? item.perfilFoto
                : `${process.env.EXPO_PUBLIC_API_URL}/imagem/imagem?perfilFoto=${encodeURIComponent(item.perfilFoto)}`;

              return (
                <TouchableOpacity onPress={() => openPerfilModal(item)}>
                  <View style={[styles.card]}>
                    <ImageBackground source={{ uri: imageUrl }} style={{ paddingBottom: 300 }}>
                      <Text
                        style={{
                          position: 'absolute',
                          color: 'white',
                          top: 10,
                          marginLeft: 13,
                          fontSize: 25,
                          fontFamily: 'LeagueSpartan_400Regular',
                        }}
                      >
                        {item.nome}, {idade}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          position: 'absolute',
                          top: 200,
                          left: 0,
                          right: 0,
                        }}
                      >
                        <TouchableOpacity onPress={() => openMensagensModal(item)} style={{ paddingLeft: 10 }}>
                          <View
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: 50,
                              width: 45,
                              height: 45,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Icon name="message" color="#2FDC7A" size={30} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              );
            }}
            onEndReached={recall}
            onEndReachedThreshold={0.5}
          />
          {selectedUser && (
            <Modal
              visible={modalPerfilVisible}
              animationType="slide"
              transparent={false}
              onRequestClose={closePerfilModal}
            >
              <TouchableOpacity onPress={closePerfilModal}>
                <Icon name="close" size={40}></Icon>
              </TouchableOpacity>
              <Perfil id={selectedUser.idusuario} />
            </Modal>
          )}
          {selectedUser && (
            <Modal
              visible={modalMensagensVisible}
              animationType="slide"
              transparent={false}
              onRequestClose={closeMensagensModal}
            >
              <View style={{ flex: 1, justifyContent: 'flex-start', padding: 10 }}>
                <TouchableOpacity onPress={closeMensagensModal} style={{ marginBottom: 20 }}>
                  <Icon name="arrow-back" size={40} />
                </TouchableOpacity>
                <ModalMensagens id={selectedUser.idusuario} />
              </View>
            </Modal>
          )}
        </View>
      );
    } catch (error) {
      console.log(error);
      return <View />;
    }
  } else if (but === 2) {
    console.log("LA VEM!");
    console.log(data.resposta);
    return (
      <FlatList
        data={data.resposta}
        keyExtractor={(item) => item.idgrupo.toString()}
        renderItem={({ item }) => (
          <View style={{
            padding: 0, // Remove o padding interno
            marginVertical: 10,
            marginHorizontal: 20,
            backgroundColor: '#e0e0e0',
            borderRadius: 15,
            overflow: 'hidden', // Garante que o ImageBackground respeite o borderRadius
          }}>
            <ImageBackground
              source={
                item.perfilFoto ?
                  parseInt(item.perfilFoto) === 1 ? require('../../../../../assets/12721210_2023-wabc-NewApp-SPORTS.jpg') :
                    parseInt(item.perfilFoto) === 2 ? require('../../../../../assets/AdobeStock_286933595-Blog-Sport1-2000x936.jpeg') :
                      parseInt(item.perfilFoto) === 3 ? require('../../../../../assets/depositphotos_135034544-stock-photo-boys-playing-soccer-young-football.jpg') :
                        parseInt(item.perfilFoto) === 4 ? require('../../../../../assets/ea-sports-fc-25-e1725979411169.webp') :
                          null
                  : null
              }
              style={{ width: '100%', height: 200, justifyContent: 'flex-end' }} // Altura fixa para garantir consistência
              resizeMode="cover"
            >
              <View style={{ padding: 15, position: 'absolute', bottom: 0, left: 0 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>{item.nome}</Text>
                <Text style={{ fontSize: 16, color: 'white', marginBottom: 10 }}>{item.descricao}</Text>
              </View>

              <TouchableOpacity onPress={() => pedidosend(item.idgrupo)} style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <View
                  style={{
                    backgroundColor: '#2FDC7A',
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Icon name="chevron-right" color="#FFFFFF" size={24} />
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}
      />
    );
  }
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
