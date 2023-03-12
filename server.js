const mongoose = require('mongoose');
const app = require('./app')

// configs
const port = 3000;
const DB = 'mongodb://127.0.0.1:27017/ArcaneAura'


// database connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('CONNECTED TO  DATABASE'))
  .catch((err) => {
    console.log(`ERROR in DB connection:`)
    console.log(err);
   })

app.listen(port,()=>{
    console.log(`app started listening at http://localhost:${port}`);
});
