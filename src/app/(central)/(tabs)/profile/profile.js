import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import calcularIdade from '../../../compfunc/pegarIdade';
import { useGlobalSearchParams } from 'expo-router';

export default function Perfil({id}) {
  //amanhã usar o login T em todas as paginas pra saber quem que ta chamando, lembrar de usar isso na API, depois de configurar o perfil vai ser bom configurar as mensagens individuais
  const [nome, setNome] = useState("Nome usuário")
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet")
  const [idade, setIdade] = useState("Nome usuário")
  const [genero, setGenero] = useState("Não Binário")
  const [esportes, setEsportes] = useState(null);
  const [caminhoPerfil, setCaminhoPerfil] = useState(null);

  useEffect(() => {
      if(id == undefined){
        const esteUsuario = async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const config = {
              headers: {
                'authorization': token,
              },
            };
            const curl = process.env.EXPO_PUBLIC_API_URL;
            const url = curl + '/users/perfil';
            const resposta = await axios.post(url, null, config);
            console.log(resposta)
            setNome(resposta.data.user.nome);
            setBio(resposta.data.user.biografia);
            setIdade(calcularIdade(resposta.data.user.datanasc));
            setEsportes(resposta.data.user.esportes);
            setGenero(resposta.data.user.genero);
            setCaminhoPerfil(resposta.data.user.perfilFoto)
          } catch (error) {
            console.error(error);
          }
        };
        esteUsuario();
      }
      else if(id != undefined){
        const outroUsuario = async () => {
          try {
            const curl = process.env.EXPO_PUBLIC_API_URL;
            const url = curl + '/users/user';
            const resposta = await axios.get(url, {
              params: {
                id: id,
              }
            });
            console.log(resposta)  
            setNome(resposta.data.nome);
            setBio(resposta.data.biografia);
            setIdade(calcularIdade(resposta.data.datanasc));
            setEsportes(resposta.data.esportes); 
            console.log(resposta.data.genero);
            setGenero(resposta.data.genero);
            setCaminhoPerfil(resposta.data.perfilFoto) 
          } catch (error) {
            console.error(error);
          }
      }
      outroUsuario();
      
    }
  }, []);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
  
      <TouchableOpacity style={{position: 'absolute', top: 20, right: 20,}}>
        <Image
          source={require('../../../../../assets/Instagram_icon.png')}
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: '#D9D9D9', marginTop: 80, overflow: 'hidden' }}>
            <ImageBackground 
              source={{ uri: caminhoPerfil }}
              style={{ width: '100%', height: '100%' }} 
            />
          </View>
        <Text style={{marginTop: 25, fontSize: 30, fontWeight: 500}}>{nome}</Text>
        <Text style={{marginTop: 25, fontSize: 15, fontWeight: 500}}>{bio}</Text>
        <View style={{ flexDirection: 'row', marginTop: 100, width: '100%', justifyContent: 'space-around' }}>
          <Text style={{ fontSize: 23, fontWeight: '500', flex: 1, textAlign: 'center' }}>{idade} Anos</Text>
          <Text style={{ fontSize: 23, fontWeight: '500', flex: 1, textAlign: 'center' }}>{genero}</Text>
        </View>
        <FlatList 
          contentContainerStyle={{ flexDirection: 'row', marginTop: 100 }}
          data={esportes}
          keyExtractor={item => item.nome}
          renderItem={({ item }) => (
            <View style={{margin: 15, backgroundColor: '#D9D9D9', paddingHorizontal: 10,paddingVertical: 5, borderRadius: 30}}>
              <Text style={{ fontSize: 18, fontWeight: '500', flex: 1, textAlign: 'center' }}>{item.nome}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
