function createSuccessResponse(message,data=[],status_code=200) {
    var res = {status:status_code,message:message,data:data};
    return res;
}

function createErrorResponse(message,status_code=500) {
    var res = {status:status_code,message:message};
    return res;
}

function convertExceptionToResponse(e) {
    if('response' in e && e.response) return e.response;
    else return createErrorResponse(e.message,500);
}


class InternalErrorException extends Error {
    constructor(message) {
      super(message);
      this.name = "InternalErrorException";
      this.response = createErrorResponse(message,500);
    }
}

class InvalidOperationException extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidOperationException";
      this.response = createErrorResponse(message,400);
    }
}

class InvalidArgumentException extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidArgumentException";
      this.response = createErrorResponse(message,400);
    }
}



module.exports = {
    createErrorResponse: createErrorResponse,
    convertExceptionToResponse: convertExceptionToResponse,
    createSuccessResponse: createSuccessResponse,
    InternalErrorException: InternalErrorException,
    InvalidOperationException: InvalidOperationException,
    InvalidArgumentException: InvalidArgumentException
}