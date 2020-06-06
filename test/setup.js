// require('../models/User');
// const keys = require('../config/keys')
// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
// const connectDB = async () => {
//     try {
//         await mongoose.connect(keys.monoURI, {
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useFindAndModify: true,
//             useMongoClient: true
//         })
//     } catch (error) {
//         console.log(error.message);
//     }
// }
// connectDB();
jest.setTimeout(30000);
