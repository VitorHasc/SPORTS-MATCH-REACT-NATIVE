import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FlatlistBuild from './flatlistBuild';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Flatlistsearch({ but, genero, idademin, idademax, esporte, latitude, longitude, nome }) {
  const [resposta, setResposta] = useState({ data: { usuarios: [] } });
  const [pagina, setPagina] = useState(1);

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
      console.log("SOCORROOOOOOOO")
      console.log(novaresposta)
      setResposta(prevResposta => {
        if (pagina == 1) {
          // Se for a primeira página, substitui a resposta anterior
          return {
            data: {
              usuarios: novaresposta.data.usuarios || []
            },
            pagina
          };
        } else if (pagina != 1) {
          // Caso contrário, junta os 2 arrays
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
      console.log("TUDO ERRADO")
      console.error(error);
    }
  }
  

  const recall = () => {
    console.log("chegou no fim!");
    setPagina(prevPagina => {
      const nextPage = prevPagina + 1;
      api(nextPage);
      return nextPage;
    });
  }

  useEffect(() => {
    if (but == 1) {
      setPagina(1);
      api(1);
    }
    else if (but == 2){
      
    }
  }, [but, genero, idademin, idademax, esporte]); //é o seguinte, caso mudemos um dos filtros, o useEffect vai acontecer novamente, e se ele acontecer novamente, a pagina é zerada, caindo na primeira regras daquelas de cima, ou seja, assim caso eu mude ele recarrega tudo, eliminando os homens se por exemplo eu escolher mulheres.
  

  return (
    <FlatlistBuild data={resposta.data} but={but} recall={recall} />
  );
}
