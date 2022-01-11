// ------------------------------------------------------------------------
// Core fractal calculation and color rendering routines.
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
const MINITERJ = 200; // Minimum iterations for Julia

// Converts pixel (x/y) coordinates to complex (real/imaginary) space coordinates
// (zoffpos is always the complex offset).
function ptoc(width, height, x, y, zoffpos, zoom, swap) {
    var temp;
    if (swap) { // X/Y axes are swapped
        temp = x;
        x = y;
        y = temp;
        temp = width;
        width = height;
        height = temp;
    }
    var re = zoffpos.re + ((width / height) * (x - width / 2) / (zoom * width / 2));
    var im = zoffpos.im + (-1 * (y - height / 2) / (zoom * height / 2));
    return new Complex(re, im);
}

// Calculate the escape scalars for the complex coordinates c, cj and integer 
// exponent n. Uses basic maths for n = 2 (the most common Mandelbrot 
// configuration) and Complex polar maths for n > 2.
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
// scalars := {i, za}
function normalize(scalars, radius, exponent) {
    var lzn = Math.log(scalars.za) * 2;
    var nu = Math.log(lzn / Math.log(radius)) / Math.log(exponent);
    return scalars.i + 1 - nu;
}

// Arbitrary algorithm to derive 'optimal' max iterations for a given
// zoom level, enhancing legibility at higher magnifications.
// Can be overridden by setting autoiter to False - often worth experimenting
// for best cosmetic results.
function getAutoiter(zoom, mode) {
    var miniter = mode === JULIA ? MINITERJ : MINITERM;
    return Math.max(miniter, parseInt(Math.abs(500 * Math.log(1 / Math.sqrt(zoom)))));
}

// Linear interpolation between two RGB colors [r, g, b].
function interpolate(col1, col2, ni) {
    var f = ni % 1; // fractional part of ni
    var r = (col2[0] - col1[0]) * f + col1[0];
    var g = (col2[1] - col1[1]) * f + col1[1];
    var b = (col2[2] - col1[2]) * f + col1[2];
    return { r: r, g: g, b: b }
}

// Convert HSV values (in range 0-1) to RGB (in range 0-255).
function hsv2rgb(h, s, v) {

    var i, f, p, q, t, col;

    v = parseInt(v * 255);
    if (s === 0.0) {
        return { r: v, g: v, b: v };
    }
    i = parseInt(h * 6.0);
    f = (h * 6.0) - i;
    p = parseInt(v * (1.0 - s));
    q = parseInt(v * (1.0 - s * f));
    t = parseInt(v * (1.0 - s * (1.0 - f)));
    switch (i %= 6) {
        case 0:
            col = { r: v, g: t, b: p };
            break;
        case 1:
            col = { r: q, g: v, b: p };
            break;
        case 2:
            col = { r: p, g: v, b: t };
            break;
        case 3:
            col = { r: p, g: q, b: v };
            break;
        case 4:
            col = { r: t, g: p, b: v };
            break;
        case 5:
            col = { r: v, g: p, b: q };
            break;
        default:
            col = { r: v, g: v, b: v };
    }
    return col;
}

// WORK IN PROGRESS Make linearly interpolated color gradient
// cols = list of key RGB colors e.g. [[66, 30, 15], [25, 7, 26], etc.]
// levels = number of gradient levels e.g. 256
function make_colormap(cols, levels) {

    var i, c, col;
    var gradient = [];
    var n = Math.ceil(levels / (cols.length - 1));
    var g = 0;
    for (i = 0; i < levels; i += 1) {
        g = (g + 1) % n;
        c = Math.floor(i / n);
        col = interpolate(cols[c], cols[c + 1], 1 / g);
        gradient.push([col.r, col.g, col.b]);
    }
    return gradient;

}
