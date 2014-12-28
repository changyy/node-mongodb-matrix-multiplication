var async = require('async');
var mongoose = require('mongoose');
var server = 'localhost/test';

async.series([
	// Step 0: dropDatabase
	function(callback) {
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			conn.db.dropDatabase();
			conn.close();
			callback(null, '[DONE] RESET DATABASE');
		});
	},

	// Step 1: generate test data
	function(callback) {
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			var model = conn.model( 
				'leftMatrix', 
				new mongoose.Schema({ row: String, column: String, value: Number}), 
				'leftMatrix'
			);
			var row = 2;
			var column = 3;
			var record_array = [];
			for (var i=0; i < row; ++i)
				for (var j=0 ; j < column; ++j)
					record_array.push( { row: i, column: j, value: i+j} );
			model.collection.insert(record_array, {w:1}, function (err) {
				if (err)
					console.log(err);
				conn.close();
				callback(null, '[DONE] generate test data: leftMatrix: ', record_array);
			});
		});
	},
	// Step 2: generate test data
	function(callback) {
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			var model = conn.model( 
				'rightMatrix', 
				new mongoose.Schema({ row: String, column: String, value: Number}), 
				'rightMatrix'
			);
			var row = 3;
			var column = 4;
			var record_array = [];
			for (var i=0; i < row; ++i)
				for (var j=0 ; j < column; ++j)
					record_array.push( { row: i, column: j, value: i+j} );
			model.collection.insert(record_array, {w:1}, function (err) {
				if (err)
					console.log(err);
				conn.close();
				callback(null, '[DONE] generate test data: rightMatrix: ', record_array);
			});
		});
	},

	// STEP 3: merge two matrix into one collection
	function(callback) {
		var collection_out = 'result';
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			var leftMatrix = 'leftMatrix';
			var leftRow = 2;
			var leftColumn = 3;
			var leftRowFieldName = 'row';
			var leftColumnFieldName = 'column';
			var leftValueFieldName = 'value';

			var rightMatrix = 'rightMatrix';
			var rightRow = 3;
			var rightColumn = 4;
			var rightRowFieldName = 'row';
			var rightColumnFieldName = 'column';
			var rightValueFieldName = 'value';

			var multiplication_prepare = leftMatrix + '_' + rightMatrix + '_temp';
			var multiplication_prepare_typeFieldName = 'type';
			var multiplication_prepare_rowFieldName = 'row';
			var multiplication_prepare_columnFieldName = 'column';
			var multiplication_prepare_valueFieldName = 'value';

			var o = {};
			o.scope = { 
				inputType: 'LeftMatrix',
				inputRowFieldName: leftRowFieldName,
				inputColumnFieldName: leftColumnFieldName,
				inputValueFieldName: leftValueFieldName,

				multiplicationPrepareMatrix: multiplication_prepare,
				multiplicationPrepareMatrixTypeFieldName: multiplication_prepare_typeFieldName,
				multiplicationPrepareMatrixRowFieldName: multiplication_prepare_rowFieldName,
				multiplicationPrepareMatrixColumnFieldName: multiplication_prepare_columnFieldName,
				multiplicationPrepareMatrixValueFieldName: multiplication_prepare_valueFieldName,
			};

			o.map = function(){
				if (this[inputRowFieldName] == undefined || this[inputColumnFieldName] == undefined || this[inputValueFieldName] == undefined)
					return;
				var obj = {};
				obj[multiplicationPrepareMatrixTypeFieldName] = inputType;
				obj[multiplicationPrepareMatrixRowFieldName] = this[inputRowFieldName];
				obj[multiplicationPrepareMatrixColumnFieldName] = this[inputColumnFieldName];
				emit(obj, this[inputValueFieldName]);
			}

			o.out = {
				replace: multiplication_prepare,
				sharded: true,
			};

			var objLeftMatrix = {}
			objLeftMatrix[leftRowFieldName] = Number;
			objLeftMatrix[leftColumnFieldName] = Number;
			objLeftMatrix[leftValueFieldName] = Number;
			var modelLeftMatrix = conn.model( 'leftMatrix', new mongoose.Schema(objLeftMatrix), leftMatrix);
			modelLeftMatrix.mapReduce(o, function (err, results) {
				if(err)
					console.log(err);
				o.scope.inputType = 'RightMatrix';
				o.scope.inputRowFieldName = rightRowFieldName;
				o.scope.inputColumnFieldName = rightColumnFieldName;
				o.scope.inputValueFieldName = rightValueFieldName;
				o.out = {
					merge: multiplication_prepare,
					sharded: true,
				};
				var objRightMatrix = {}
				objRightMatrix[rightRowFieldName] = Number;
				objRightMatrix[rightColumnFieldName] = Number;
				objRightMatrix[rightValueFieldName] = Number;
				var modelRightMatrix = conn.model( 'rightMatrix', new mongoose.Schema(objRightMatrix), rightMatrix);
				modelRightMatrix.mapReduce(o, function (err, results) {
					if(err)
						console.log(err);
					conn.close();
					callback(null, '[DONE] import "' + leftMatrix + '" and "' + rightMatrix + '" to multiplication_prepare: ' + multiplication_prepare);
				});
			});
		});
	},

	// STEP 4: mapreduce
	function(callback) {
		var collection_out = 'result';
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			var multiplication_result = 'LeftMatrix_X_RightMatrix_Result';

			var multiplication_prepare = 'leftMatrix_rightMatrix_temp';
			var multiplication_prepare_leftMatrixType = 'LeftMatrix';
			var multiplication_prepare_rightMatrixType = 'RightMatrix';
			var multiplication_prepare_typeFieldName = 'type';
			var multiplication_prepare_rowFieldName = 'row';
			var multiplication_prepare_columnFieldName = 'column';
			var multiplication_prepare_valueFieldName = 'value';

			var multiplication_prepare_leftMatrixRow = 2;
			var multiplication_prepare_leftMatrixColumn = 3;
			var multiplication_prepare_rightMatrixRow = 3;
			var multiplication_prepare_rightMatrixColumn = 4;

			var outRowFieldName = 'row';
			var outColumnFieldName = 'column';

			var o = {};
			o.scope = { 
				inputTypeFieldName: multiplication_prepare_typeFieldName,
				inputRowFieldName: multiplication_prepare_rowFieldName,
				inputColumnFieldName: multiplication_prepare_columnFieldName,
				inputValuefieldName: multiplication_prepare_valueFieldName,

				leftMatrixType: multiplication_prepare_leftMatrixType,
				rightMatrixType: multiplication_prepare_rightMatrixType,

				leftMatrixRow: multiplication_prepare_leftMatrixRow,
				leftMatrixColumn: multiplication_prepare_leftMatrixColumn,
				rightMatrixRow: multiplication_prepare_rightMatrixRow, 
				rightMatrixColumn: multiplication_prepare_rightMatrixColumn,

				outRowFieldName: outRowFieldName,
				outColumnFieldName: outColumnFieldName,
			};
			o.verbose = true;
			o.jsMode = false;
			o.map = function(){
				if (
					this['_id'] != undefined
					&& this['_id'][inputTypeFieldName] != undefined 
					&& this['_id'][inputRowFieldName] != undefined 
					&& this['_id'][inputColumnFieldName] != undefined 
					&& this[inputValuefieldName] != undefined
				){
					if (this['_id'][inputTypeFieldName] == leftMatrixType) {
						for (var c=0 ; c<rightMatrixColumn; ++c) {
							var key = {};
							key[outRowFieldName] = this['_id'][inputRowFieldName];
							key[outColumnFieldName] = c;
							var value = {
								index: this['_id'][inputColumnFieldName] ,
								value: this[inputValuefieldName],
								type: leftMatrixType,
							};
							emit(key, value);
						}
					} else if (this['_id'][inputTypeFieldName] == rightMatrixType) {
						for (var r=0 ; r<leftMatrixRow; ++r) {
							var key = {};
							key[outRowFieldName] = r;
							key[outColumnFieldName] = this['_id'][inputColumnFieldName];
							var value = {
								index: this['_id'][inputRowFieldName],
								value: this[inputValuefieldName],
								type: rightMatrixType,
							};
							emit(key, value);
						}

					}
//print(JSON.stringify(this));
//print(JSON.stringify(obj));
				}
			}
			o.reduce = function(k, vals) {
				var sum = 0;
				var mul = {};
				vals.forEach(function(doc){ 
					if (mul[doc.index] != undefined) {
						sum += mul[doc.index] * doc.value;
					} else {
						mul[doc.index] = doc.value;
					}
				});
				return sum;
			}
			o.out = {
				replace: multiplication_result,
				sharded: true,
			};
	
			var obj = {}
			obj['_id'] = {};
			obj['_id'][multiplication_prepare_typeFieldName] = String;
			obj['_id'][multiplication_prepare_rowFieldName] = Number;
			obj['_id'][multiplication_prepare_columnFieldName] = Number;
			obj[multiplication_prepare_valueFieldName] = Number;
			var model = conn.model( 'multiplication_prepare', new mongoose.Schema(obj), multiplication_prepare);
			model.mapReduce(o, function (err, results) {
				if(err)
					console.log(err);
				conn.close();
				callback(null, '[DONE] multiplication_result collection: ' + multiplication_result);
			});
		});
	},

	// STEP 5: output
	function(callback) {
		var collection_out = 'result';
		var conn = mongoose.createConnection('mongodb://'+server);
		conn.on('error', console.error.bind(console, 'connection error:'));
		conn.once('open', function () {
			var multiplication_result = 'LeftMatrix_X_RightMatrix_Result';
			var multiplication_result_rowFieldName = 'row';
			var multiplication_result_columnFieldName = 'column';
			var multiplication_result_valueFieldName = 'value';

			var obj = {}
			obj['_id'] = {};
			obj[multiplication_result_valueFieldName] = Number;
			var model = conn.model( 'multiplication_result', new mongoose.Schema(obj), multiplication_result);
			model.find(function(err, data) {
				if(err)
					console.log(err);
				conn.close();
				callback(null, '[DONE] multiplication result: ', data);
			});
		});
	},
], function(err, result){
	if (err)
		console.log(err);
	for (var i=0, cnt=result.length ; i<cnt ; ++i)
		console.log(result[i]);
});
