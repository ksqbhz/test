var db = require('./../config');
var mongodb=db.mongoose;
var Schema = mongodb.Schema;
var salemanSchema = new Schema({
    saleName: String,
    saleQQ: String,
    saleTelNum: String,
    saleID: Number,
    randomNum: String,
    url: String
},{versionKey:false});

salemanSchema.index({ randomNum: 1});
// exports.
salemanDatamodel = mongodb.model ('salemandata', salemanSchema);

module.exports = salemanDatamodel;

