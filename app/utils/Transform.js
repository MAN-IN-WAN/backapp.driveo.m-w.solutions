/**
 * Transformer for Sencha Touch 2
 *  
 * @author Sang Oh <swoh77@gmail.com>
 * 
 * This source is orignated from Zooming via HTML5 Canvas Context and restructured into sencha touch.
 * Origin : http://phrogz.net/tmp/canvas_zoom_to_cursor.html
 *          author Gavin Kistner < mailto:!@phrogz.net >
 * 
 */

Ext.define('backapp.utils.Transform', {
	config:{},
	m:[1,0,0,0,0,0],
	reset:function() {
		this.m = [1,0,0,1,0,0];
	},
	clone:function() {
		var k = new Ext.create('backapp.utils.Transform');
		for (var i=0;i<this.m.length;i++) {
			k.m[i] = this.m[i];
		}
		return k;
	},
	multiply:function(matrix) {
		var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
		var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
		
		var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
		var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
		
		var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
		var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
		
		this.m[0] = m11;
		this.m[1] = m12;
		this.m[2] = m21;
		this.m[3] = m22;
		this.m[4] = dx;
		this.m[5] = dy;
	},
	invert:function() {
		var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
		var m0 = this.m[3] * d;
		var m1 = -this.m[1] * d;
		var m2 = -this.m[2] * d;
		var m3 = this.m[0] * d;
		var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
		var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
		this.m[0] = m0;
		this.m[1] = m1;
		this.m[2] = m2;
		this.m[3] = m3;
		this.m[4] = m4;
		this.m[5] = m5;
	},
	rotate:function(rad) {
		var c = Math.cos(rad);
		var s = Math.sin(rad);
		var m11 = this.m[0] * c + this.m[2] * s;
		var m12 = this.m[1] * c + this.m[3] * s;
		var m21 = this.m[0] * -s + this.m[2] * c;
		var m22 = this.m[1] * -s + this.m[3] * c;
		this.m[0] = m11;
		this.m[1] = m12;
		this.m[2] = m21;
		this.m[3] = m22;
	},
	translate:function(x, y) {
		this.m[4] += this.m[0] * x + this.m[2] * y;
		this.m[5] += this.m[1] * x + this.m[3] * y;
	},
	scale:function(sx, sy) {
		this.m[0] *= sx;
		this.m[1] *= sx;
		this.m[2] *= sy;
		this.m[3] *= sy;
	},
	transformPoint:function(px, py) {
		var x = px;
		var y = py;
		px = x * this.m[0] + y * this.m[2] + this.m[4];
		py = x * this.m[1] + y * this.m[3] + this.m[5];
		return [px, py];
	}
});
