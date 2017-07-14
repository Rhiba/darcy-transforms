var canvas_width = 400;
var canvas_height = 400;
var max_x = 3;
var min_x = -2;
var max_y = 3;
var min_y = -2;
var line_width = 1;

// Recalculate when changing above params
var width_x = Math.abs(max_x) + Math.abs(min_x);
var width_y = Math.abs(max_y) + Math.abs(min_y);

var x_size = Math.round(canvas_width/width_x);
var y_size = Math.round(canvas_height/width_y);

var pxx = 0;
var pxy = 0;
var pyy = 0;
var px = 1;
var py = 0.5;

var qxx = 0;
var qxy = 0;
var qyy = 0;
var qx = 0;
var qy = 1.4;

function p(x,y) {
	return (pxx*x*x) + (pxy*x*y) + (pyy*y*y) + (px*x) + (py*y)
}
function q(x,y) {
	return (qxx*x*x) + (qxy*x*y) + (qyy*y*y) + (qx*x) + (qy*y)
}
function F(x,y) {
	return {x: p(x,y), y: q(x,y)}
}

$( document ).ready(function() {
	    var canvas1 = $('<canvas />').attr({id: "original", width: canvas_width, height: canvas_height}).css({"margin": "10px", "border-style": "solid", "border-width": "2px"}).appendTo('body');
	    var canvas2 = $('<canvas />').attr({id: "new", width: canvas_width, height: canvas_height}).css({"margin": "10px", "border-style": "solid", "border-width": "2px"}).appendTo('body');
		if (x_size*width_x+0.5 >= canvas_width) {
			$("#original").attr({width: x_size*width_x+1});
			$("#new").attr({width: x_size*width_x+1});
		}
		if (y_size*width_y+0.5 >= canvas_height) {
			$("#original").attr({height: y_size*width_y+1});
			$("#new").attr({height: y_size*width_y+1});
		}

		var lines = new Array();
		var ctxorig = $("#original").get(0).getContext("2d");
		var ctxnew = $("#new").get(0).getContext("2d");

		for (var x = min_x; x <= max_x; x++) {
			var line = {x1: x, y1: min_y, x2: x, y2:max_y};
			lines.push(line);
		}
		for (var y = min_y; y <= max_y; y++) {
			var line = {x1:min_x,y1:y,x2:max_x,y2:y};
			lines.push(line);
		}

		var h = $("#original").height();
		// There will be h-height_value because top left is 0,0 in canvas but on axis, 0,0 is bottom left and that took me like 4 hours to figure out why it was broken fml
		ctxorig.beginPath();
		var xshift = (0 - min_x)*x_size;
		var yshift = (0 - min_y)*y_size;
		for (var i = 0; i < lines.length; i++) {
			var realx1 = (lines[i].x1*x_size) + xshift + 0.5;
			var realx2 = (lines[i].x2*x_size) + xshift + 0.5;
			var realy1 = (lines[i].y1*y_size) + yshift + 0.5;
			var realy2 = (lines[i].y2*y_size) + yshift + 0.5;
			ctxorig.moveTo(realx1,h-realy1);
			ctxorig.lineTo(realx2,h-realy2);
		}
		ctxorig.strokeStyle = "green";
		ctxorig.lineWidth=line_width;
		ctxorig.stroke();
		ctxorig.fillStyle = "rgba(0,0,255,1)";
		ctxorig.fillRect(xshift,h-yshift,5,5);

		for (var l = 0; l < lines.length; l++) {
			//deal with vertical lines separately
			if (lines[l].x2-lines[l].x1 == 0) {
				var x = lines[l].x1;
				var points = new Array();
				var start, end;
				if (lines[l].y1 < lines[l].y2) {
					start = lines[l].y1;
					end = lines[l].y2;
				} else {
					start = lines[l].y2;
					end = lines[l].y1;
				}
				for (var y = start; y <= end; y++) {
					var point = { x: x, y: y };
					points.push(point);
				}
				var start_point = F(points[0].x,points[0].y);
				var realx = (start_point.x*x_size)+xshift+0.5;
				var realy = (start_point.y*y_size)+yshift+0.5;
				ctxnew.moveTo(realx,h-realy);
				for (var i = 1; i < points.length; i++) {
					var new_point = F(points[i].x,points[i].y);
					realx = (new_point.x*x_size)+xshift+0.5;
					realy = (new_point.y*y_size)+yshift+0.5;
					ctxnew.lineTo(realx,h-realy);
				}
			} else {
				var m = (lines[l].y2 - lines[l].y1)/(lines[l].x2 - lines[l].x1);
				var c = lines[l].y2 - (lines[l].x2*m);
				var points = new Array();
				var start, end;
				if (lines[l].x1 < lines[l].x2) {
					start = lines[l].x1;
					end = lines[l].x2;
				} else {
					start = lines[l].x2;
					end = lines[l].x1;
				}
				for (var x = start; x <= end; x++) {
					var point = { x: x, y: (m*x)+c };
					points.push(point);
				}
				var start_point = F(points[0].x,points[0].y);
				var realx = (start_point.x*x_size)+xshift+0.5;
				var realy = (start_point.y*y_size)+yshift+0.5;
				ctxnew.moveTo(realx,h-realy);
				for (var i = 1; i < points.length; i++) {
					var new_point = F(points[i].x,points[i].y);
					realx = (new_point.x*x_size)+xshift+0.5;
					realy = (new_point.y*y_size)+yshift+0.5;
					ctxnew.lineTo(realx,h-realy);
				}
			}
		}

		ctxnew.lineWidth = line_width;
		ctxnew.strokeStyle = "red";
		ctxnew.stroke();

});

function draw_grid(id){
	var context = $(id).get(0).getContext("2d");
	context.beginPath();

	for (var x = 0; x <= width_x; x++) {
		context.moveTo(x*x_size,0);
		context.lineTo(x*x_size,y_size*width_y);
	}
	for (var y = 0; y <= width_y; y++) {
		context.moveTo(0,y*y_size);
		context.lineTo(width_x*x_size,y*y_size);
	}

	context.strokeStyle = "green";
	context.lineWidth=line_width;
	context.stroke();

	/*
	context.beginPath();
	context.moveTo((width_x/2)*x_size,0);
	context.lineTo((width_x/2)*x_size,y_size*width_y);
	context.moveTo(0,(width_y/2)*y_size);
	context.lineTo(x_size*width_x,(width_y/2)*y_size);

	context.strokeStyle = "black";
	context.lineWidth=line_width;
	context.stroke();
	*/
	
}

function test_circle(id,col){
	var context = $(id).get(0).getContext("2d");
	context.beginPath();
	context.arc(x_size*(width_x/2),y_size*(width_y/2),x_size*2,0,2*Math.PI);
	context.strokeStyle = col;
	context.lineWidth=line_width;
	context.stroke();
}
