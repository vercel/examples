'use strict';

module.exports = exports;

const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports.detect = function(opts) {
  const config = {};

  const to = opts.hosted_path;
  const uri = url.parse(to);

  if (opts.bucket && opts.region) {
    // use user defined settings for host, region, bucket
    config.endpoint = opts.host;
    config.bucket = opts.bucket;
    config.region = opts.region;
    config.s3ForcePathStyle = opts.s3ForcePathStyle;

    // if using s3ForcePathStyle the bucket is part of the http object path
    // but not the S3 key prefix path.
    // remove it
    const bucketPath = config.s3ForcePathStyle ? `/${config.bucket}/` : '/';
    config.prefix = (!uri.pathname || uri.pathname === bucketPath) ? '' : uri.pathname.replace(bucketPath, '');
  } else {
    // auto detect region and bucket from url
    // only virtual-hosted–style access can be auto detected
    // the uri will have the following format:
    // https://bucket-name.s3.Region.amazonaws.com/key-name (dash Region)
    // or in some legacy region of this format:
    // https://bucket-name.s3-Region.amazonaws.com/key-name (dot Region)
    const parts = uri.hostname.split('.s3');

    // there is nothing before the .s3
    // not a valid s3 virtual host bucket url
    if (parts.length === 1) {
      throw new Error('Could not parse s3 bucket name from virtual host url.');
    }

    // everything before .s3 is the bucket
    config.bucket = parts[0];

    // from everything that comes after the s3
    // first char is connecting dot or dash
    // everything up to the domain should be the region name
    const region = parts[1].slice(1).split('.')[0];
    // if user provided url does not include region, default to us-east-1.
    if (region === 'amazonaws') {
      config.region = 'us-east-1';
    } else {
      config.region = region;
    }

    config.prefix = (!uri.pathname || uri.pathname === '/') ? '' : uri.pathname.replace('/', '');
  }

  return config;
};

module.exports.get_s3 = function(config) {

  if (process.env.node_pre_gyp_mock_s3) {
    // here we're mocking. node_pre_gyp_mock_s3 is the scratch directory
    // for the mock code.
    const AWSMock = require('mock-aws-s3');
    const os = require('os');

    AWSMock.config.basePath = `${os.tmpdir()}/mock`;

    const s3 = AWSMock.S3();

    // wrapped callback maker. fs calls return code of ENOENT but AWS.S3 returns
    // NotFound.
    const wcb = (fn) => (err, ...args) => {
      if (err && err.code === 'ENOENT') {
        err.code = 'NotFound';
      }
      return fn(err, ...args);
    };

    return {
      listObjects(params, callback) {
        return s3.listObjects(params, wcb(callback));
      },
      headObject(params, callback) {
        return s3.headObject(params, wcb(callback));
      },
      deleteObject(params, callback) {
        return s3.deleteObject(params, wcb(callback));
      },
      putObject(params, callback) {
        return s3.putObject(params, wcb(callback));
      }
    };
  }

  // if not mocking then setup real s3.
  const AWS = require('aws-sdk');

  AWS.config.update(config);
  const s3 = new AWS.S3();

  // need to change if additional options need to be specified.
  return {
    listObjects(params, callback) {
      return s3.listObjects(params, callback);
    },
    headObject(params, callback) {
      return s3.headObject(params, callback);
    },
    deleteObject(params, callback) {
      return s3.deleteObject(params, callback);
    },
    putObject(params, callback) {
      return s3.putObject(params, callback);
    }
  };



};

//
// function to get the mocking control function. if not mocking it returns a no-op.
//
// if mocking it sets up the mock http interceptors that use the mocked s3 file system
// to fulfill responses.
module.exports.get_mockS3Http = function() {
  let mock_s3 = false;
  if (!process.env.node_pre_gyp_mock_s3) {
    return () => mock_s3;
  }

  const nock = require('nock');
  // the bucket used for testing, as addressed by https.
  const host = 'https://mapbox-node-pre-gyp-public-testing-bucket.s3.us-east-1.amazonaws.com';
  const mockDir = process.env.node_pre_gyp_mock_s3 + '/mapbox-node-pre-gyp-public-testing-bucket';

  // function to setup interceptors. they are "turned off" by setting mock_s3 to false.
  const mock_http = () => {
    // eslint-disable-next-line no-unused-vars
    function get(uri, requestBody) {
      const filepath = path.join(mockDir, uri.replace('%2B', '+'));

      try {
        fs.accessSync(filepath, fs.constants.R_OK);
      } catch (e) {
        return [404, 'not found\n'];
      }

      // the mock s3 functions just write to disk, so just read from it.
      return [200, fs.createReadStream(filepath)];
    }

    // eslint-disable-next-line no-unused-vars
    return nock(host)
      .persist()
      .get(() => mock_s3) // mock any uri for s3 when true
      .reply(get);
  };

  // setup interceptors. they check the mock_s3 flag to determine whether to intercept.
  mock_http(nock, host, mockDir);
  // function to turn matching all requests to s3 on/off.
  const mockS3Http = (action) => {
    const previous = mock_s3;
    if (action === 'off') {
      mock_s3 = false;
    } else if (action === 'on') {
      mock_s3 = true;
    } else if (action !== 'get') {
      throw new Error(`illegal action for setMockHttp ${action}`);
    }
    return previous;
  };

  // call mockS3Http with the argument
  // - 'on' - turn it on
  // - 'off' - turn it off (used by fetch.test.js so it doesn't interfere with redirects)
  // - 'get' - return true or false for 'on' or 'off'
  return mockS3Http;
};



