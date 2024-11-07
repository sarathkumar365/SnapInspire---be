const multer = require('multer');


 const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images')
    },
    filename:function(req,file,cb){
        const ext = file.originalname.split('.')[1]
        const filename = `${'image' + '-' + Date.now() + '.' + ext}`
        cb(null, filename)
    }
})

exports.upload = multer({storage:storage})