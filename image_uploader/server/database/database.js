const mongoose = require('mongoose');
const config = require('../../config');

const Connect = async() => {
    try {
        const con = await mongoose.connect(config.MONGO_URI, {
            // remove unwanted console messages
            useNewUrlParser: true,
            useUnifiedToplogy: true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        console.log(`MongoDB connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = Connect;