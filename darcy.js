var canvas_width = 400;
var canvas_height = 400;
var max_x = 5;
var min_x = -5;
var max_y = 5;
var min_y = -5;
var line_width = 1;
var show_grid = true;

// Recalculate when changing above params
var width_x = Math.abs(max_x) + Math.abs(min_x);
var width_y = Math.abs(max_y) + Math.abs(min_y);

var x_size = Math.round(canvas_width/width_x);
var y_size = Math.round(canvas_height/width_y);

var pxx = 0.0;
var pxy = 0.0;
var pyy = 0.0;
var px = 1.0;
var py = 0.0;

var qxx = 0.0;
var qxy = 0.0;
var qyy = 0.0;
var qx = 0.0;
var qy = 1.0;

var drawing = new Array();

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
	    $("#original").attr({width: canvas_width, height: canvas_height}).css({"margin": "10px", "border-style": "solid", "border-width": "2px"});
	    $("#new").attr({width: canvas_width, height: canvas_height}).css({"margin": "10px", "border-style": "solid", "border-width": "2px"});
		$(".quad").on('input',set_vars);
		$(".range").on('input',function() {
			window[this.id] = parseInt(this.value,10);
			width_x = Math.abs(max_x) + Math.abs(min_x);
			width_y = Math.abs(max_y) + Math.abs(min_y);

			x_size = (canvas_width/width_x);
			y_size = (canvas_height/width_y);
			draw_all();
		});
		drawing.push({ x1: 2.4, y1: 2.4, x2:4.2, y2: -0.2 });
		drawing.push({ x1:4.2, y1: -0.2, x2:2.4, y2:-2.8 });
		drawing.push({ x1:2.4, y1: -2.8, x2:0.6, y2:-0.2});
		drawing.push({x1:0.6, y1:-0.2, x2:2.4, y2:2.4});
		draw_all();

});
function set_vars() {
	window[this.id] = parseFloat(this.value);
	draw_all();
}

function draw_all() {
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

		ctxorig.clearRect(0,0,x_size*width_x+1,y_size*width_y+1);

		for (var x = min_x; x <= max_x; x++) {
			var line = {x1: x, y1: min_y, x2: x, y2:max_y};
			lines.push(line);
		}
		for (var y = min_y; y <= max_y; y++) {
			var line = {x1:min_x,y1:y,x2:max_x,y2:y};
			lines.push(line);
		}

		var xshift = (0 - min_x)*x_size;
		var yshift = (0 - min_y)*y_size;

		var axis_lines = new Array();
		axis_lines.push({x1:min_x,y1:0,x2:max_x,y2:0});
		axis_lines.push({x1:0,y1:min_y,x2:0,y2:max_y});

		var h = $("#original").height();
		// There will be h-height_value because top left is 0,0 in canvas but on axis, 0,0 is bottom left and that took me like 4 hours to figure out why it was broken fml

		console.log(drawing);
		if (show_grid == true) {
			draw_lines(ctxorig,lines,"green",xshift,yshift,h);
			draw_lines(ctxorig,axis_lines,"black",xshift,yshift,h);
		}
		draw_lines(ctxorig,drawing,"blue",xshift,yshift,h);


		if (show_grid == true) {
			transform_lines(ctxnew,lines,"green",xshift,yshift,h);
			transform_lines(ctxnew,axis_lines,"black",xshift,yshift,h);
		}
		transform_lines(ctxnew,drawing,"red",xshift,yshift,h);
		$("#darcy-forms").css("width",canvas_width*2 + 4*2 + 2);
}


function draw_lines(ctx,lines,colour,xshift,yshift,h) {
	ctx.beginPath();
	for (var i = 0; i < lines.length; i++) {
		var realx1 = (lines[i].x1*x_size) + xshift + 0.5;
		var realx2 = (lines[i].x2*x_size) + xshift + 0.5;
		var realy1 = (lines[i].y1*y_size) + yshift + 0.5;
		var realy2 = (lines[i].y2*y_size) + yshift + 0.5;
		ctx.moveTo(realx1,h-realy1);
		ctx.lineTo(realx2,h-realy2);
	}
	ctx.strokeStyle = colour;
	ctx.lineWidth=line_width;
	ctx.stroke();
}

function transform_lines(ctx,lines,colour,xshift,yshift,h) {
	ctx.beginPath();
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
			for (var y = start; y <= end; y+=0.01) {
				var point = { x: x, y: y };
				points.push(point);
			}
			var start_point = F(points[0].x,points[0].y);
			var realx = (start_point.x*x_size)+xshift+0.5;
			var realy = (start_point.y*y_size)+yshift+0.5;
			ctx.moveTo(realx,h-realy);
			for (var i = 1; i < points.length; i++) {
				var new_point = F(points[i].x,points[i].y);
				realx = (new_point.x*x_size)+xshift+0.5;
				realy = (new_point.y*y_size)+yshift+0.5;
				ctx.lineTo(realx,h-realy);
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
			for (var x = start; x <= end; x+=0.01) {
				var point = { x: x, y: (m*x)+c };
				points.push(point);
			}
			var start_point = F(points[0].x,points[0].y);
			var realx = (start_point.x*x_size)+xshift+0.5;
			var realy = (start_point.y*y_size)+yshift+0.5;
			ctx.moveTo(realx,h-realy);
			for (var i = 1; i < points.length; i++) {
				var new_point = F(points[i].x,points[i].y);
				realx = (new_point.x*x_size)+xshift+0.5;
				realy = (new_point.y*y_size)+yshift+0.5;
				ctx.lineTo(realx,h-realy);
			}
		}
	}

	ctx.lineWidth = line_width;
	ctx.strokeStyle = colour;
	ctx.stroke();
}
