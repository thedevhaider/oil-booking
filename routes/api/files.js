const express = require('express');
const passport = require("passport");
const multer = require('multer');
const path = require('path')
 
const router = express.Router();

// @routes     POST api/files/upload
// @desc       Upload file 
// @access     Public
router.get('/upload', (req, res) => {
  res.send(`
    <form method="POST" action="/api/files/upload" enctype="multipart/form-data">
        <div>
            <label>Select your profile picture:</label>
            <input type="file" name="profile_pic" />
        </div>
        <div>
            <input type="submit" name="btn_upload_profile_pic" value="Upload" />
        </div>
    </form>
  `);
});

// @routes     POST api/files/upload
// @desc       Upload file
// @access     Private
router.post(
    "/upload",
    (req, res) => {
        
        // Config the storage
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, 'uploads/');
            },
        
            // By default, multer removes file extensions so let's add them back
            filename: function(req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });

        // 'profile_pic' is the name of our file input field in the HTML form
        const upload = multer({ storage: storage, limits: { fileSize: 3145728 }}).single('profile_pic');

        upload(req, res, function(err) {
            // req.file contains information of uploaded file
            // req.body contains information of text fields, if there were any
    
            if (err instanceof multer.MulterError) {
                return res.send(err);
            }
            else if (err) {
                return res.send(err);
            }
    
            // Display uploaded image for user validation
            console.log(req.file);
            res.send(`You have uploaded this image: <hr/><img src=../../${req.file.path} width="500"><hr /><a href="./upload">Upload another image</a>`);
        });

    }
);

module.exports = router