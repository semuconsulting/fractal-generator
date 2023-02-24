// ------------------------------------------------------------------------
// A basic complex number library which implements the methods used for
// Mandelbrot and Julia Set generation.
//
// Author: semudev2
// Copyright: Algol Variables © 2021
// License: GPLv3
// 
// This file is part of Fractal Generator.
// 
// Fractal Generator is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
// 
// Fractal Generator is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License along with Fractal Generator. If not, see <https://www.gnu.org/licenses/>. 
// ------------------------------------------------------------------------
'use strict';

// Instantiate complex number object.
function Complex(re, im) {
  this.re = re; // real
  this.im = im; // imaginary
}

Complex.prototype = {

  're': 0,
  'im': 0,

  // Set value.
  'set': function (re, im) {
    this.re = re;
    this.im = im;
  },

  // Get magnitude.
  'abs': function () {
    return Math.sqrt(this.abs2());
  },

  // Get magnitude squared.
  'abs2': function () {
    return this.re * this.re + this.im * this.im;
  },

  // Get polar representation (r, θ); angle in radians.
  'polar': function () {
    return { r: this.abs(), θ: Math.atan2(this.im, this.re) };
  },

  // Get square.
  'sqr': function () {
    var re2 = this.re * this.re - this.im * this.im;
    var im2 = 2 * this.im * this.re;
    return new Complex(re2, im2);
  },

  // Get complex number to the real power n.
  'pow': function (n) {
    if (n === 0) { return new Complex(1, 0); }
    if (n === 1) { return this; }
    if (n === 2) { return this.sqr(); }
    var pol = this.polar();
    return cart(Math.pow(pol.r, n), n * pol.θ);
  },

  // Get conjugate.
  'conjugate': function () {
    return new Complex(this.re, -this.im);
  },

  // Get quadratic zⁿ + c.
  'quad': function (n, c) {
    var zn = this.pow(n);
    return new Complex(zn.re + c.re, zn.im + c.im);
  },

  // Rotate by angle in radians.
  'rotate': function (angle) {
    var pol = this.polar();
    angle += pol.θ;
    return new Complex(pol.r * Math.cos(angle), pol.r * Math.sin(angle));
  },

  // String in exponent format to specified significant figures.
  'toString': function (sig = 9) {
    return this.re.toExponential(sig) + " + " + this.im.toExponential(sig) + "i";
  },
}

// Convert polar (r, θ) to cartesian representation (re, im).
function cart(r, θ) {
  var re = r * Math.cos(θ);
  var im = r * Math.sin(θ);
  return new Complex(re, im);
}

// Optimised pow() function for integer exponent n
// using 'halving and squaring'. Significantly Faster
// than Math.pow() for integer exponents.
function powi(base, n) {

  var res = 1;
  while (n) {
    if (n & 1) { // if n is odd
      res *= base;
    }
    n >>= 1; // n/2
    base *= base;
  }
  return res;
}
