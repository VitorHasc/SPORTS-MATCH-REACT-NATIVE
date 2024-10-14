import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

//------------------------------------

  imagemlogo: {
    marginTop: 30,
    width: 300,
    height: 160,
  },
  imagem: {
    position: 'absolute',
    bottom: -160,
    width: 400,
    height: 200,
  },

//------------------------------------

  botaoCad: {
    alignItems: 'center',
    backgroundColor: '#20B761',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 16,
    marginTop: 12,
  },
  botaoCadText: {
    color: 'white',
    fontSize: 15,
  },
  botaoEnt: {
    alignItems: 'center',
    borderColor: '#20B761',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 120,
    borderRadius: 16,
    marginBottom: 12,
    marginTop: 40,
    
  },
  botaoEntText: {
    color: '#20B761',
    fontSize: 15,
  },

//------------------------------------

  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginHorizontal: 60,
    fontSize: 16,
  },

//------------------------------

  textoPergunta: {
    fontFamily: 'LeagueSpartan_700Bold',
    fontSize: 70,
    marginLeft: 20,
    marginTop: 20,
  },
  
});




export default styles;
