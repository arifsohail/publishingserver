var AWS = require('aws-sdk');
var configuration = require('./config');
// Set credentials and region
// This can also be done directly on the service client
// AWS.config.update({region: 'us-west-2', credentials: {
//         accessKeyId: `AKIAISK6OEWLG5D5CSJQ`, secretAccessKey: `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`, sessionToken: 'session'
//     }});


// AWS Config
AWS.config.update({ accessKeyId: 'AKIAISK6OEWLG5D5CSJQ', secretAccessKey: 'E2O1YCa831sS3OYFcyWb+jn7GHB2BHTWARSBgjC8' });

// Set your region for future requests.
AWS.config.update({ region: 'us-west-2' }); // e.g. eu-west-1

// get the Route53 library
var route53 = new AWS.Route53();
var cloudfront = new AWS.CloudFront(
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "s3:ListAllMyBuckets",
        "Resource": "arn:aws:s3:::MyBucketName"
      },
      {
        "Action": [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetDistribution",
          "cloudfront:GetStreamingDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations",
          "cloudfront:ListStreamingDistributions",
          "cloudfront:ListDistributions",
          "cloudfront:CreateDistribution"
        ],
        "Effect": "Allow",
        "Resource": "*"
      }
    ]
  });

function createCloudFront(bucketFolder, parentDomain) {
  return new Promise((resolve, reject) => {
    var params = {
      DistributionConfig: { /* required */
        CallerReference: `${bucketFolder}`,
        /* required */
        Comment: 'mycomment', /* required */
        DefaultCacheBehavior: { /* required */
          ForwardedValues: { /* required */
            Cookies: { /* required */
              Forward: 'none',
              WhitelistedNames: {
                Quantity: 0, /* required */
                Items: [
                ]
              }
            },
            QueryString: false, /* required */
            Headers: {
              Quantity: 0, /* required */
              Items: [

              ]
            },
            QueryStringCacheKeys: {
              Quantity: 0, /* required */
              Items: [
              ]
            }
          },
          MinTTL: 0, /* required */
          TargetOriginId: `S3-mygatsbysite/${bucketFolder}`, /* required */
          TrustedSigners: { /* required */
            Enabled: false, /* required */
            Quantity: 0, /* required */
            Items: [
              /* more items */
            ]
          },
          ViewerProtocolPolicy: 'allow-all', /* required */
          AllowedMethods: {
            Items: [ /* required */
              'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE',
              /* more items */
            ],
            Quantity: 7, /* required */
            CachedMethods: {
              Items: [ /* required */
                'GET', 'HEAD', 'OPTIONS',
                /* more items */
              ],
              Quantity: 3 /* required */
            }
          },
          Compress: false,
          DefaultTTL: 86400,
          MaxTTL: 31536000,
          SmoothStreaming: false
        },
        Enabled: true, /* required */
        Origins: { /* required */
          Quantity: 1, /* required */
          Items: [
            {
              DomainName: 'mygatsbysite.s3.amazonaws.com', /* required */
              Id: `S3-mygatsbysite/${bucketFolder}`, /* required */
              CustomHeaders: {
                Quantity: 0, /* required */
                Items: [

                ]
              },
              S3OriginConfig: {
                HTTPPort: 0, /* required */
                HTTPSPort: 0, /* required */
                OriginProtocolPolicy: 'http', /* required */
                OriginKeepaliveTimeout: 0,
                OriginReadTimeout: 0,
                OriginSslProtocols: {
                  Items: [ /* required */
                    'SSLv3', 'TLSv1',
                    /* more items */
                  ],
                  Quantity: 0 /* required */
                }
              },
              OriginPath: `/${bucketFolder}`,
              S3OriginConfig: {
                OriginAccessIdentity: '' /* required */
              }
            },
            /* more items */
          ]
        },
        Aliases: {
          Quantity: 1, /* required */
          Items: [
            `${bucketFolder}.${parentDomain}`,
            /* more items */
          ]
        },
        CacheBehaviors: {
          Quantity: 1, /* required */
          Items: [
            {
              ForwardedValues: { /* required */
                Cookies: { /* required */
                  Forward: 'none', /* required */
                  WhitelistedNames: {
                    Quantity: 0, /* required */
                    Items: [
                      'STRING_VALUE',
                      /* more items */
                    ]
                  }
                },
                QueryString: false, /* required */
                Headers: {
                  Quantity: 0, /* required */
                  Items: [
                  ]
                },
                QueryStringCacheKeys: {
                  Quantity: 0, /* required */
                  Items: [
                  ]
                }
              },
              MinTTL: 0, /* required */
              PathPattern: 'STRING_VALUE', /* required */
              TargetOriginId: `S3-mygatsbysite/${bucketFolder}`, /* required */
              TrustedSigners: { /* required */
                Enabled: false, /* required */
                Quantity: 0 /* required */
              },
              ViewerProtocolPolicy: 'allow-all', /* required */
              AllowedMethods: {
                Items: [ /* required */
                  'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE',
                  /* more items */
                ],
                Quantity: 7, /* required */
                CachedMethods: {
                  Items: [ /* required */
                    'GET', 'HEAD', 'OPTIONS',
                    /* more items */
                  ],
                  Quantity: 3 /* required */
                }
              },
              Compress: false,
              DefaultTTL: 0,
              LambdaFunctionAssociations: {
                Quantity: 0, /* required */
                Items: [

                ]
              },
              MaxTTL: 0,
              SmoothStreaming: false
            },
            /* more items */
          ]
        },
        CustomErrorResponses: {
          Quantity: 0, /* required */
          Items: [

            /* more items */
          ]
        },
        DefaultRootObject: 'index.html',
        HttpVersion: 'http2',
        IsIPV6Enabled: true,
        Logging: {
          Bucket: 'STRING_VALUE', /* required */
          Enabled: false, /* required */
          IncludeCookies: false, /* required */
          Prefix: 'STRING_VALUE' /* required */
        },
        PriceClass: 'PriceClass_All',
        Restrictions: {
          GeoRestriction: { /* required */
            Quantity: 0, /* required */
            RestrictionType: 'none', /* required */
            Items: [

            ]
          }
        },
        ViewerCertificate: {
          CloudFrontDefaultCertificate: true,
        },
        WebACLId: ''
      }
    };
    cloudfront.createDistribution(params, function (err, data) {
      if (err)
        reject(err); // an error occurred
      else
        resolve(data);           // successful response
    });
  });
}


function createDomainName(bucketFolder, cloudFrontUrlString, parentDomain) {
  return new Promise((resolve, reject) => {
    let cloudFrontUrl = cloudFrontUrlString;
    var params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "CREATE",
            ResourceRecordSet: {
              AliasTarget: {
                DNSName: `${cloudFrontUrl}`,
                EvaluateTargetHealth: false,
                HostedZoneId: "Z2FDTNDATAQYW2"
              },
              Name: `${bucketFolder}.${parentDomain}`,
              Type: "A"
            }
          }
        ],
        Comment: "CloudFront distribution for development parent site"
      },
      HostedZoneId: "Z18LZKP6TV1N84"// Depends on the type of resource that you want to route traffic to
    };
    route53.changeResourceRecordSets(params, function (err, data) {
      if (err)
        reject(err); // an error occurred
      else
      if(data.ChangeInfo.Status === 'PENDING') {
          resolve(`${bucketFolder}.${parentDomain}`);
      }
      // successful response
    });
  });
}

//createDomainName('code','d3v63wsswbsuih.cloudfront.net');

//createCloudFront();

module.exports = {
  createCloudFront,
  createDomainName
}
