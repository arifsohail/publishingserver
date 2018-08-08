var express = require("express");
var bodyParser = require("body-parser");
var configuration = require('./config');
var domainCreation = require('./domainCreation');
var Mailchimp = require('mailchimp-api-v3');
var messagesObj = configuration.getMessages();
var AWS = require('aws-sdk');
var app = express();
var s3fs = require('s3fs');
// Body Parser Middleware
app.use(bodyParser.json());

//Shell commands
//var execute = require('lambduh-execute');

var shell = require('shelljs');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

var parentDomain = 'mylatestsite.tk';
//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

var isWin = /^win/.test(process.platform);

// Prepare response function
function prepareResponse(code, message, status) {
  return {
    statuCode: code,
    status: status,
    message: message,
  }
}

function prepareResponseForPublished(code, message, status, url) {
  return {
    statuCode: code,
    status: status,
    message: message,
    webUrl: url
  }
}

//Create gatshby site
function createGatsBySite(res, createSiteCommands, siteName) {
  //shell.cd(configuration.getConfigurations().directory);
  console.log(createSiteCommands);
  shell.exec(createSiteCommands, function (code, stdout, stderr) {
    if (stdout) {
      return res.send(prepareResponse(200, messagesObj.siteCreatedSuccess, true))
    }
    if (stderr) {
      return res.status(400).send(prepareResponse(400, messagesObj.problemInSiteCreateAlready, false))
    }

  });
}

//Create gatshby using copy commmand will create copy from default site
function createGatsBySiteCp(res, createSiteCommands, siteName) {
  try {
    shell.cd(configuration.getConfigurations().directory);
    console.log(createSiteCommands);
    shell.exec(createSiteCommands, function (code, stdout, stderr) {
      if (stderr) {
        return res.status(400).send(prepareResponse(400, messagesObj.problemInSiteCreate, false))
      } else {
        if (!isWin) {
          shell.exec(configuration.getConfigurations().permission + ' ' + configuration.getConfigurations().directory + siteName)
        }
        return res.send(prepareResponse(200, messagesObj.siteCreatedSuccess, true))
      }
    })
  } catch (error) {
    return res.send(prepareResponse(500, messagesObj.internalServerError, false))
  }
}

//Create gatsby site API
app.post("/api/create-gatsby-site", function (req, res) {
  var siteName = req.body.site_name ? req.body.site_name : null
  if (siteName === null) {
    return res.status(400).send(prepareResponse(400, messagesObj.siteNameRequired, false))
  } else {
    var regex = /^[0-9a-zA-Z\_-]+$/;
    if (regex.test(siteName)) {
      var isSiteNameExits = shell.find('./sites/' + siteName);
      if (isSiteNameExits != '') {
        res.status(400).send(prepareResponse(400, messagesObj.siteNameAlreadyExits, false))
      } else {
        var isDefultSiteExits = shell.find('./sites/defaultsite')
        if (isDefultSiteExits != '') {
          shell.cd('./sites');
          if (isWin) {
            var createSiteCommands = configuration.getConfigurations().copyCommand + ' ' + siteName + ' /e /i /h'
          } else {
            var createSiteCommands = configuration.getConfigurations().copyCommand + ' ' + siteName;
          }
          createGatsBySiteCp(res, createSiteCommands, siteName)
        } else {
          var createSiteCommands = configuration.getGatsByCommand().new + ' ' + req.body.site_name
          try {
            var isDir = shell.find('/sites');
            if (isDir == '') {
              shell.cd('./sites');
              //var mkDirOut = shell.mkdir(req.body.site_name);
              createGatsBySite(res, createSiteCommands, siteName)
            } else {
              createGatsBySite(res, createSiteCommands, siteName)
            }

          } catch (error) {
            return res.status(500).send(prepareResponse(400, messagesObj.internalServerError, false));
          }
        }
      }
    } else {
      return res.status(400).send(prepareResponse(400, messagesObj.invalidSiteName, false));
    }
  }
});

function getFiles(dir, _files) {
  _files = _files || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, _files);
    } else {
      _files.push(name);
    }
  }
  return _files;
}

