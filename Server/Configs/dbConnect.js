const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log('Database connection SucessFull');
}catch (err){
    console.log('Database connection Failed');

   }

};

module.exports = dbConnect;
