module.exports = {
  "source": "arn:aws:dynamodb:us-east-1:059493405231:table/update-streams-test/stream/a804b686-ba0c-3b4f-ba26-af2e5d3e16ea-09223370621958198992-89ff842d/",
  "Records": [
    {
      "awsRegion": "us-east-1",
      "dynamodb": {
        "Keys": {
          "ForumName": {
            "S": "DynamoDB"
          },
          "Subject": {
            "S": "DynamoDB Thread 3"
          }
        },
        "NewImage": {
          "Attribute_0": {
            "S": "New_Value_0"
          },
          "Attribute_1": {
            "S": "New_Value_1"
          },
          "key": {
            "S": "key-value"
          },
          "range": {
            "S": "range-value"
          }
        },
        "SequenceNumber": "300000000000000499659",
        "SizeBytes": 41,
        "StreamViewType": "KEYS_ONLY"
      },
      "eventID": "e2fd9c34eff2d779b297b26f5fef4206",
      "eventName": "INSERT",
      "eventSource": "aws:dynamodb",
      "eventTime": 1414474536.43,
      "eventVersion": "1.0"
    },
    {
      "awsRegion": "us-east-1",
      "dynamodb": {
        "Keys": {
          "ForumName": {
            "S": "DynamoDB"
          },
          "Subject": {
            "S": "DynamoDB Thread 1"
          }
        },
        "SequenceNumber": "400000000000000499660",
        "SizeBytes": 41,
        "StreamViewType": "KEYS_ONLY"
      },
      "eventID": "4b25bd0da9a181a155114127e4837252",
      "eventName": "MODIFY",
      "eventSource": "aws:dynamodb",
      "eventTime": 1414474536.43,
      "eventVersion": "1.0"
    },
    {
      "awsRegion": "us-east-1",
      "dynamodb": {
        "Keys": {
          "ForumName": {
            "S": "DynamoDB"
          },
          "Subject": {
            "S": "DynamoDB Thread 2"
          }
        },
        "SequenceNumber": "500000000000000499661",
        "SizeBytes": 41,
        "StreamViewType": "KEYS_ONLY"
      },
      "eventID": "740280c73a3df7842edab3548a1b08ad",
      "eventName": "REMOVE",
      "eventSource": "aws:dynamodb",
      "eventTime": 1414474536.431,
      "eventVersion": "1.0"
    }
  ]
};

