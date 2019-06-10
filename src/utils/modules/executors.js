import {noop} from "./utils_module.js";
import {removeFromArray} from "./array_utils.js";


// asynchronous work executor - can execute work in batches
export const ExecutorManyByMany = (promiseCallbackFn, onAllDoneFn = noop) => {   // promise needs to resolve with array of finished work items
  const _work = [];
  let _promise = Promise.resolve(), _isWorking = false;
  const executeWork = () => _isWorking ? _promise : _promise = startWork();
  const addWork = workItem => _work.push(workItem);

  return {
    addWork: addWork,
    addWorkAndExecute: workItem => {
      addWork(workItem);
      return executeWork()
    },   // returns Promise
    executeWork: executeWork                                                    // returns Promise
  };

  function startWork() {
    return new Promise((resolve, reject) => {
      // console.log('eoo: how much / the work', _work.length, _work);
      if (_work.length === 0) {   // END of recursion
        onAllDoneFn();
        return resolve();
      }
      _isWorking = true;
      promiseCallbackFn(_work).then(finished => {
        finished.forEach(item => removeFromArray(_work, item));
        _isWorking = false;
        startWork().then(resolve, reject);   // recursion with chained callbacks
      }, error => {
        console.error(error);
        _isWorking = false;
        reject();
      });
    })
  }
};

// asynchronous work executor - you can add work and it will execute it one by one
export const ExecutorOneByOne = (promiseCallbackFn, onAllDoneFn) => ExecutorManyByMany(workArray => promiseCallbackFn(workArray[0]).then(() => [workArray[0]]), onAllDoneFn);

// asynchronous work executor - work is executed one by one, but always only the last one added (if you add 5 items while first one is processed, then 4 are skipped and only last one is executed)
export const ExecutorOneByLastOne = (promiseCallbackFn, onAllDoneFn) => ExecutorManyByMany(
  workArray => promiseCallbackFn(workArray[0])                    // call callback with the finished item
    .then(() => [workArray[0]].concat(workArray.slice(1, -1))),   // return array of: [finished item (the first one), ...REST_OF_THE_ITEMS_EXCEPT_LAST_ONE]
  onAllDoneFn
);
