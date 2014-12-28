Usage
==================================
```
$ npm install
$ NODE_PATH=node_modules node index.js 
[DONE] RESET DATABASE
[ '[DONE] generate test data: leftMatrix: ',
  [ { row: 0, column: 0, value: 0, _id: 54a0219b5c38d4e4722b9c8f },
    { row: 0, column: 1, value: 1, _id: 54a0219b5c38d4e4722b9c90 },
    { row: 0, column: 2, value: 2, _id: 54a0219b5c38d4e4722b9c91 },
    { row: 1, column: 0, value: 1, _id: 54a0219b5c38d4e4722b9c92 },
    { row: 1, column: 1, value: 2, _id: 54a0219b5c38d4e4722b9c93 },
    { row: 1, column: 2, value: 3, _id: 54a0219b5c38d4e4722b9c94 } ] ]
[ '[DONE] generate test data: rightMatrix: ',
  [ { row: 0, column: 0, value: 0, _id: 54a0219b5c38d4e4722b9c95 },
    { row: 0, column: 1, value: 1, _id: 54a0219b5c38d4e4722b9c96 },
    { row: 0, column: 2, value: 2, _id: 54a0219b5c38d4e4722b9c97 },
    { row: 0, column: 3, value: 3, _id: 54a0219b5c38d4e4722b9c98 },
    { row: 1, column: 0, value: 1, _id: 54a0219b5c38d4e4722b9c99 },
    { row: 1, column: 1, value: 2, _id: 54a0219b5c38d4e4722b9c9a },
    { row: 1, column: 2, value: 3, _id: 54a0219b5c38d4e4722b9c9b },
    { row: 1, column: 3, value: 4, _id: 54a0219b5c38d4e4722b9c9c },
    { row: 2, column: 0, value: 2, _id: 54a0219b5c38d4e4722b9c9d },
    { row: 2, column: 1, value: 3, _id: 54a0219b5c38d4e4722b9c9e },
    { row: 2, column: 2, value: 4, _id: 54a0219b5c38d4e4722b9c9f },
    { row: 2, column: 3, value: 5, _id: 54a0219b5c38d4e4722b9ca0 } ] ]
[DONE] import "leftMatrix" and "rightMatrix" to multiplication_prepare: leftMatrix_rightMatrix_temp
[DONE] multiplication_result collection: LeftMatrix_X_RightMatrix_Result
[ '[DONE] multiplication result: ',
  [ { _id: { column: 0, row: 0 }, value: 5 },
    { _id: { column: 1, row: 0 }, value: 8 },
    { _id: { column: 2, row: 0 }, value: 11 },
    { _id: { column: 3, row: 0 }, value: 14 },
    { _id: { column: 0, row: 1 }, value: 8 },
    { _id: { column: 1, row: 1 }, value: 14 },
    { _id: { column: 2, row: 1 }, value: 20 },
    { _id: { column: 3, row: 1 }, value: 26 } ] ]
```
