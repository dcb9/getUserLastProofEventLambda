const { getValidSocialProof } = require('./lib/index.js')

exports.handler = async function(event, context, callback) {
    try{
        socialProof = await getValidSocialProof('0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d', 'twitter')
        callback(null, socialProof)
    } catch(e) {
        callback(e)
    }
}
