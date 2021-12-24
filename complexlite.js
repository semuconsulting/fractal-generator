// ------------------------------------------------------------------------
// A basic complex number library which implements the methods used for
// Mandelbrot and Julia Set generation.
//
// Copyright (c) 2021 semuadmin
//
// BSD 3-Clause License
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
