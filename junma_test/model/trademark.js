var db = require('./../config');
var mongodb=db.mongoose;
var Schema = mongodb.Schema;
var trademarkSchema = new Schema({
    name: String,
    type: String,
    applytime: String,
    mark: String,
    production: String,
    signdate: String,
    price: String,
    saleprice: String,
    saledate: String,
    money: String,
    buff: String,
    tradeID: Number,
    appuser: Array
}, {versionKey: false});

trademarkSchema.index({buff: 1, type: 1,name:1,tradeID:1});
// 创建User的mongodb模型
trademarkDatamodel = mongodb.model ('trademarkdata', trademarkSchema);

module.exports = trademarkDatamodel;
