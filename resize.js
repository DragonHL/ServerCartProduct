// const sharp = require('sharp');
// const uuidv4 = require('uuid/v4');
// const path = require('path');

// class Resize {
//   constructor(folder) {
//     this.folder = folder;
//   }
//   async save(buffer) {
//     const filename = Resize.filename();
//     const filepath = this.filepath(filename);

//     await sharp(buffer)
//       .resize(300, 300, { // size image 300x300
//         fit: sharp.fit.inside,
//         withoutEnlargement: true
//       })
//       .toFile(filepath);
    
//     return filename;
//   }
//   static filename() {
//      // random file name
//     return `${uuidv4()}.png`;
//   }
//   filepath(filename) {
//     return path.resolve(`${this.folder}/${filename}`)
//   }
// }
// module.exports = Resize;

module.exports = function resize(path, format, width, height) {
    const readStream = fs.createReadStream(path)
    return readStream
  }