 /*****************************************************************************
   * intent:  generate image with number and 3 random rectangles
   * input :  image width and height
   * output:  images with number and 3 random rectangle (/output)
   *****************************************************************************/
var fs = require('fs');

var PImage = require('pureimage');
var Jimp = require('jimp');
var async = require('async');

var maxWidth = 500;
var maxHeight = 500;


for (let i = 100; i >= 0; i--) {
	let num = i;
	var img1 = PImage.make(maxWidth,maxHeight);
	var ctx = img1.getContext('2d');
	ctx.fillStyle = 'rgba(255,0,0, 0.5)';
	let combineFlag = ((i%4)==0) ? true:false;
	if (combineFlag) {
		let overlapped1 = true;
		while(overlapped1) {
			let rect = getRandomSharpCoordinate(maxWidth,maxHeight);
		//let rect2 = getRandomSharpCoordinate(maxWidth,maxHeight);
		let circ = getRandomSharpCoordinate(maxWidth,maxHeight);
		let tri = getRandomSharpCoordinate(maxWidth,maxHeight);
		if (!checkOverlapCircle(rect,circ)) {
			ctx.fillRect(rect.x,rect.y,rect.width,rect.width);
		ctx.fillStyle = '#ffff00';
		//ctx.fillRect(rect2.x,rect2.y,rect2.width,rect2.height);
		ctx.fillTriangle(tri.x, tri.x, tri.width, tri.width);
		ctx.fillStyle = '#00ff00';
		ctx.beginPath();
		ctx.arc(circ.x,circ.y,circ.width,0,Math.PI*2,true);
		
		ctx.closePath();
		ctx.fill();
		overlapped1 = false;
		}
		else {
			rect = getRandomSharpCoordinate(maxWidth,maxHeight);
			rect2 = getRandomSharpCoordinate(maxWidth,maxHeight);
			circ = getRandomSharpCoordinate(maxWidth,maxHeight);
		}
	}
	}
	else {
		let overlapped = true;
		while(overlapped) {
			let rect1 = getRandomSharpCoordinate(maxWidth,maxHeight);
			let rect2 = getRandomSharpCoordinate(maxWidth,maxHeight);
			let rect3 = getRandomSharpCoordinate(maxWidth,maxHeight);
			if (!checkOverlap(rect1,rect2) && !checkOverlap(rect1,rect3) &&
					!checkOverlap(rect2,rect3)) {
				ctx.fillRect(rect1.x,rect1.y,rect1.width,rect1.width);
			ctx.fillRect(rect2.x,rect2.y,rect2.width,rect2.width);
			ctx.fillRect(rect3.x,rect3.y,rect3.width,rect3.width);
			    ctx.fillStyle = '#ffff00';
				overlapped = false;
			} else {
				rect1 = getRandomSharpCoordinate(maxWidth,maxHeight);
				rect2 = getRandomSharpCoordinate(maxWidth,maxHeight);
				rect3 = getRandomSharpCoordinate(maxWidth,maxHeight);
			}
		}
	}
	PImage.encodePNGToStream(img1, fs.createWriteStream('output/'+num+'.png')).then(()=> {
		Jimp.read("output/"+num+".png", function (err, image) {
			Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (font) {
				image.print(font, 5, 5, num+'');
				image.write('output/'+num+'.png');
				console.log('Finish creating output/'+num+'.png');
			});
		});
	}).catch((e)=> {console.log("there was an error writing ",e);});
}
/******************************************************
 *intent: generate random top left coordinate rectangle
 *input : max width of the picture
 *output: top left coordinate square 
*******************************************************/
function getRandomSharpCoordinate(maxWidth, maxHeight) {
	let x = Math.round(Math.random()* (maxWidth/2)) + 20;
	let y = Math.round(Math.random()* (maxWidth/2)) + 20;
	let width = Math.round(Math.random() * 20) + 5; 
	let height = Math.round(Math.random() * 20) + 5; 
	let sharp = {x:x, y:y, width:width, height: height};
	return sharp;
}
/******************************************************
 *intent: check overlap 2 recangle
 *input : 2 rectangles
 *output: true if overlap, false if not
*******************************************************/
function checkOverlap(rect1, rect2) {
	let rightBottom1 = {x: rect1.x + rect1.width, y: rect1.y - rect1.width};
	let rightBottom2 = {x: rect2.x + rect2.width, y: rect2.y - rect2.width};
	if (rect1.x > rightBottom2.x || rect2.x > rightBottom1.x) return false;
	if (rect1.y < rightBottom2.y || rect2.y < rightBottom1.y) return false;
	return true;
}
/******************************************************
 *intent: check overlap recangle and circle
 *input : rectangle and circle
 *output: true if overlap, false if not
*******************************************************/
function checkOverlapCircle(rect, circle) {
	let circleDistanceX = Math.abs(circle.x - rect.x);
	let circleDistanceY = Math.abs(circle.y - rect.y);

	if (circleDistanceX > (rect.width/2 + circle.width)) return false;
    if (circleDistanceY > (rect.height/2 + circle.width)) return false;

    if (circleDistanceX <= (rect.width/2)) return true; 
    if (circleDistanceY <= (rect.height/2)) return true;

    let cornerDistance_sq = (circleDistanceY - rect.width/2)^2 +
                         (circleDistanceY - rect.height/2)^2;

    return (cornerDistance_sq <= (circle.width^2));
}
