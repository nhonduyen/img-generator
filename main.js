 /*****************************************************************************
   * intent:  generate image with number and 3 random rectangles
   * input :  image with blue background (input/blue.png)
   * output:  images with number and 3 random rectangle (/output)
   *****************************************************************************/
var fs = require('fs');
var drawing = require('pngjs-draw');
var png = drawing(require('pngjs').PNG);
var async = require('async');

var maxWidth = 500;
var maxHeight = 500;

for (let i = 100 - 1; i >= 0; i--) {
	let num = i;
	fs.createReadStream("input/blue.png")
	.pipe(new png({ filterType: 4, width: maxWidth, height: maxHeight }))
	.on('parsed', function() {
		let rect1 = getRandomRect(maxWidth);
		let rect2 = getRandomRect(maxWidth);
		let rect3 = getRandomRect(maxWidth);
		let pen = this;
		async.waterfall([
		function(callback) {
			let overlapped = false;
			if (checkOverlap(rect1,rect2) || checkOverlap(rect1,rect3) ||
				checkOverlap(rect2,rect3)) {
				console.log('overlapped '+num);
				overlapped = true;
			}
			
			callback(null, rect1, rect2, rect3, overlapped);
		},
		function(rect1, rect2, rect3, overlapped, callback) {
			while(overlapped) {
				rect1 = getRandomRect(maxWidth);
				rect2 = getRandomRect(maxWidth);
				rect3 = getRandomRect(maxWidth);
				if (!checkOverlap(rect1,rect2) && !checkOverlap(rect1,rect3) &&
					!checkOverlap(rect2,rect3)) {
					console.log('fix over lap pic '+ num);
				overlapped = false;}
				}
			
			callback(null, rect1, rect2, rect3)
		},
		function(rect1, rect2, rect3, callback) {
			pen.fillRect(rect1.x,rect1.y,rect1.width,rect1.width, pen.colors.red(255));
			pen.fillRect(rect2.x,rect2.y,rect2.width,rect2.width, pen.colors.red(255));
			pen.fillRect(rect3.x,rect3.y,rect3.width,rect3.width, pen.colors.red(255));
			pen.drawText(5,5, num + "", pen.colors.white(255));
			pen.pack().pipe(fs.createWriteStream('output/'+num+'.png'));
			callback();
		},
		]
		, function() { console.log('Finished generate output/'+num+'.png'); });
		
		
	});

}
/******************************************************
 *intent: generate random top left coordinate square
 *input : max width of the picture
 *output: top left coordinate square 
*******************************************************/
function getRandomRect(maxWidth) {
	let x = Math.round(Math.random()* (maxWidth/4)) + 10;
	let y = Math.round(Math.random()* (maxWidth/4)) + 10;
	let width = Math.round(Math.random() * 20) + 4; 
	let rec = {x:x, y:y, width:width};
	return rec;
}
/******************************************************
 *intent: check if 2 sqare overlapped
 *input : coordinate of 2 square
 *output: true if overlapped, false if not
*******************************************************/
function checkOverlap(rect1, rect2) {
	let rightBottom1 = {x: rect1.x + rect1.width, y: rect1.y - rect1.width};
	let rightBottom2 = {x: rect2.x + rect2.width, y: rect2.y - rect2.width};
	if (rect1.x > rightBottom2.x || rect2.x > rightBottom1.x) return false;
	if (rect1.y < rightBottom2.y || rect2.y < rightBottom1.y) return false;
	return true;
}