function saveFile(files, index, dir, s3fsImpl, res) {
  if (files.length > 0) {
    var file = files[0];
    var stream = fs.createReadStream(file);
    var _file_name = file.replace(dir, '');

    s3fsImpl.writeFile(_file_name, stream, { ACL: 'public-read' }).then(function () {
      console.log('uploaded ' + file + ' --> ' + _file_name);
      files.splice(0, 1);
      saveFile(files, ++index, dir, s3fsImpl, res);
    }, function (reason) {
      console.error('unable to upload ' + file);
      return res.status(404).send(prepareResponse(200, 'unable to build your site.', false));
      //throw reason;
    });
  } else {
    console.log('\ntotal: ' + index + ' files copied');
    return res.send(prepareResponse(200, 'site is ready', false))
  }
}

function saveFile1(files, index, dir, s3fsImpl, res) {
  if (files.length > 0) {
    var file = files[0];
    var stream = fs.createReadStream(file);
    var _file_name = file.replace(dir, '');

    s3fsImpl.writeFile(_file_name, stream, { ACL: 'public-read' }).then(function () {
      console.log('uploaded ' + file + ' --> ' + _file_name);
      files.splice(0, 1);
      saveFile(files, ++index, dir, s3fsImpl, res);
    }, function (reason) {
      console.error('unable to upload' + file);
      return res.status(404).send(prepareResponse(200, 'unable to build your site.', false));
      //throw reason;
    });
  } else {
    console.log('\ntotal: ' + index + ' files copied');
    return res.send(prepareResponse(200, 'site is ready', false))
  }
}

//Build gatsby site API
app.post("/api/build-gatsby-site", function (req, res) {
  let shell = require('shelljs');
  var siteName = req.body.site_name ? req.body.site_name : null
  if (siteName === null) {
    return res.status(400).send(prepareResponse(400, 'site name is required', false))
  } else {
    console.log();
    shell.cd(`${__dirname}/sites`);
    var isSiteNameExits = shell.find('./' + siteName);
    if (isSiteNameExits != '') {
      try {
        var gatsbyBuildCommands = configuration.getGatsByCommand().build;
          console.log(__dirname);
        shell.cd('' + siteName);
        shell.exec(gatsbyBuildCommands, function (code, stdout, stderr) {
          if (stderr) {
            return res.status(400).send(prepareResponse(400, messagesObj.problemInSiteBuild, false))
          }
          if (stdout) {
            var foundError = stdout.search("Error:");
            if (foundError === -1) {
              return res.status(200).send(prepareResponse(200, messagesObj.buildDoneSuccess, true))
            } else {
              return res.status(400).send(prepareResponse(200, messagesObj.buildFailed, false))
            }
          }
        })
      } catch (error) {
        prepareResponse(400, error, false);
      }
    } else {
      return res.status(400).send(prepareResponse(400, messagesObj.siteNotAvailable, false))
    }
  }
});

//publish gatsby site API
app.post("/api/publish-gatsby-site", function (req, res) {
  var siteName = req.body.site_name ? req.body.site_name : null
  if (siteName === null) {
    return res.status(400).send(prepareResponse(400, 'Site name is required', false))
  } else {
    shell.cd(`${__dirname}/sites`);
    var isSiteNameExits = shell.find('./' + siteName);
    if (isSiteNameExits != '') {
      try {
        var gatsbyBuildCommands = configuration.getGatsByCommand().build;
        //shell.cd('./' + siteName);
        var s3CommandLineUpload = configuration.s3Command().s3Sync + ' ' + './' + siteName + '/public/ s3://mygatsbysite/' + siteName + ' --acl public-read-write'
        console.log(s3CommandLineUpload);
        var websiteUrl = configuration.getS3BucketDetails().bucketBaseURL + siteName + '/index.html';
        //var response = prepareResponseForPublished(200, true,messagesObj.siteBuildDone, websiteUrl);
        res.send(websiteUrl);
        shell.exec(s3CommandLineUpload, function (code, stdout, stderr) {
          if (stderr) {
            var response = prepareResponse(400, messagesObj.siteS3UploadFailed, false);
            return res.status(400).send(response)
          }
          if (stdout || stdout === '') {
            var foundError = stdout.search("Error:");
            if (foundError === -1) {

            } else {
              return res.status(400).send(prepareResponse(400, messagesObj.sitePublishFailed, false))
            }
          }
        })
      } catch (error) {
        prepareResponse(500, messagesObj.internalServerError, false);
      }
    } else {
      return res.status(400).send(prepareResponse(400, messagesObj.siteNotAvailable, false))
    }
  }
});

