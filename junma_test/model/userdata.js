var db = require('./../config');
var mongodb=db.mongoose;
var Schema = mongodb.Schema;
var WebUserSchema = new Schema({
    name: String,
    UserName: String,
    password: String,
    level: String,
},{versionKey:false});

WebUserSchema.index({ UserName: 1});

var UserDatamodel = mongodb.model ('userdata', WebUserSchema);

module.exports = UserDatamodel;

