import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import config from '../config';

firebase.initializeApp(config.firebase);
