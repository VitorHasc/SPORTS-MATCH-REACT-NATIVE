import { View, Text, FlatList, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, isToday, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalMensagens from './modalMensagens';
import ModalGroup from './modalGroup';

export default function FlatlistChat({ uOg }) {
  const [conversas, setConversas] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groups, setGroups] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalGroupVisible, setModalGroupVisible] = useState(false);
  const [modalPedidosVisible, setModalPedidosVisible] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [isAdm, setIsAdm] = useState(null)

  const openModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const openModalGroup = (item) => {
    setSelectedGroup(item);
    console.log(item.usuarios[0])
    console.log("TAILSSSS")
    setIsAdm(item.usuarios[0].adm)
    setModalGroupVisible(true);
  }

  const closeModalGroup = () => {
    setModalGroupVisible(false);
    setSelectedGroup(null);
  }

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return isToday(date)
      ? format(date, 'HH:mm')
      : format(date, 'dd/MM/yyyy');
  };

  const verPedidos = async (groupId) => {
    setModalPedidosVisible(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': token,
        },
      };
      const curl = process.env.EXPO_PUBLIC_API_URL;
      const url = `${curl}/groups/pedidos?grupoId=${groupId}`;
      const resposta = await axios.get(url, config);
      console.log(resposta)
      console.log("CRASH BANDICOOT")
      setPedidos(resposta.data.pedidos);
    } catch (error) {
      console.log(error);
    }
  };

  const ativarPedido = async (pedidoId) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + pedidoId)
    try {
      const token = await AsyncStorage.getItem('token');
      const data = {
        pedidoId
      }
      const config = {
        headers: {
          'Authorization': token,
        },
      };
      const curl = process.env.EXPO_PUBLIC_API_URL;
      const url = `${curl}/groups/confirmarPedido`; // Substitua com o endpoint correto
      const resposta = await axios.post(url, data, config); // Ajuste o método HTTP se necessário
      console.log("Pedido ativado:", resposta.data);
    } catch (error) {
      console.error("Erro ao ativar o pedido:", error);
    }
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
      } catch (error) {
        console.log(error);
      }
    } else if (uOg === 2) {
      try {
        const curl = process.env.EXPO_PUBLIC_API_URL;
        const url = `${curl}/groups/meus`;
        const resposta = await axios.get(url, config);
        setGroups(resposta.data.grupos);
        console.log(resposta);
        console.log("SONICCCCC")
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: 20 }}>
        <FlatList
          data={groups}
          keyExtractor={(item) => item.idgrupo.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openModalGroup(item)}
              style={{
                padding: 0, // Remover padding para o ImageBackground ocupar o espaço corretamente
                marginVertical: 10,
                width: 300, // Defina a largura fixa que deseja
                height: 200, // Defina uma altura fixa para garantir que o ImageBackground ocupe a área
                backgroundColor: '#e0e0e0',
                borderRadius: 15,
                overflow: 'hidden', // Garante que o conteúdo respeite o borderRadius
                alignSelf: 'center',
              }}
            >
              <ImageBackground
                source={{ uri: `../../../../../assets/${item.perfilFoto}` }}
                style={{ width: '100%', height: '100%', justifyContent: 'flex-end', padding: 15 }} // Ocupar 100% do TouchableOpacity
                resizeMode="cover"
              >
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: '#fff' }}>{item.nome}</Text>
                  <Text style={{ color: '#fff' }}>{item.descricao}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ alignItems: 'center' }}
        />

        {selectedGroup && (
          <Modal
            visible={modalGroupVisible}
            transparent={false}
            onRequestClose={closeModalGroup}
          >
            <View style={{ flex: 1, justifyContent: 'flex-start', padding: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={closeModalGroup} style={{ marginBottom: 20 }}>
                  <Icon name="arrow-back" size={40} />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontSize:20, marginBottom: 20 }}><b>{selectedGroup.nome}</b></Text>
                {isAdm && (
                  <TouchableOpacity onPress={() => verPedidos(selectedGroup.idgrupo)} style={{ marginBottom: 20 }}>
                    <Icon name="notifications" size={40}  />
                  </TouchableOpacity>
                )}
                {!isAdm && ( 
                  <TouchableOpacity>
                    <Icon name="notifications" size={40} style={{color:"#fff"}} />
                  </TouchableOpacity>
                )}
              </View>
              <ModalGroup id={selectedGroup.idgrupo} />
            </View>
          </Modal>
        )}

        {modalPedidosVisible && (
          <Modal
            visible={modalPedidosVisible}
            transparent={false}
            onRequestClose={() => setModalPedidosVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setModalPedidosVisible(false)}>
                  <Icon name="arrow-back" size={40} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pedidos</Text>
              </View>

              <FlatList
                data={pedidos}
                keyExtractor={(item) => item.idGU}
                renderItem={({ item }) => (
                  <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{item.usuario.nome}</Text>
                    <TouchableOpacity onPress={() => ativarPedido(item.idGU)}>
                      <Icon name="check" size={40} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </Modal>
        )}
      </View>
    );
  } else if (uOg === 1) {
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
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#D9D9D9', marginRight: 10, overflow: 'hidden' }}>
                    <ImageBackground source={{ uri: item.perfilFoto }} style={{ paddingBottom: 70 }}></ImageBackground>
                  </View>
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
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity
                  onPress={closeModal}
                  style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
                >
                  <Icon name="arrow-back" size={40}/>
                  <Text style={{ flex: 1, textAlign: 'center', fontSize:20 }}><b>{selectedUser.nome}</b></Text>
                  <Icon name="arrow-back" size={40} style={{color:"#fff"}}/>
                </TouchableOpacity>
              </View>
              <ModalMensagens id={selectedUser.idusuario} />
            </View>

          </Modal>
        )}
      </View>
    );
  }
}
