const AWS = require('aws-sdk');
const keys = require('../config/keys');
const { v4 } = require('uuid')
const requireLogin = require('../middlewares/requireLogin')

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
})

module.exports = app => {
    app.get('/api/upload', requireLogin, async (req, res) => {
        const key = `${req.user.id}/${v4()}.jpeg`
        s3.getSignedUrl('putObject', {
            Bucket: "bucket-name",
            ContentType: "image/jpeg",
            //userId/random-string.jpeg
            Key: key
        }, (err, url) => {
            res.send({ key, url })
        })
    })
}