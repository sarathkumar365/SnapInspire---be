const dotenv = require('dotenv').config({path:'./configs.env'})

const mongoose = require('mongoose');
const app = require('./app')

// database connection
mongoose
  .connect(process.env.Local_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('CONNECTED TO  DATABASE'))
  .catch((err) => {
    console.log(`ERROR in DB connection:`)
    console.log(err);
   })

app.listen(process.env.PORT,()=>{
    console.log(`app started listening at http://localhost:${process.env.PORT}`);
});
