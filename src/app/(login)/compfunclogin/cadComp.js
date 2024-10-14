import { useFonts, LeagueSpartan_700Bold } from '@expo-google-fonts/league-spartan';
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Button, Image } from 'react-native';
import styles from '../../../styles/StylesConvidado';
import * as Animatable from 'react-native-animatable';
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
  const [genero, setGenero] = useState('masc');

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [pergunta, setPergunta] = useState("qual seu nome?");
  const [input, setInput] = useState(null);
  const [animKey, setAnimeKey] = useState(0);

  const [imageUri, setImageUri] = useState(null);

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
      formData.append('genero', genero)
      //falta nick e biografia
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
        cadApi(); //mudar eventualmente
        setPergunta("");
        setInput(
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 20 }}>
          </View>
        );
        break;
      case 7:
        console.log("bananas")
        console.log(imageUri)
        cadApi();
      default:
        console.log('error');
    }
  }, [alter, longitude, latitude, cidade, imageUri]);

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
        console.log(imageUri)
        if (genero) {
          setAlter(alter + 1);
        }
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