//Publish gatsby pages API
app.post("/api/publish-gatsby-pages", function (req, res) {
  var siteName = req.body.site_name ? req.body.site_name : null
  if (siteName === null) {
    return res.status(400).send(prepareResponse(400, messagesObj.siteNameRequired, false))
  } else {
    var pages = req.body.pages ? req.body.pages : null
    var layout = req.body.layout ? req.body.layout : null

    if ((pages === null && !Array.isArray(pages)) && (layout === null)) {
      return res.status(400).send(prepareResponse(400, messagesObj.sitePagesRequired, false))
    } else {
      try {
        var asyncLoop = require('node-async-loop');
        var returnDataArr = []
        if (layout !== null && Array.isArray(layout)) {
          layout.forEach(function (element) {
            console.log(element.filename)
            var path = configuration.getConfigurations().directory + siteName + '/src/layouts/' + element.filename;
            fs.writeFile(path, element.content, {}, function (err) {
              if (err) {
                returnDataArr.push({
                  filename: element.filename,
                  type: 'layout',
                  error: err
                })
              }
            });
          }, this);
        }
        if (pages === null && layoutn != null) {
          return res.send(prepareDataResponse(200, true, returnDataArr, messagesObj.sitePagesCreatedSuccesfully))
        }
        // else if (typeof pages === 'object') {
        //
        //   path = `${__dirname}/sites/${siteName}/src/pages/` + pages.filename;
        //   fs.writeFile(path, pages.content, {}, function (err) {
        //     if (err) {
        //       returnDataArr.push({
        //         filename: pages.filename,
        //         type: 'page',
        //         error: err
        //       })
        //     }
        //     return res.send(prepareDataResponse(200, true, returnDataArr, messagesObj.sitePagesCreatedSuccesfully))
        //     next();
        //   });
        // }
        else {
          asyncLoop(pages, function (data, next) {
            var path = `${__dirname}/sites/${siteName}/src/pages/` + data.filename;
            fs.writeFile(path, data.content, {}, function (err) {
              if (err) {
                returnDataArr.push({
                  filename: data.filename,
                  type: 'page',
                  error: err
                })
              }
              next();
            });
          }, function () {
            return res.send(prepareDataResponse(200, true, returnDataArr, messagesObj.sitePagesCreatedSuccesfully))
          })
        }

      } catch (error) {
        return res.status(500).send(prepareResponse(400, messagesObj.internalServerError, false))
      }
    }
  }
});

function prepareDataResponse(code, status, data, message) {
  return {
    statuCode: code,
    status: status,
    error: data,
    message: message
  }
}

function prepareBuildResponse(code, status, url, message) {
  return {
    statuCode: code,
    status: status,
    website_url: url,
    message: message
  }
}

app.get("/", function (req, res) {
  res.send({ message: "Server is running", statuCode: 200 });
});

app.post("/api/update-gatsby-config", function (req, res) {
  var siteName = req.body.site_name ? req.body.site_name : null;
  let config = req.body.config ? req.body.config : null;
  if (siteName === null) {
    return res.status(400).send(prepareResponse(400, messagesObj.siteNameRequired, false))
  } else if (config !== null) {
    path = `${__dirname}/sites/${siteName}/gatsby-config.js`;
    fs.writeFile(path, config, {}, function (err) {
      if (err) {
        returnDataArr.push({
          filename: pages.filename,
          type: 'page',
          error: err
        })
      }
      return res.send(prepareDataResponse(200, true, messagesObj.siteConfigurationUpdated))
      next();
    });
  }
});

app.post('/api/domain-publish', async (req, res) => {
  try {
    let cloudFrontData = await domainCreation.createCloudFront(req.body.site_name, parentDomain);
    let domainData = await domainCreation.createDomainName(req.body.site_name, cloudFrontData.DomainName, parentDomain);
     res.send(domainData);

  } catch (err) {
    if(err.code === 'CNAMEAlreadyExists'){
        res.send(`${req.body.site_name}.${parentDomain}`);
    } else {
        res.send(`${req.body.site_name}.${parentDomain}`);
    }

  }

});

//add endpoint for mailchimp

app.post('/api/addcontact', async (req, res) => {
  //let api_key = req.body.api_key;
  let mailchimp = new Mailchimp('158377d9b2e426547c76dfcd7193a84b-us18');
  let path = '/lists/de66870087/members';

  mailchimp.post(`${path}`, {
  email_address : 'bbc@gmail.com',
  status : 'subscribed'
})
.then(function(results) {
console.log(results);
})
.catch(function (err) {
console.log(err);
})
});

module.exports = server;
