'use strict';
/*
 * Example of what could be an Lambda@Edge handler
 */
exports.handler = (event, context, callback) => {
  var request = event.Records[0].cf.request;
  const response = {
    status: '302',
    statusDescription: '302 Found',
    httpVersion: request.httpVersion,
    headers: {
      Location: [
        {
            "key":"Location",
            "value":"someURL"
        }
      ],
      'Strict-Transport-Security': [
        {
          "key":"Strict-Transport-Security",
          "value":'max-age=63072000; includeSubDomains; preload'
        }
      ],
    },
  };
  callback(null, response);
};