import multer from 'multer';

const storage =multer.diskStorage({
    destination: await function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: await function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })


 // console.log(storage)
  
 export const upload = multer({ 
    storage ,
}) 

//console.log(upload)