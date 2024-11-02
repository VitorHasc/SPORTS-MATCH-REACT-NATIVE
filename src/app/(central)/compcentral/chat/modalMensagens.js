import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ModalMensagens({ id}) {
  const [mensagens, setMensagens] = useState({ resposta: [] });
  const flatListRef = useRef(null);
  const [mensagemEnviar, setMensagemEnviar] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // Estado para rastrear se está na parte inferior

  const enviarMensagem = async () => {
    if (mensagemEnviar !== "") {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': token,
          },
        };
        const data = {
          idalvo: id,
          texto: mensagemEnviar,
        };
        const curl = process.env.EXPO_PUBLIC_API_URL;
        const url = `${curl}/messages/mensagens`;
        await axios.post(url, data, config);
        setMensagemEnviar("");
        fetchMensagens(); // Recarregar mensagens após enviar uma nova
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

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
      setMensagens(resposta.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMensagens();
    const intervalId = setInterval(fetchMensagens, 200);
    return () => clearInterval(intervalId);
  }, [id]);

  // Scrollar para o final da lista ao carregar as mensagens, se o usuário estiver na parte inferior
  useEffect(() => {
    if (flatListRef.current && mensagens.resposta.length > 0 && isAtBottom) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [mensagens]);

  const onScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // 20 para um pouco de margem
    setIsAtBottom(isAtBottom);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        ref={flatListRef}
        data={mensagens.resposta}
        keyExtractor={item => item.idmensagem.toString()}
        renderItem={({ item }) => {
          const isSentByUser = item.remetenteId === mensagens.idusuario;
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
        onScroll={onScroll} // Rastreia a rolagem
        scrollEventThrottle={16} // Para um desempenho mais suave
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
        <TouchableOpacity style={{ padding: 10 }} onPress={enviarMensagem}>
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
