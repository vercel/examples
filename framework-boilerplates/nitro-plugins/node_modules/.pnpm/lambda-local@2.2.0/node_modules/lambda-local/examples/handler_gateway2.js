/*
 * Example Lambda function.
 */

exports.handler = async function(event, context) {
    return { message: "Hello ! Here's a full copy of the event:", event };
};