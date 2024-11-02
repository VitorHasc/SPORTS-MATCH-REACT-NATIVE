import { useFonts, LeagueSpartan_700Bold } from '@expo-google-fonts/league-spartan';
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Button, Image, FlatList, ScrollView } from 'react-native';
import styles from '../../../styles/StylesConvidado';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import * as Location from 'expo-location';
import CordenadasCity from '../../compfunc/genCord';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

export default function ComponenteCad() {

  const [fontsLoaded] = useFonts({
    LeagueSpartan_700Bold,
  });

  const esportesMaisPraticados = [
    'Futebol',
    'Vôlei',
    'Basquete',
    'Natação',
    'Ciclismo',
    'Corrida',
    'Tênis',
    'Handebol',
    'Jiu-Jitsu',
    'Ginástica',
    'Surf',
    'Capoeira',
    'Futsal',
    'Rugby',
    'Atletismo',
    'Polo Aquático',
    'Skate',
    'Arco e Flecha',
    'Badminton',
    'Boxe'
  ];

  const router = useRouter();

  const [alter, setAlter] = useState(1);

  const [nome, setNome] = useState(null);
  const [dia, setDia] = useState(null);
  const [mes, setMes] = useState(null);
  const [ano, setAno] = useState(null);
  const [cidade, setCidade] = useState('');
  const [email, setEmail] = useState(null);
  const [senha, setSenha] = useState(null);
  const [senhac, setSenhaC] = useState(null);
  const [idade, setIdade] = useState(null);
  const [genero, setGenero] = useState(null);
  const [biografia, setBiografia] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [pergunta, setPergunta] = useState("qual seu nome?");
  const [input, setInput] = useState(null);
  const [animKey, setAnimeKey] = useState(0);

  const [imageUri, setImageUri] = useState(null);

  const [selectedSports, setSelectedSports] = useState([]);


  const handleImagePicker = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result.assets[0].uri)
    setImageUri(result.assets[0].uri);
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  };

  const cadApi = async () => {
    try {
      const formData = new FormData();

      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('cidade', cidade);
      formData.append('senha', senha);
      formData.append('datanasc', idade);
      formData.append('longitude', longitude);
      formData.append('latitude', latitude);
      formData.append('genero', genero);
      formData.append('biografia', biografia);
      formData.append('esportes', selectedSports);

      if (imageUri) {
        const fileInfo = await FileSystem.getInfoAsync(imageUri); //Getinfo ja faz parte do tipo de váriavel ao qual pertence o imageUri

        formData.append('file', {
          uri: imageUri,
          name: fileInfo.uri.split('/').pop(), //o split esta dividindo o array para cada / e então o pop deixa a ultima coisa escrita somente, que seria o .png acho que é isso, mas ainda tenho duvida
          type: 'image/jpeg'
        });
      }

      console.log(formData);
      const curl = process.env.EXPO_PUBLIC_API_URL;
      const url = curl + '/users/registro';

      const resposta = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("BANANAAAAAAAAAA");
      console.log(resposta.data);
      router.replace('/entrar');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCidade = async () => {
      if (latitude !== null && longitude !== null) {
        try {
          const city = await CordenadasCity(latitude, longitude);
          if (city) {
            setCidade(city || '');
          }
          console.log(city);
        } catch (error) {
          console.log('Error fetching city:', error);
        }
      }
    };

    fetchCidade();
  }, [latitude, longitude]);

  useEffect(() => {
    console.log(alter)
    switch (alter) {
      case 1:
        setPergunta("qual seu nome?");
        setInput(
          <TextInput
            style={[styles.input, { marginTop: 20 }]}
            placeholder='Nome'
            value={nome}
            onChangeText={setNome}
          />
        );
        break;
      case 2:
        console.log(nome);
        setPergunta("qual sua idade?");
        setInput(
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { marginHorizontal: 5 }]}
                placeholder='DD'
                keyboardType='numeric'
                maxLength={2}
                value={dia}
                onChangeText={setDia}
              />
              <Text>/</Text>
              <TextInput
                style={[styles.input, { marginHorizontal: 5 }]}
                placeholder='MM'
                keyboardType='numeric'
                maxLength={2}
                value={mes}
                onChangeText={setMes}
              />
              <Text>/</Text>
              <TextInput
                style={[styles.input, { marginHorizontal: 5 }]}
                placeholder='AAAA'
                keyboardType='numeric'
                maxLength={4}
                value={ano}
                onChangeText={setAno}
              />
            </View>
          </View>
        );
        setAnimeKey(prevKey => prevKey + 1);
        break;
      case 3:
        setIdade(`${ano}-${mes}-${dia}T00:00:00.000Z`);
        getLocation();
        setPergunta("de onde você é?");
        setInput(
          <TextInput
            style={[styles.input, { marginTop: 20 }]}
            placeholder='Cidade'
            value={cidade}
            onChangeText={setCidade}
          />
        );
        setAnimeKey(prevKey => prevKey + 1);
        console.log(idade);
        break;
      case 4:
        console.log(longitude, latitude);
        setPergunta("email e senha");
        setInput(
          <View>
            <TextInput
              style={[styles.input, { marginTop: 20 }]}
              placeholder='Email'
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[styles.input, { marginTop: 30 }]}
              placeholder='Senha'
              secureTextEntry={true}
              value={senha}
              onChangeText={setSenha}
            />
            <TextInput
              style={[styles.input, { marginTop: 30 }]}
              placeholder='Confirmar senha'
              secureTextEntry={true}
              value={senhac}
              onChangeText={setSenhaC}
            />
          </View>
        );
        setAnimeKey(prevKey => prevKey + 1);
        break;
      case 5:
        setPergunta("Foto de perfil");
        setInput(
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={handleImagePicker}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: 'gray',
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                {imageUri && (
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
            <Button title="Escolher Imagem" onPress={handleImagePicker} />
          </View>
        );
        setAnimeKey(prevKey => prevKey + 1);
        break;
      case 6:
        setPergunta("Seu Gênero");
        setInput(
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column', // Altera a direção para coluna
              marginTop: 120,
            }}
          >
            <TouchableOpacity onPress={() => setGenero("fem")}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#6200ee',
                paddingVertical: 10, // Menos padding vertical
                paddingHorizontal: 12, // Menos padding horizontal
                borderRadius: 8,
                elevation: 4,
                shadowOpacity: 0.3,
                shadowRadius: 4,
                marginVertical: 5, // Margem vertical entre os botões
                width: '80%', // Largura fixa
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Feminino
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGenero("outro")}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#6200ee',
                paddingVertical: 10, // Menos padding vertical
                paddingHorizontal: 12, // Menos padding horizontal
                borderRadius: 8,
                elevation: 4,
                shadowOpacity: 0.3,
                shadowRadius: 4,
                marginVertical: 5, // Margem vertical entre os botões
                width: '80%', // Largura fixa
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Outro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => setGenero("masc")}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#6200ee',
                paddingVertical: 10, // Menos padding vertical
                paddingHorizontal: 12, // Menos padding horizontal
                borderRadius: 8,
                elevation: 4,
                shadowOpacity: 0.3,
                shadowRadius: 4,
                marginVertical: 5, // Margem vertical entre os botões
                width: '80%', // Largura fixa
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Masculino
              </Text>
            </TouchableOpacity>
          </View>
        );
        setAnimeKey(prevKey => prevKey + 1);
        break;
      case 7:
        setPergunta("Sua Biografia");
        setInput(
          <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
            </Text>
            <TextInput
              style={{
                height: 100,
                width: '90%',
                borderColor: '#6200ee',
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
                backgroundColor: '#f5f5f5',
                elevation: 2,
              }}
              multiline
              numberOfLines={4}
              placeholder="Escreva algo sobre você..."
              placeholderTextColor="#888"
              onChangeText={(text) => setBiografia(text)}
              value={biografia}
            />
          </View>
        );
        setAnimeKey(prevKey => prevKey + 1);
        break;
      case 8:
        const esportes = [
          "Futebol", "Vôlei", "Basquete", "Tênis", "Handebol",
          "Futsal", "Rugby", "Natação", "Jiu-Jitsu", "Karate",
          "Atletismo", "Ciclismo", "Golfe", "Surf", "Skate",
          "Academia", "Hóquei", "Ginástica", "Escalada", "Boxe",
          "Sinuca", "Frescobol", "Tiro com Arco",
          "Frisbee", "Badminton", "Softbol", "Críquete",
          "Baseball", "Handebol", "Futebol Americano", "bocha"
        ];

        const renderItem = ({ item }) => {
          const isSelected = selectedSports.includes(item);
          return (
            <TouchableOpacity
              onPress={() => {
                const newSelectedSports = isSelected
                  ? selectedSports.filter(sport => sport !== item)
                  : [...selectedSports, item];
                setSelectedSports(newSelectedSports);
              }}
              style={{
                backgroundColor: isSelected ? 'green' : 'gray',
                padding: 10,
                margin: 5,
                borderRadius: 15, // Borda arredondada
                flexGrow: 1, // Permite que o botão cresça
                flexBasis: 'auto', // Flexível para ocupar o espaço do texto
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>{item}</Text>
            </TouchableOpacity>
          );
        };

        setPergunta("O que você joga?");
        setInput(
          <View style={{ padding: 10 }}>
            <ScrollView
              style={{ maxHeight: 300 }} // Define a altura máxima para permitir o scroll
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap', // Permite quebra de linha
                justifyContent: 'flex-start', // Alinha itens à esquerda
              }}
            >
              {esportes.map(sport => renderItem({ item: sport }))}
            </ScrollView>
          </View>
        );
        setAnimeKey(prevKey => prevKey + 1);
        break;

      default:
        console.log('error');
    }
  }, [alter, longitude, latitude, cidade, imageUri, selectedSports]);

  //------------------------------------------------------VALIDACAO------------------------------------------------//   
  //------------------------------------------------------VALIDACAO------------------------------------------------//   
  async function onPress() {
    switch (alter) {
      case 1:
        if (nome) {
          setAlter(alter + 1);
        }
        break;
      case 2:
        if (dia && mes && ano) {
          setAlter(alter + 1);
        }
        break;
      case 3:
        if (cidade) {
          setAlter(alter + 1);
        }
        break;
      case 4:
        if (senha == senhac) {
          if (email && senha) {
            try {
              const curl = process.env.EXPO_PUBLIC_API_URL;
              const url = curl + '/users/registroMR';
              const resposta = await axios.post(url, { email });
              console.log(resposta.data.validade);
              if (resposta.data.validade != false) {
                setAlter(alter + 1);
                console.log("vacilao");
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        break;
      case 5:
        if (imageUri) {
          setAlter(alter + 1);
        }
        break;
      case 6:
        console.log("CRASH AAAAAA" + genero)
        if (genero) {
          setAlter(alter + 1);
        }
        break;
      case 7:
        console.log(alter);
        if (biografia) {
          setAlter(alter + 1);
        }
        break;
      case 8:
        setAlter(alter + 1);
        await cadApi();
        router.replace("/entrar");
        break;
      case 9:

        break;
      default:
        break;
    }
  }
  //------------------------------------------------------TELA------------------------------------------------//   
  //------------------------------------------------------TELA------------------------------------------------//   
  return (
    <View>
      <Animatable.View animation={"pulse"} key={animKey}>
        <Text style={[styles.textoPergunta, { marginBottom: 40 }]}>{pergunta}</Text>
        {input}
      </Animatable.View>
      <View style={{ position: 'absolute', top: 500, left: 0, right: 0, alignItems: 'center' }}>
        <TouchableOpacity onPress={onPress} style={styles.botaoCad}>
          <Text style={styles.botaoCadText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
