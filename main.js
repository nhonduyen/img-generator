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
		let arr = [0, 1, 2];
		let pen = this;
		async.each(arr, function(item, callback) {
			let x = Math.round(Math.random()* (maxWidth/3)) + 10;
			let y = Math.round(Math.random()* (maxWidth/3)) + 10;
			let width = Math.round(Math.random() * 20) + 10;
			pen.fillRect(x,y,width,width, pen.colors.red(100));
			callback();
			
		}, function done() {

			pen.drawText(5,5, num + "", pen.colors.green(100));
			pen.pack().pipe(fs.createWriteStream('output/'+num+'.png'));
			console.log('Write file '+ 'output/'+num+'.png')
		});
		
	});

}


