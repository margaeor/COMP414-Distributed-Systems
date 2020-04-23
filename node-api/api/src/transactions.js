const MongoError = require('mongodb').MongoError;
const MAX_WITH_TRANSACTION_TIMEOUT = 120000;

function hasNotTimedOut(startTime, max) {
    return Date.now() - startTime < max;
  }

function attemptTransaction(session, startTime, fn, options, ...args) {
    session.startTransaction(options);
    let promise;
    try {
      promise = fn(session,...args);
    } catch (err) {
      promise = Promise.reject(err);
    }
  
    return promise
      .then((result) => {

        return Promise.all([result,attemptTransactionCommit(session, startTime, fn, options, ...args)]);
      })
      .then((values) =>{
        return values[0];
      })
      .catch(err => {
        function maybeRetryOrThrow(err) {
          if (
            err instanceof MongoError &&
            err.hasErrorLabel('TransientTransactionError') &&
            hasNotTimedOut(startTime, MAX_WITH_TRANSACTION_TIMEOUT)
          ) {
            console.log('Transaction conflict. Trying again...');
            return attemptTransaction(session, startTime, fn, options, ...args);
          }
  
          throw err;
        }
  
        if (session.transaction.isActive) {
          return session.abortTransaction().then(() => maybeRetryOrThrow(err));
        }
  
        return maybeRetryOrThrow(err);
      });
}

function attemptTransactionCommit(session, startTime, fn, options, ...args) {
    return session.commitTransaction().catch(err => {
      if (err instanceof MongoError && hasNotTimedOut(startTime, MAX_WITH_TRANSACTION_TIMEOUT)) {
        if (err.hasErrorLabel('UnknownTransactionCommitResult')) {
          return attemptTransactionCommit(session, startTime, fn, options, ...args);
        }
  
        if (err.hasErrorLabel('TransientTransactionError')) {
          return attemptTransaction(session, startTime, fn, options, ...args);
        }
      }
  
      throw err;
    });
  }

  
async function runTransactionWithRetry(txFunc,collection, ...args) {

    var session;

    var result = -1;
    
    result = await collection.startSession().
    then(_session => {
        session = _session;
        const startTime = Date.now();
        return attemptTransaction(session, startTime, txFunc, {},...args);
    }).
    then((_result) => {
        session.endSession();
        return _result;
    });

    return result;

}

module.exports = {
    runTransactionWithRetry: runTransactionWithRetry,

};