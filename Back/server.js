const express = require('express');
const Test = require('./test.js');
const User = require('./user/user.js');
const app = express();
const port = 3000;

app.get('/', (req , res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
app.use('/test', Test);
app.use('/user', User);

module.exports = app;