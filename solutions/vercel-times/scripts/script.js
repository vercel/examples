const path = require("path");
const fs = require("fs");
// const Jimp = require("jimp");

(function () {
  const pagesDirectory = path.join(process.cwd(), "content/pages");
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const publicDirectory = path.join(process.cwd(), "public/blog-images");

  function copyAndHandleMedia(initDir, outDir) {
    fs.readdir(initDir, function (err, folders) {
      if (err) {
        console.log(err);
      }
      folders.forEach((slug) => {
        const postFolder = path.join(initDir, slug);
        fs.readdir(postFolder, function (err, files) {
          if (err) {
            console.log(err);
          }
          files.forEach((f) => {
            const finalPostFolder = path.join(outDir, slug);
            const fileToCopy = path.join(postFolder, f);
            const dest = path.join(outDir, slug, f);

            if (/bg.jpg$/.test(f)) {
              fs.mkdir(finalPostFolder, { recursive: true }, (err) => {
                if (err) {
                  console.log(err);
                }
                console.log(fileToCopy, dest);
                fs.copyFileSync(fileToCopy, dest);
                // // Manipulate bg image
                // Jimp.read(dest, (err, ig) => {
                //   if (err) throw err;
                //   ig.resize(1400, Jimp.AUTO)
                //     .quality(80) // resize // set JPEG quality
                //     .write(dest); // save
                // });
                return;
              });
            }

            if (/jpg$|png$|gif$/.test(f)) {
              fs.mkdir(finalPostFolder, { recursive: true }, (err) => {
                if (err) {
                  console.log(err);
                }
                console.log(fileToCopy, dest);
                fs.copyFileSync(fileToCopy, dest);
              });
            }
          });
        });
      });
    });
  }

  copyAndHandleMedia(postsDirectory, publicDirectory);
})();
