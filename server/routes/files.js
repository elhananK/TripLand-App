var express = require('express');
var db = require('../db');
var router = express.Router();
var multer = require('multer');
var imagesLocation = __dirname + '/../images';
var upload = multer({ dest: imagesLocation});
var fs =  require('fs');

router.post('/upload', upload.single('file'), uploadImage);

router.get('/download/:id',function (req, res) {


    db.Image.findById(req.params.id, function (error,image) {

        if(image){
            fs.readFile(image.path, function (err, content) {
                if (err) {
                    res.writeHead(400, {'Content-type': 'text/html'})
                    console.log(err);
                    res.end("No such image");
                } else {
                    //specify the content type in the response will be an image
                    res.writeHead(200, {'Content-type': 'image/jpg'});
                    res.end(content);
                }
            });
        }

    });



});


 function uploadImage(req, res) {
        var myFile = req.file;
        var newImage = new db.Image({
            fieldname: myFile.fieldname,
            originalname: myFile.originalname,
            encoding: myFile.encoding,
            mimetype: myFile.mimetype,
            destination: myFile.destination,
            filename: myFile.filename,
            path: myFile.path,
            size: myFile.size
        });


        newImage.save(function (err, image) {
            if (!err) {
                if (image) {
                    res.json(image);
                }
                else {
                    res.json({message: "something went wrong in saving new post"});
                }
            }
            else {
                res.json({message: "something went wrong in saving new post"});
            }
        });
    };


module.exports = router;
