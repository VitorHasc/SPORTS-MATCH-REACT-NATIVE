import { Text, View, TextInput, TouchableOpacity, Modal, StyleSheet, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FlatlistBuild from './flatlistBuild';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Flatlistsearch({ but, genero, idademin, idademax, esporte, latitude, longitude, nome }) {
  const [resposta, setResposta] = useState({ data: { usuarios: [] } });
  const [pagina, setPagina] = useState(1);

  // Estado para o modal
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedBackground, setSelectedBackground] = useState(null);

  const api = async (pagina) => {
    if (esporte === 'nenhum') {
      esporte = undefined;
    }
    if (genero === 'misto') {
      genero = undefined;
    }
    if (idademin === 0) {
      idademin = 1;
    }
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'authorization': token,
      },
    };

    const data = {
      pagina,
      genero,
      idademin,
      idademax,
      esporte,
      latitude,
      longitude,
      nome
    };
    console.log(data);

    const curl = process.env.EXPO_PUBLIC_API_URL;
    const url = curl + '/users/searchUsers';

    try {
      const novaresposta = await axios.post(url, data, config);
      console.log("SOCORROOOOOOOO");
      console.log(novaresposta);
      setResposta(prevResposta => {
        if (pagina === 1) {
          return {
            data: {
              usuarios: novaresposta.data.usuarios || []
            },
            pagina
          };
        } else {
          const usuariosExistentes = prevResposta.data.usuarios || [];
          const novosUsuarios = novaresposta.data.usuarios || [];
          const usuariosAtualizados = [
            ...usuariosExistentes,
            ...novosUsuarios
          ];
          return {
            data: {
              usuarios: usuariosAtualizados
            },
            pagina
          };
        }
      });
    } catch (error) {
      console.log("TUDO ERRADO");
      console.error(error);
    }
  };

  const api2 = async () => {
    const curl = process.env.EXPO_PUBLIC_API_URL;
    const url = curl + '/groups/search';
    const token = await AsyncStorage.getItem('token');
    console.log("EITA EITA");
    try {
      const config = {
        headers: {
          'authorization': token,
        },
      };
      const data = await axios.get(url, config);
      setResposta(data);
      console.log(data.data.resposta);
    } catch (error) {
      console.log(error);
    }
  };

  const recall = () => {
    console.log("chegou no fim!");
    setPagina(prevPagina => {
      const nextPage = prevPagina + 1;
      api(nextPage);
      return nextPage;
    });
  };

  const createGroup = async () => {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'authorization': token,
      },
    };

    const data = {
      nome: groupName,
      descricao: groupDescription,
      fundo: selectedBackground // Adiciona a imagem de fundo
    };

    const curl = process.env.EXPO_PUBLIC_API_URL;
    const url = curl + '/groups/criar'; // Ajuste para o endpoint correto

    try {
      const response = await axios.post(url, data, config);
      console.log('Grupo criado:', response.data);
      // Limpar os campos e fechar o modal após a criação do grupo
      setGroupName('');
      setGroupDescription('');
      setSelectedBackground(null); 
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
    }
  };

  useEffect(() => {
    if (but === 1) {
      setPagina(1);
      api(1);
    } else if (but === 2) {
      api2(1);
    }
  }, [but, genero, idademin, idademax, esporte]);

  return (
    <View style={{ flex: 1 }}>
      <FlatlistBuild data={resposta.data} but={but} recall={recall} />

      {/* Botão circular, aparece apenas se but for igual a 2 */}
      {but === 2 && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)} // Abre o modal ao clicar
          style={styles.floatingButton}
        >
          <Icon name="add" color="#ffff" size={30} />
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Criar Grupo</Text>
          <TextInput
            placeholder="Nome do Grupo"
            value={groupName}
            onChangeText={setGroupName}
            style={styles.input}
          />
          <TextInput
            placeholder="Descrição"
            value={groupDescription}
            onChangeText={setGroupDescription}
            style={styles.input}
          />

          {/* Seletor de fundo */}
          <Text style={styles.selectorText}>Escolha o fundo do grupo:</Text>
          <View style={styles.imageSelector}>
            <TouchableOpacity onPress={() => setSelectedBackground('1')}>
              <Image source={require('../../../../../assets/12721210_2023-wabc-NewApp-SPORTS.jpg')} style={[styles.image, selectedBackground === '12721210_2023-wabc-NewApp-SPORTS.jpg' && styles.selectedImage]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedBackground('2')}>
              <Image source={require('../../../../../assets/AdobeStock_286933595-Blog-Sport1-2000x936.jpeg')} style={[styles.image, selectedBackground === 'AdobeStock_286933595-Blog-Sport1-2000x936.jpeg' && styles.selectedImage]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedBackground('3')}>
              <Image source={require('../../../../../assets/depositphotos_135034544-stock-photo-boys-playing-soccer-young-football.jpg')} style={[styles.image, selectedBackground === 'depositphotos_135034544-stock-photo-boys-playing-soccer-young-football.jpg' && styles.selectedImage]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedBackground('4')}>
              <Image source={require('../../../../../assets/ea-sports-fc-25-e1725979411169.webp')} style={[styles.image, selectedBackground === 'ea-sports-fc-25-e1725979411169.webp' && styles.selectedImage]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={createGroup} // Chamada da função de criar grupo
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Criar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)} // Fecha o modal
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2FDC7A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escurecido
    padding: 20,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#2FDC7A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#000', // Cor do botão fechar
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectorText: {
    color: '#fff',
    marginVertical: 10,
    fontSize: 16,
  },
  imageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  image: {
    width: 70,
    height: 70,
    marginHorizontal: 5,
    borderWidth: 2, // Largura da borda
    borderColor: 'black', // Cor da borda
  },
  selectedImage: {
    borderColor: 'white', // Borda branca quando a imagem é selecionada
  },
  selectorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});
