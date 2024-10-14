import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ModalMensagens({ id }) {
  const [mensagens, setMensagens] = useState([]);
  const flatListRef = useRef(null);
  const [mensagemEnviar, setMensagemEnviar] = useState([null]);


  const enviarMensagem = async () => {
    if(mensagemEnviar!=""){
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': token,
          },
        };
        const data = {
          idalvo: id,
          texto: mensagemEnviar
        };
        const curl = process.env.EXPO_PUBLIC_API_URL;
        const url = `${curl}/messages/mensagens`;
        const resposta = await axios.post(url, data, config);
        console.log(resposta);
        setMensagemEnviar("");
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  useEffect(() => {
    const fetchMensagens = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': token,
          },
        };
        const data = {
          idalvo: id,
        };
        const curl = process.env.EXPO_PUBLIC_API_URL;
        const url = `${curl}/messages/mensagenspeg`;
        const resposta = await axios.post(url, data, config);
        console.log(resposta.data.resposta);
        setMensagens(resposta.data);
        console.log(mensagens.resposta)
        console.log("AAAAAAAAA")
      } catch (error) {
        console.log(error);
      }
    };

    fetchMensagens();
    const intervalId = setInterval(fetchMensagens, 200);
    return () => clearInterval(intervalId);
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        ref={flatListRef}
        data={mensagens.resposta}
        keyExtractor={item => item.idmensagem}
        renderItem={({ item }) => {
          const isSentByUser = item.remetenteId == mensagens.idusuario;
          return (
            <View
              style={{
                padding: 10,
                marginBottom: 10,
                borderRadius: 10,
                maxWidth: '75%',
                alignSelf: isSentByUser ? 'flex-end' : 'flex-start',
                backgroundColor: isSentByUser ? '#37db7e' : '#EEE',
              }}
            >
              <Text style={{ textAlign: isSentByUser ? 'right' : 'left' }}>
                {item.texto}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={mensagemEnviar}
          onChangeText={setMensagemEnviar}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            paddingHorizontal: 10,
            marginRight: 10,
            paddingVertical: 10,
          }}
          placeholder="Digite uma mensagem..."
        />
        <TouchableOpacity style={{ padding: 10 }} onPress={() => enviarMensagem(mensagemEnviar)}>
          <Icon name="send" size={30} color="#20B761" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1',
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#20B761',
  },
  textLeft: {
    color: '#000',
  },
  textRight: {
    color: '#fff',
  },
  flatListContent: {
    flexGrow: 1,
  },
});
