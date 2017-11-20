const _ = require('lodash');
const formidable = require('formidable')
const path = require('path')
const Bluebird = require('bluebird');
const fs = require('fs');

const cryptHelper = require('../../helpers/crypt-helper');
const uploadDir = path.join(__dirname, '/..', '/..', '/uploads/') //i made this  before the function because i use it multiple times for deleting later


module.exports = (req, res, next)  => { // This is just for my Controller same as app.post(url, function(req,res,next) {....
  var form = new formidable.IncomingForm();

  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = uploadDir
  form.parse(req, (err, fields, files) => {
    req.body = fields;

    if (_.has(files, 'file.size') && files.file.size > 0) {
      req.files = files;
    }

    return next();
  });

  form.onPart = function (part) {
      if(part.filename == undefined || (part.filename && part.filename != '' && part.filename.match(/\.(jpg|jpeg|png)$/i))) {
          this.handlePart(part);
      }
      else {
          console.log(part.filename + ' is not allowed');
      }
  }

  let filePath = "";
  
  form.on('fileBegin', function (name, file) {
    const [fileName, fileExt] = file.name.split('.');
    filePath = file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`);
  });

  form.on('end', function (){
    return Bluebird.resolve()
      .then(() => fs.existsSync(filePath))
      .then((status) => {
        if (!status) throw new Error('File doesn\'t exist');

        return cryptHelper.encryptFile(filePath, req.session.user);
      })
      .then(() => fs.unlink(filePath))
      .catch((err) => {
        console.log("Warning, " + err.message);
      });
  });
}