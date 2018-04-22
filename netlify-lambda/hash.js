const crypto = require('crypto');

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = (event, context, callback) => {
    let nonce = event.queryStringParameters.nonce;
    let output;
    if (nonce) {
        output = getJsonOutput("200", "OK", hashWithNonce(nonce));
    } else {
        output = getJsonOutput("400", "Required querystring property is missing.", "");
    }
    if (process.env._DEBUG === "true") {
        output.debug = getDebugInfo(nonce, event, context);
    }
    callback(null, {
        "isBase64Encoded": false,
        "statusCode": output.status,
        "headers": headers,
        "body": JSON.stringify(output)
    });
}

function hashWithNonce(nonce) {
    return crypto.createHmac("SHA256", process.env.API_SECRET).update(nonce).digest("base64");
}

function getJsonOutput(status, message, hash) {
    return { "status": status, "message": message, "hash": hash };
}

function getDebugInfo(nonce, event, context) {
    return { "apiKey": process.env.API_KEY, "event": event, "context": context };
}