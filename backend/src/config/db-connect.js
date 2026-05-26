import mongoose from "mongoose";

async function connectDatabase() {
    mongoose.connect("mongodb://admin:Ecocenter123@ac-05eouxh-shard-00-00.6yhvvye.mongodb.net:27017,ac-05eouxh-shard-00-01.6yhvvye.mongodb.net:27017,ac-05eouxh-shard-00-02.6yhvvye.mongodb.net:27017/ecocenter?replicaSet=atlas-4wed6l-shard-0&authSource=admin&retryWrites=true&w=majority&tls=true");

    return mongoose.connection;
}

export default connectDatabase;