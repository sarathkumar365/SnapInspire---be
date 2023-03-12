const multer = require('multer');


 const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images')
    },
    filename:function(req,file,cb){
        const ext = file.originalname.split('.')[1]
        const filename = `${'jjkb32jb323ilq21kn' + '-' + Date.now() + '.' + ext}`
        cb(null, filename)
    }
})

exports.upload = multer({storage:storage})