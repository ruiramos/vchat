
var fs = require('fs'),
    db = require('./db'),
    io = require('./io');

var filePathBase = './uploads/';

function home(response){
  response.writeHead(200, {
      'Content-Type': 'text/html'
  });
  response.end(fs.readFileSync('../index.html'));
};

function upload(response, postData){
  var content = JSON.parse(postData);

  _upload(response, content.video);

  var message = {
    video: filePathBase + content.video.name,
    text: content.text
  };

  db.save(message);
  io.broadcast(message)

  response.statusCode = 200;
  response.writeHead(200, {
      'Content-Type': 'application/json'
  });
  response.end(content.video.name);

};

function serveStatic(response, pathname, postData){
  var extension = pathname.split('.').pop(),
      extensionTypes = {
        'js': 'application/javascript',
        'webm': 'video/webm',
        'mp4': 'video/mp4',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg',
        'gif': 'image/gif'
      };

  response.writeHead(200, {
      'Content-Type': extensionTypes[extension]
  });

  if (hasMediaType(extensionTypes[extension]))
      response.end(fs.readFileSync('.' + pathname));
  else
      response.end(fs.readFileSync('../' + pathname));
};

function hasMediaType(type) {
    var isHasMediaType = false;
    ['audio/wav', 'audio/ogg', 'video/webm', 'video/mp4'].forEach(function(t) {
      if(t== type) isHasMediaType = true;
    });

    return isHasMediaType;
};

function _upload(response, file) {
    var fileRootName = file.name.split('.').shift(),
        fileExtension = file.name.split('.').pop(),
        fileRootNameWithBase = filePathBase + fileRootName,
        filePath = fileRootNameWithBase + '.' + fileExtension,
        fileID = 2,
        fileBuffer;

    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }

    file.contents = file.contents.split(',').pop();

    fileBuffer = new Buffer(file.contents, "base64");

    fs.writeFileSync(filePath, fileBuffer);
}

module.exports = {
  home: home,
  upload: upload,
  serveStatic: serveStatic
}
