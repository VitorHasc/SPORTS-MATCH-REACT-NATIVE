import React, { useEffect} from 'react';
import { Text, View} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts, LeagueSpartan_700Bold } from '@expo-google-fonts/league-spartan';


export default function Index() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    LeagueSpartan_700Bold,
  });

  useEffect(() => {
    
    const checkToken = async () => {
      try {
        console.log("tentando pegar o token");
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log("tentando pegar o token");
          const config = {
            headers: {
              'authorization': token,
            },
          };
          console.log("tentando pegar o token");
          const curl = process.env.EXPO_PUBLIC_API_URL;
          const url = curl + '/e';
          const response = await axios.post(url, null, config);
          console.log("token funcionou" + response);
          router.replace('/(central)/(tabs)/search/search');
        } else {
          console.log("num deu else");
          console.log("else");
          router.replace('/entrar');
        }
      } catch (error) { 
        console.log("num deu");
        console.log("catch/error");
        router.replace('/entrar');
      }
    };

    checkToken();
  }, []);
  
  return (
    <View style={{backgroundColor: 'green'}}>
    </View>
  );
}
 