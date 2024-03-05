  import multer from 'multer';
  //import uuid from 'uuid';
//   import { extname, parse } from 'path'; // Use path.parse for correct file extension handling
//  import { v4 as uuidv4} from 'uuid';
//  //uuidv4();

//  const upload = multer({ destination: "uploads/"})

//  export {upload}


  

const storage =  multer.diskStorage({
    destination:  function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename:  function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const { originalname } = file;
        // cb(null, `${uuid()}-${originalname}`)  // instal and import uuid i.e const uuid = 
      cb(null, file.originalname)
    }
  })
  export const upload = multer({ storage }) 

//---------------------

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



// Set up multer configuration
//  const storage = multer.diskStorage({
//   destination: 'uploads/', // Customize upload directory if needed
//   filename: (req, file, callback) => {
//     const uniqueSuffix = uuidv4();
//     const originalExt = extname(file.originalname).toLowerCase(); // Handle all filename extensions correctly
//     callback(null, `${file.fieldname}-${uniqueSuffix}${originalExt}`);
//   }
// });

//  export const upload = multer({ storage });



