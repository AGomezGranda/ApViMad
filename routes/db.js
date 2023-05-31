const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://agomez:Apolin17@cluster-alvarog.vfwblbm.mongodb.net/Cluster-AlvaroG', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
  }
};

module.exports = connectDB;
