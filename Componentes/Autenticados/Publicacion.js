// import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// create a component
class Publicacion extends Component {
  render() {
    console.log(this.props.autor);
    const { navigation, item, autor } = this.props;
    const { width } = Dimensions.get('window');
    console.log(width);
    const factor = item.width / width;
    const height = item.height / factor;
    return (
      <View>
        <View style={styles.header}>
          <Image
            source={{ uri: autor.fotoURL }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
          <Text>{autor.nombre}</Text>
        </View>
        <Image source={{ uri: item.secure_url }} style={{ width, height }} />
        <View style={styles.footer}>
          <View style={styles.icons}>
            <Ionicons name="md-heart-outline" color="#000000" size={30} style={styles.icon} />
            <Ionicons name="md-chatboxes" color="#000000" size={30} style={styles.icon} />
          </View>
          <View style={styles.texto}>
            <Text>{item.texto}</Text>
          </View>
          <Text>Comentarios</Text>
        </View>
        {/* <Text>Publicacion</Text>
        <Button
          title="Autor"
          onPress={() => {
            navigation.navigate('Autor');
          }}
        />
        <Button
          title="Comentarios"
          onPress={() => {
            navigation.navigate('Comentarios');
          }}
        /> */}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  footer: {
    marginHorizontal: 16,
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
    marginVertical: 16,
  },
  texto: {
    marginBottom: 16,
  },
});

// make this component available to the app
export default Publicacion;
