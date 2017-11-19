let TokenModel=require('./../model/token')
class TokenClass{
    updateByUser(user, date, callback) {
        TokenModel.update({user: user}, {$set: date}, {upsert: true}, (err, result) => {
            if (err) {
                errLogger.error(err)
            }
            else {
                callback(result);
            }
        });
    }

}
