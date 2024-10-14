import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import styles from '../../styles/StylesConvidado';
import ComponenteCad from './compfunclogin/cadComp';
import { useEffect, useState } from 'react';

export default function Cadastrar() {

  
  return (
    <View style={styles.container}>
      <ComponenteCad/>
      <Image
        source={require('../../../assets/image-removebg-preview (21).png')}
        style={[styles.imagem, {bottom:-90}, {top: 600}]}
      />
    </View>
  ); 
}
