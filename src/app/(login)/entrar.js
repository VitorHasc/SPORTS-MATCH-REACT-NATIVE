import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { Link, router } from "expo-router";
import axios from 'axios';
import styles from '../../styles/StylesConvidado';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const takinho = AsyncStorage.getItem('token');
  console.log(takinho);


  const botaoChama = async () => {
    let data = {};
    const curl = process.env.EXPO_PUBLIC_API_URL;
    const url = curl + '/users/login';
    if (email.includes('@')) {
      data = {
        email: email,
        senha: senha
      };
    } else if (!email.includes('@')) {
      data = {
        nome: email,
        senha: senha
      };
    }

    try {
      const resposta = await axios.post(url, data);
      console.log(resposta.data);
      const token = resposta.data.token;
      const key = 'token';
      await AsyncStorage.setItem(key, token);
      const value = await AsyncStorage.getItem(key);
      console.log(value);
      console.log("GRITOOOOOS");
      router.replace('/(central)/(tabs)/search/search');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../../assets/image-removebg-preview (22).png')}
          style={styles.imagemlogo}
        />
      </View>

      <TextInput style={[styles.input,{marginTop: 100} ]} placeholder='Email/Nome' keyboardType="email-address" value={email} onChangeText={setEmail}/>
      <TextInput style={[styles.input,{marginTop: 20} ]} placeholder='Senha' secureTextEntry={true} value={senha} onChangeText={setSenha}/>

      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.botaoEnt} onPress={botaoChama}>
          <Text style={styles.botaoEntText}>Entrar</Text>
        </TouchableOpacity>
        <Text style={{color:'#20B761'}}>ou</Text>
        <Link href="/cadastrar" asChild>
          <TouchableOpacity style={styles.botaoCad}>
            <Text style={styles.botaoCadText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Image
        source={require('../../../assets/image-removebg-preview (21).png')}
        style={[styles.imagem, {bottom:-90}, {top: 600}]}
      />
    </View>
  );
}
