function createSuccessResponse(message,data=[],status_code=200) {
    var res = {status:status_code,message:message,data:data};
    return res;
}

function createErrorResponse(message,status_code=500) {
    var res = {status:status_code,message:message};
    return res;
}

function convertExceptionToResponse(e) {
    if(e.hasOwnProperty('response')) return e.response;
    else if(e.hasOwnProperty('message')) return createErrorResponse(e.message,400);
    else return createErrorResponse(e,500);
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

class AnauthorizedException extends Error {
    constructor(message) {
      super(message);
      this.name = "AnauthorizedException";
      this.response = createErrorResponse(message,401);
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
    InvalidArgumentException: InvalidArgumentException,
    AnauthorizedException: AnauthorizedException
}