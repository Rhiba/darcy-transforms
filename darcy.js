var canvas_width = 400;
var canvas_height = 400;
var max_x = 3;
var min_x = -3;
var max_y = 3;
var min_y = -3;

$( document ).ready(function() {
	    var canvas1 = $('<canvas />').attr({id: "original", width: canvas_width, height: canvas_height}).css("padding", "10px").appendTo('body');
	    var canvas2 = $('<canvas />').attr({id: "new", width: canvas_width, height: canvas_height}).css("padding", "10px").appendTo('body');
		draw_grid("#original");
		draw_grid("#new");
});

function draw_grid(id){
	$(id).attr({width: canvas_width, height: canvas_height});

	var width_x = Math.abs(max_x) + Math.abs(min_x);
	var width_y = Math.abs(max_y) + Math.abs(min_y);

	var x_size = Math.round(canvas_width/width_x);
	var y_size = Math.round(canvas_height/width_y);

	if (x_size*width_x >= canvas_width) {
		$(id).attr({width: x_size*width_x});
	}
	if (y_size*width_y >= canvas_height) {
		$(id).attr({height: y_size*width_y});
	}

	var context = $(id).get(0).getContext("2d");
	console.log(context);

	for (var x = 0; x <= width_x; x++) {
		context.moveTo(x*x_size,0);
		context.lineTo(x*x_size,y_size*width_y);
	}
	for (var y = 0; y <= width_y; y++) {
		context.moveTo(0,y*y_size);
		context.lineTo(width_x*x_size,y*y_size);
	}

	context.strokeStyle = "black";
	context.stroke();
	
}
