const admin = require('firebase-admin')
const functions = require('firebase-functions')
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

app.get('/pets', (req, res) => {
  connectToFb()
  db.collection('pets')
    .get()
    .then((allPets) => {
      const arrayOfPets = []
      allPets.forEach((pet) => arrayOfPets.push(pet.data()))
      res.send(allPets)
    })
    .catch((err) => res.status(500).send('Error getting pets' + err.message))
})

app.add('/pets', (req, res) => {
  connectToFb()
  const newPet = req.body
  db.collection('pets')
    .add(newPet)
    .then(() => this.allPets(req, res))
    .catch((err) => res.status(500).send('Error adding pets' + err.message))
})

app.update('/pets', (req, res) => {
  connectToFb()
  const changePet = req.body
    .update(changePet)
    .then(() => this.allPets(req, res))
    .catch((err) => res.status(500).send('Error changing pets' + err.message))
})

app.delete('/pets', (req, res) => {
  connectToFb()
  const { petId } = req.params
  db.collection('pets')
    .doc(petId)
    .delete()
    .then(() => this.allPets(req, res))
    .catch((err) => res.status(500).send('Error deleting pet' + err.message))
})
