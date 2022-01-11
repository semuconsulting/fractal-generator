// ------------------------------------------------------------------------
// Core fractal calculation and color rendering functions for 
// fractal generator.
//
// Uses Complex object type from complexlite.js library.
//
// fractal() function features a number of optimisations to minimise the 
// number of maths operations per iteration.
//
// Copyright (c) 2021 Algol Variables
//
// BSD 3-Clause License
// ------------------------------------------------------------------------
"use strict";

const MANDELBROT = 0;
const JULIA = 1;
const STANDARD = 0;
const BURNING_SHIP = 1;
const TRICORN = 2;
const PHOENIX = 3;
const MINITERM = 100; // Minimum iterations for Mandelbrot
const MINITERJ = 600; // Minimum iterations for Julia

// Converts pixel (x/y) coordinates to complex (real/imaginary) space coordinates
//
// @param {number} width - width of canvas in pixels
// @param {number} height - height of canvas in pixels
// @param {number} x - x (horizontal) pixel coordinate
// @param {number} y - y (vertical) pixel coordinate
// @param {Complex} cOffset - offset from origin in complex space 
// @param {number} zoom - zoom level
// @param {boolean} swap - transpose x/y axes
// @return {Complex} - complex (re/im) coordinate
//
function ptoc(width, height, x, y, cOffset, zoom, swap) {
    var temp;
    if (swap) { // X/Y axes are swapped
        temp = x;
        x = y;
        y = temp;
        temp = width;
        width = height;
        height = temp;
    }
    var re = cOffset.re + ((width / height) * (x - width / 2) / (zoom * width / 2));
    var im = cOffset.im + (-1 * (y - height / 2) / (zoom * height / 2));
    return new Complex(re, im);
}

// Calculate the escape scalars for the complex coordinates c, cj and integer 
// exponent n. Uses basic maths for n = 2 (the most common Mandelbrot 
// configuration) and Complex polar maths for n > 2.
//
// @param {Complex} c - complex space coordinate
// @param {Complex} cj - complex origin constant for Julia set
// @param {number} n - integer exponent
// @param {number} maxiter - maximum iterations before bailout
// @param {number} radius - bailout radius squared 
// @param {number} mode - 0 = Mandelbrot, 1 = Julia
// @param {number} variant - 0 = Standard, 1 = Burning Ship, 2 = Tricorn
// @return {object} - scalars (i = bailout iteration, za = absolute value of z squared)
//
function fractal(c, cj, n, maxiter, radius, mode, variant) {

    var i, za, zre, zim, zre2, zim2, tre, cre, cim, r, θ;
    var lastre = 0;
    var lastim = 0;
    var per = 0;
    if (mode === JULIA) {
        cre = cj.re;
        cim = cj.im;
        zre = c.re;
        zim = c.im;
    }
    else { // Mandelbrot mode
        cre = c.re;
        cim = c.im;
        zre = 0;
        zim = 0;
    }

    // Iterate until abs(z) exceeds escape radius
    for (i = 0; i < maxiter; i += 1) {

        if (variant === BURNING_SHIP) {
            zre = Math.abs(zre);
            zim = -Math.abs(zim);
        }
        else if (variant === TRICORN) {
            zim = -zim; // conjugate z
        }

        // doing squaring now saves a couple of calculations later
        zre2 = zre * zre;
        zim2 = zim * zim;
        za = zre2 + zim2 // abs(z)²
        if (za > radius) { // abs(z)² > radius²
            break;
        }

        if (n == 2) { // z = z² + c
            tre = zre2 - zim2 + cre;
            zim = 2 * zre * zim + cim;
            zre = tre;
        }
        else { // z = zⁿ + c, where n is integer > 2
            r = powi(Math.sqrt(zre2 + zim2), n); // radiusⁿ
            θ = n * Math.atan2(zim, zre); // angleⁿ
            zre = r * Math.cos(θ) + cre;
            zim = r * Math.sin(θ) + cim;
        }

        // Periodicity check optimisation - speeds
        // up processing of points within set
        if (zre === lastre && zim === lastim) {
            i = maxiter;
            break;
        }
        per += 1;
        if (per > 20) {
            per = 0;
            lastre = zre;
            lastim = zim;
        }
        // ... end of periodicity check

    }
    return { i, za };
}

// Normalize iteration count from escape scalars
// to produces smoother color gradients.
//
// @param {object} scalars - scalars {i, za} returned by fractals() function
// @param {Complex} cOffset - complex space offset from origin
// @param {number} radius - bailout radius
// @param {number} n - integer exponent
// @return {number} - normalised bailout iteration count
//
function normalize(scalars, radius, exponent) {
    var lzn = Math.log(scalars.za) * 2;
    var nu = Math.log(lzn / Math.log(radius)) / Math.log(exponent);
    return scalars.i + 1 - nu;
}

// Arbitrary algorithm to derive 'optimal' max iterations for a given
// zoom level, enhancing legibility at higher magnifications.
// Can be overridden by setting autoiter to False - often worth experimenting
// for best cosmetic results.
//
// @param {number} zoom - zoom level
// @param {number} mode - 0 = Mandelbrot, 1 = Julia
// @return {number} - calculated maximum iteration count
//
function getAutoiter(zoom, mode) {
    var miniter = mode === JULIA ? MINITERJ : MINITERM;
    return Math.max(miniter, parseInt(Math.abs(500 * Math.log(1 / Math.sqrt(zoom)))));
}
