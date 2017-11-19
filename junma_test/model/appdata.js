var db = require('./../config');
var mongodb=db.mongoose;
var Schema = mongodb.Schema;

var AppUserSchema = new Schema({
    AppUserName: String,
    pwd: String,
    telNumber: String,
    AppUserID: Number,
},{versionKey:false});


var APPtradeDataSchema = new Schema({
    ApptradeID: Number,
    AppUser: String
},{versionKey:false});

exports.AppUserDatamodel = mongodb.model ('appusersdata', AppUserSchema);
exports.APPtradeDatamodel = mongodb.model ('apptradedata', APPtradeDataSchema);

// module.exports = AppUserDatamodel;
// module.exports = APPtradeDatamodel;
