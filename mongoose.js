const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nicolas95u:<XRxK5mr9G9Q0OZxV>@cluster0.84npekh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;