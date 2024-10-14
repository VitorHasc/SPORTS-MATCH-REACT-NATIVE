import { StyleSheet } from 'react-native';

const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 17,
  },
  input: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    padding: 10,
    paddingBottom: 15,
  },
  iconContainer: {
    marginTop: 2,
    marginLeft: 5, 
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 12,
  },
  botaoGU: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 30,
  },
  //--------------------CARDS-------------------//
  card: {
    borderColor: '#EAEAEA',
    backgroundColor: '#EAEAEA',
    borderWidth: 2,
    margin: 5,
    borderRadius: 6,
    overflow: 'hidden',
    width: 180,
    height: 280,
  },
  /*cardHeader: {
    backgroundColor: '#EAEAEA',
    flex: 5, 
  },
  cardBody: {
    backgroundColor: '#EAEAEA',
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  */

  //---------------------------------------------botaofechar

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background escuro e transparente
    backgroundColor: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
  },
  modalContent: {
    backgroundColor: 'white',
    height: '35%', // Ocupa metade da tela
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },
  
});




export default stylesHome;
