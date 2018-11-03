import { takeEvery, call, select, put, all } from 'redux-saga/effects';
import { autenticacion, baseDeDatos } from '../Servicios/Firebase';
import CONSTANTES from '../CONSTANTES';
import {
  actionAgregarPublicacionesStore,
  actionAgregarAutoresStore,
  actionExitoSubirPublicacion,
  actionErrorSubirPublicacion,
} from '../ACCIONES';

const registroEnFirebase = values =>
  autenticacion
    .createUserWithEmailAndPassword(values.correo, values.password)
    .then(success => success.toJSON());

const registroEnBaseDeDatos = ({
  uid, email, nombre, fotoURL,
}) =>
  baseDeDatos.ref(`usuarios/${uid}`).set({
    nombre,
    email,
    fotoURL,
  });

const registroFotoCloudinary = ({ imagen }) => {
  console.log(imagen);
  const { uri, type } = imagen;
  const splitName = uri.split('/');
  const name = [...splitName].pop();

  const foto = {
    uri,
    type,
    name,
  };

  const formImagen = new FormData();
  formImagen.append('upload_preset', CONSTANTES.CLOUDINARY_PRESET);
  formImagen.append('file', foto);

  return fetch(CONSTANTES.CLOUDINARY_NAME, {
    method: 'POST',
    body: formImagen,
  }).then(response => response.json());
};

function* sagaRegistro(values) {
  try {
    // cargar foto
    const imagen = yield select(state => state.reducerImagenSignUp);
    console.log(imagen);
    const urlFoto = yield call(registroFotoCloudinary, imagen);
    console.log(urlFoto);
    console.log(urlFoto.secure_url);
    const fotoURL = urlFoto.secure_url;
    const registro = yield call(registroEnFirebase, values.datos);
    const { email, uid } = registro;
    const { datos: { nombre } } = values;
    // uid, email, nombre
    yield call(registroEnBaseDeDatos, {
      uid,
      email,
      nombre,
      fotoURL,
    });
  } catch (error) {
    console.log(error);
  }
}

const loginEnFirebase = ({ correo, password }) =>
  autenticacion.signInWithEmailAndPassword(correo, password).then(success => success.toJSON());

function* sagaLogin(values) {
  try {
    console.log(values);
    const resultado = yield call(loginEnFirebase, values.datos);
    console.log(resultado);
  } catch (error) {
    console.log(error);
  }
}

const escribirFirebase = ({
  width, height, secure_url, uid,
}, texto = '') =>
  baseDeDatos
    .ref('publicaciones/')
    .push({
      width,
      height,
      secure_url,
      uid,
      texto,
    })
    .then(response => response);

const escribirAutorPublicaciones = ({ uid, key }) =>
  baseDeDatos
    .ref(`autor-publicaciones/${uid}`)
    .update({ [key]: true })
    .then(response => response);

function* sagaSubirPublicacion({ values }) {
  try {
    const imagen = yield select(state => state.reducerImagenPublicacion);
    const usuario = yield select(state => state.reducerSesion);
    const { uid } = usuario;
    console.log(uid);
    const resultadoImagen = yield call(registroFotoCloudinary, imagen);
    console.log(resultadoImagen);
    const { width, height, secure_url } = resultadoImagen;
    const parametrosImagen = {
      width,
      height,
      secure_url,
      uid,
    };
    const escribirEnFirebase = yield call(escribirFirebase, parametrosImagen, values.texto);
    console.log(escribirEnFirebase.key);
    const { key } = escribirEnFirebase;
    const parametrosAutorPublicaciones = { uid, key };
    const resultadoEscribirAutorPublicaciones = yield call(
      escribirAutorPublicaciones,
      parametrosAutorPublicaciones,
    );
    console.log(resultadoEscribirAutorPublicaciones);
    yield put(actionExitoSubirPublicacion());
  } catch (error) {
    console.log(error);
    yield put(actionErrorSubirPublicacion());
  }
}

const descargarPublicaciones = () =>
  baseDeDatos
    .ref('publicaciones/')
    .once('value')
    .then((snapshot) => {
      const publicaciones = [];
      snapshot.forEach((childSnapshot) => {
        const { key } = childSnapshot;
        const publicacion = childSnapshot.val();
        publicacion.key = key;
        publicaciones.push(publicacion);
      });
      return publicaciones;
    });

const descargarAutor = uid =>
  baseDeDatos
    .ref(`usuarios/${uid}`)
    .once('value')
    .then(snapshot => snapshot.val());

function* sagaDescargarPublicaciones() {
  try {
    const publicaciones = yield call(descargarPublicaciones);
    // console.log(publicaciones);
    const autores = yield all(publicaciones.map(publicacion => call(descargarAutor, publicacion.uid)));
    // yield call()  {CALL: {fn: descargarPublicaciones, args: []}}
    console.log(autores);
    yield put(actionAgregarAutoresStore(autores));
    yield put(actionAgregarPublicacionesStore(publicaciones));
  } catch (error) {
    console.log(error);
  }
}

export default function* funcionPrimaria() {
  yield takeEvery(CONSTANTES.REGISTRO, sagaRegistro);
  yield takeEvery(CONSTANTES.LOGIN, sagaLogin);
  yield takeEvery(CONSTANTES.SUBIR_PUBLICACION, sagaSubirPublicacion);
  yield takeEvery(CONSTANTES.DESCARGAR_PUBLICACIONES, sagaDescargarPublicaciones);
  // yield ES6
  console.log('Desde nuestra función generadora');
}
