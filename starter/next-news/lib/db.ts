import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

try {
  firebase.initializeApp({
    databaseURL: 'https://hacker-news.firebaseio.com',
  })
} catch (err) {
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

const root = firebase.database().ref('v0')

export default root
