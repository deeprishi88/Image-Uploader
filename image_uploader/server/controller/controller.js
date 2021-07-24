const UploadModel = require('../model/schema');
const fs = require('fs');


exports.home = async(req,res) => {
    const all_images = await UploadModel.find()   // to get all data from mongoDb database, find() returns an array containing all images as objects
    res.render('main', {Images:all_images});  // passing all_images to main to that we can access it in main
}

exports.uploads = (req,res,send) => {
    const files = req.files;
    if(!files){
        const error = new Error('Please choose images');
        error.httpStatusCode = 400;
        return next(error);
    }
    // convert images to base64 encoding (base64 encoding means to convert data into ascii character set)
    let imgArray = files.map((file)=>{
        let img = fs.readFileSync(file.path)  //will store the buffered image in img
        return encode_image = img.toString('base64')
    })
    
    let result = imgArray.map((src,index) => {
        // create object to store data in database/collection
        let finalImg = {
            filename: files[index].originalname,
            contentType: files[index].mimetype,
            imageBase64: src
        }

        let newUpload = new UploadModel(finalImg);

        return newUpload
            .save()  // to save data in database
            .then(() => {
                return { msg : `${files[index].originalname} Uploaded Successfully...!`}
            })
            .catch(error =>{
                if(error){
                    if(error.name === 'MongoError' && error.code === 11000){
                        return Promise.reject({ error : `Duplicate ${files[index].originalname}. File Already exists! `});    // for duplicate image uploading error
                    }
                    return Promise.reject({ error : error.message || `Cannot Upload ${files[index].originalname} Something Missing!`})   // for other errors
                }
            })
    });
    Promise.all(result)
        .then( msg => {
                   // res.json(msg);  // wont redirect to homepage and display the message specified in above function
            res.redirect('/')
        })
        .catch(err =>{
            res.json(err);
        })
}