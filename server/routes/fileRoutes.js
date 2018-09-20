const { authenticate } = require("../middleware/authenticate.js");
const multer = require("multer");
const md5 = require("md5");

const Models = require("../ModelMethods.js");

module.exports = app => {
  const upload = multer();
  app.post("/file/upload", upload.single("file"), authenticate, (req, res) => {
    var file = req.file;
    var filemd5 = md5(file.buffer);
    var path = __dirname + "/uploads/" + file.originalname;

    var fileExists = fs.existsSync(path);

    if (!fileExists) {
      fs.writeFile(path, file.buffer, err => {
        console.log("HERE:", err);
        if (err) {
          return res.status(500).send({ err });
        }
      });
    } else {
      if (filemd5 != md5(fs.readFileSync(path))) {
        return res.status(422).send("File with that name already exists");
      }
    }

    Models.Upload.findOne({
      md5: filemd5,
      uploadName: file.originalname
    })
      .then(existingUpload => {
        if (existingUpload) {
          return res.send({ doc: existingUpload });
        }

        var upload = new Models.Upload({
          _creator: req.user.id,
          uploadName: file.originalname,
          md5: filemd5
        });

        upload
          .save()
          .then(
            doc => {
              res.send({ doc });
            },
            e => {
              res.status(400).send(e);
            }
          )
          .catch(e => {
            res.status(500).send(e);
          });
      })
      .catch(e => console.log(e));
  });

  app.get("/file/info/:id", authenticate, (req, res) => {
    Models.getById("Upload", req.params.id, req.user._id, (doc, e) => {
      res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
    });
  });

  app.get("/file/:name", authenticate, (req, res) => {
    const fileName = req.params.name;
    const path = __dirname + "/uploads/" + fileName;

    if (!fs.existsSync(path)) {
      return res.status(404).send();
    }

    res.sendFile(path);
  });
};
