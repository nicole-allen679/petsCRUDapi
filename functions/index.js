const admin = require('firebase-admin')
const functions = require('firebase-functions')
const express = require('express')
const app = express()
const serviceAccount = require('./credentials')

let db;

function connectToFb() {
  if (!db) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    db = admin.firestore()
  }
}

const allPets = (req, res) => {
  connectToFb()
  db.collection('pets')
    .get()
    .then((allPets) => {
      const arrayOfPets = []
      allPets.forEach((pet) => arrayOfPets.push(pet.data()))
      res.send(arrayOfPets)
    })
    .catch((err) => res.status(500).send('Error getting pets' + err.message))
}

app.get('/pets', allPets)

app.post('/pets', (req, res) => {
  connectToFb()
  const newPet = req.body
  db.collection('pets')
    .add(newPet)
    .then(() => allPets(req, res))
    .catch((err) => res.status(500).send('Error adding pets' + err.message))
})

app.patch('/pets', (req, res) => {
  connectToFb()
  const changePet = req.body
    .update(changePet)
    .then(() => allPets(req, res))
    .catch((err) => res.status(500).send('Error changing pets' + err.message))
})

app.delete('/pets', (req, res) => {
  connectToFb()
  const { petId } = req.params
  db.collection('pets')
    .doc(petId)
    .delete()
    .then(() => allPets(req, res))
    .catch((err) => res.status(500).send('Error deleting pet' + err.message))
})

exports.app = functions.https.onRequest(app)