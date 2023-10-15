const dotenv = require('dotenv');
dotenv.config();
const { nanoid } = require('nanoid');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    }
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'adorn9',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `${nanoid()}`);
        },
    }),
});

module.exports = upload;