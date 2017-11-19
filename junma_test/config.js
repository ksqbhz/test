//引入log4js  日志文件
// const log4js = require('log4js');
// log4js.configure('./config/log4js.json') //加载配置


const mongoose = require('mongoose');
class MongoDB_Config {
    constructor() {
        this.name = 'junma',
            this.pwd = 'junma',
            this.dbhost = 'localhost',
            this.dbport = 27017,
            this.dbname = 'junMaData',
            this.session = 'session'
    }

    dbUrl() {
        console.log(this.name)
        return `mongodb://${this.dbhost}:${this.dbport}/${this.dbname}`;
    }
}
//
// const MongoDB_Config = {
//     name: 'junma',
//     pwd: 'junma',
//     dbhost: 'localhost',
//     dbport: 27017,
//     dbname: 'junMaData',
//     session: 'session'
// };
// dbUrl: `mongodb://${name}:${pwd}@${dbhost}:${dbport}/${dbname}`,
// const dbUrl = `mongodb://${MongoDB_Config.dbhost}:${MongoDB_Config.dbport}/${MongoDB_Config.dbname}`;


mongoose.Promise = global.Promise;
mongoose.connect(new MongoDB_Config().dbUrl(), {useMongoClient: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function (callback) {
    console.log('ok');
});
console.log(123)
exports.mongoose = mongoose;