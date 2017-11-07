var fs = require('fs');
var imgGen = require('js-image-generator');
var Jimp = require('jimp');

// generate multiple images
for (let i = 10 - 1; i >= 0; i--) {
	imgGen.generateImage(500, 500, 80, function(err, image) {
		console.log('generate image ' +i);
		fs.writeFileSync('output/dummy' + i + '.png', image.data);
	});
}
for (let i = 10 - 1; i >= 0; i--) {
	let fileName = 'output/dummy'+ i +'.png';
	let imageCaption = '' + i;
	let loadedImage;
	Jimp.read(fileName)
    .then(function (image) {
        loadedImage = image;
        console.log('load image ' + fileName);
        return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    })
    .then(function (font) {
    	console.log('write file ' + fileName);
        loadedImage.print(font, 20, 20, imageCaption)
                   .write(fileName);
    })
    .catch(function (err) {
        console.error(err);
    });
}
