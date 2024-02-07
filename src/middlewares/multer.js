 import multer from 'multer';

const storage =  multer.diskStorage({
    destination:  function (req, files, cb) {
      cb(null, './public/temp')
    },
    filename:  function (req, files, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, files.originalname)
    }
  })
  export const upload = multer({ 
     storage , 
 }) 
//console.log(storage)
//console.log(upload)

// export  const upload = multer({ 
//    storage,
//   // Specify the field that will contain the files, e.g., 'files'
//   fileFilter: (req, file, cb) => {
//      if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('application/pdf')) {
//         return cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
//      }
//      cb(null, true);
//   },
// }).array('files', 10); // 'files' is the field name, and 10 is the maximum number of files

//  export { storage };

