// import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { connect } from 'react-redux';
import SignInForm from './Formas/SignInForm';
import { actionLogin } from '../../Store/ACCIONES';

// create a component
class SignIn extends Component {
  signinDeUsuario = (values) => {
    this.props.login(values);
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <SignInForm login={this.signinDeUsuario} />
        <Button
          title="SignUp"
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#90EE90',
    paddingHorizontal: 16,
  },
});

const mapStateToProps = state => ({
  prop: state.prop,
});

const mapDispatchToProps = dispatch => ({
  login: (datos) => {
    dispatch(actionLogin(datos));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
