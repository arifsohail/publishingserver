var isWin = /^win/.test(process.platform);
module.exports = {
  getConfigurations: function () {
    if (isWin) {
      return {
        basedirectory: 'E:/gatsbysite/',
        directory: 'E:/gatsbysite/',
        defaultsite: 'E:/gatsbysite/default/',
        copyCommand: 'XCOPY  default'
      }
    } else {
      return {
        directory: './var/www/gatsbysite/',
        basedirectory: '/var/www/',
        defaultsite: '/var/www/gatsbysite/default/',
        copyCommand: 'sudo cp -r default/',
        permission: 'sudo chmod -R 777',
      }
    }
  },
  s3Command: function () {
    if (isWin) {
      return {
        s3Sync: '/snap/bin/aws s3 sync'
      }
    } else {
      return {
        s3Sync: '/snap/bin/aws s3 sync'
      }
    }
  },
  getS3BucketDetails: function () {
    return {
      bucketName: 'mygatsbysite',
      bucketBaseURL: 'https://s3-us-west-2.amazonaws.com/mygatsbysite/',
      accessKeyId: 'AKIAISK6OEWLG5D5CSJQ',
      secretAccessKey: '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'
    }
  },
  getGatsByCommand: function () {
    if (isWin) {
      return {
        build: '/home/sohail/.nvm/versions/node/v8.11.1/bin/node ../../node_modules/gatsby/dist/bin/gatsby.js build',
        new: '../node_modules/gatsby/dist/bin/gatsby.js new',
      }
    } else {
      return {
        build: '/home/sohail/.nvm/versions/node/v8.11.1/bin/node ../../node_modules/gatsby/dist/bin/gatsby.js build',
        new: '../node_modules/gatsby/dist/bin/gatsby.js new'
      }
    }
  },
  getMessages: function () {
    return {
      siteNotAvailable: 'This site is not available',
      siteNameAlreadyExits: 'This site name is already exits',
      problemInSiteBuild: 'There is problem in building your site. Plese try again.',
      buildDoneSuccess: 'Site build done successfully',
      sitePublishSuccessfully: 'Site publish succesffully on Amazon s3 bucket',
      sitePublishFailed: 'There is some error to publish gatsby site',
      buildFailed: 'Site build failed. There is some error in your pages please check all page and pass correct web page.',
      problemInSiteCreateAlready: 'There is problem in site create. This site name is already exits. Plese try again.',
      problemInSiteCreate: 'There is problem in site create. Plese try again.',
      siteInNotAvailable: 'This site is not available',
      siteBuildDone: 'Site build is done on production',
      sitePublishDone: 'Site publish is publish on AWS s3 Bucket',
      siteNameRequired: 'Site name is required',
      sitePagesRequired: 'Site pages are required to update the site',
      sitePagesCreatedSuccesfully: 'Site Pages is created successfully',
      sitePagesNotCreated: 'Site pages is not created. try again',
      siteLayoutUpdateSuccefully: 'Site Layout updated successfully',
      siteS3UploadFailed: 'Site S3 uploading failed. Please try againg',
      internalServerError: 'Internal server error.',
      invalidSiteName: 'Site name is invalid. Space and special charactors are not allowed in Site name',
      siteCreatedSuccess: 'Site created successfully.',
      invalidRequest: 'Invalid request parameters',
      siteConfigurationUpdated:"Successfully updated the page configurations"
    }
  }
}
