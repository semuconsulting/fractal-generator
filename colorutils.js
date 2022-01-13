// ------------------------------------------------------------------------
// Utility library defining color rendering functions and
// cyclic colormaps for fractal generator.
//
// Copyright (c) 2021 Algol Variables
// ------------------------------------------------------------------------
"use strict";

// Linear interpolation between two RGB colors {r, g, b, a}.
//
// @param {object} col1 - first color
// @param {object} col2 - second color
// @param {number} ni - normalized iteration count
// @return {object} - interpolated color
//
function interpolate(col1, col2, ni) {
    var f = ni % 1; // fractional part of ni
    var r = Math.floor((col2.r - col1.r) * f + col1.r);
    var g = Math.floor((col2.g - col1.g) * f + col1.g);
    var b = Math.floor((col2.b - col1.b) * f + col1.b);
    return { r: r, g: g, b: b, a: 255 };
}

// Convert HSV values (in range 0-1) to RGB (in range 0-255).
//
// @param {number} h - hue as decimal
// @param {number} s - saturation as decimal
// @param {number} v - value as decimal
// @return {object} - RGB color object
//
function hsv2rgb(h, s, v) {

    var i, f, p, q, t;
    var a = 255;
    var col = { r: v, g: v, b: v, a: a };
    v = parseInt(v * 255);
    if (s === 0.0) {
        return col;
    }
    i = parseInt(h * 6.0);
    f = (h * 6.0) - i;
    p = parseInt(v * (1.0 - s));
    q = parseInt(v * (1.0 - s * f));
    t = parseInt(v * (1.0 - s * (1.0 - f)));
    switch (i %= 6) {
        case 0:
            col = { r: v, g: t, b: p, a: a };
            break;
        case 1:
            col = { r: q, g: v, b: p, a: a };
            break;
        case 2:
            col = { r: p, g: v, b: t, a: a };
            break;
        case 3:
            col = { r: p, g: q, b: v, a: a };
            break;
        case 4:
            col = { r: t, g: p, b: v, a: a };
            break;
        case 5:
            col = { r: v, g: p, b: q, a: a };
            break;
        default:
            col = { r: v, g: v, b: v, a: a };
    }
    return col;
}

// Get interpolated pixel color from RGB colormap.
//
// @param {object} ni - normalised bailout iteration count
// @param {object} colmap - colormap RGB array
// @param {number} shift - shift colormap along gradient
// @param {boolean} interp - interpolate colours true/false
// @param {number} radius - bailout radius
// @param {number} exponent - integer exponent
// @return {object} - RGB color object
//
function getColormap(ni, colmap, shift, interp) {

    try {
        var sh = Math.ceil(shift * (colmap.length) / 100); // gradient shift
        var col = colmap[(Math.floor(ni) + sh) % colmap.length];
        var col1 = { r: col[0], g: col[1], b: col[2], a: 255 };
        if (interp) {
            col = colmap[(Math.floor(ni) + sh + 1) % colmap.length];
            var col2 = { r: col[0], g: col[1], b: col[2], a: 255 };
            return interpolate(col1, col2, ni);
        }
        else {
            return col1;
        }
    }
    catch (err) {
        console.log("getColormap error:", ni, sh, ni + sh, scalars.i, scalars.za);
        return { r: 255, g: 255, b: 255, a: 255 };
    }
}

// Generate interpolated RGB colormap array from palette of key colors.
//
// @param {object} palette - palette of RGB colors [[r,g,b],[r,g,b],...]
// @param {number} levels - number of levels in colormap e.g. 256
// @param {number} shift - shift colormap index
// @return {object} - RGB color map [[r,g,b],[r,g,b],...]
//
function makeColormap(palette, levels, shift) {

    var i, cidx, col, col1, col2;
    var clen = palette.length;
    var f = clen / levels;
    var cmap = [];
    var fi = 0;
    if (clen >= levels) {
        return palette;
    }
    for (i = 0; i < levels; i += 1) {
        cidx = Math.floor(i / clen + shift);
        col = palette[cidx % clen];
        col1 = { r: col[0], g: col[1], b: col[2] }
        col = palette[(cidx + 1) % clen];
        col2 = { r: col[0], g: col[1], b: col[2] }
        col = interpolate(col1, col2, fi);
        cmap.push([col.r, col.g, col.b])
        fi = (fi + f) % 1;
    }
    return cmap;
}

// Convert integer to hex string.
//
// @param {number} val - integer value (max 255)
// @return {string} - hex string e.g. 'fa'
//
function valtoHex(val) {
    var hex = val.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// Convert hex color string to [r,g,b].
//
// @param {string} hex - hex color string e.g. #ff5523
// @return {object} - RGB array [r,g,b]
//
function HextoRGB(hex) {
    hex = hex.replace(/#/g, '');
    if (hex.length === 3) {
        hex = hex.split('').map(function (hex) {
            return hex + hex;
        }).join('');
    }
    // validate hex format
    var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
    if (result) {
        var red = parseInt(result[1], 16);
        var green = parseInt(result[2], 16);
        var blue = parseInt(result[3], 16);

        return [red, green, blue];
    } else {
        // invalid color
        return null;
    }
}

// Convert [r,g,b] value to hex color string.
//
// @param {number} r - red value
// @param {number} g - green value
// @param {number} b - blue value
// @return {string} - hex color string e.g. '#12fa45'
//
function RGBtoHex(r, g, b) {
    return "#" + valtoHex(r) + valtoHex(g) + valtoHex(b);
}

const COLORMAP_BB16 = [
    [66, 30, 15], [25, 7, 26], [9, 1, 47], [4, 4, 73],
    [0, 7, 100], [12, 44, 138], [24, 82, 177], [57, 125, 209],
    [134, 181, 229], [211, 236, 248], [241, 233, 191], [248, 201, 95],
    [255, 170, 0], [204, 128, 0], [153, 87, 0], [106, 52, 3]
];

const COLORMAP_TROP16 = [
    [3, 72, 0], [24, 111, 10], [51, 147, 22], [219, 188, 47],
    [240, 131, 42], [243, 61, 33], [217, 66, 40], [191, 71, 46],
    [134, 81, 80], [126, 78, 186], [125, 92, 254], [140, 155, 251],
    [162, 246, 245], [112, 225, 91], [100, 186, 44], [93, 12, 70]
]

const COLORMAP_CET16 = [
    [26, 99, 229], [97, 122, 230], [149, 156, 230], [191, 192, 229],
    [223, 213, 217], [231, 181, 168], [226, 136, 112], [213, 88, 59],
    [202, 48, 23], [213, 86, 57], [225, 134, 110], [231, 179, 165],
    [221, 210, 216], [186, 187, 229], [143, 151, 230], [88, 118, 230],
];

// Array of palettes used to generate colormaps (gradients)
var palettes = [COLORMAP_BB16, COLORMAP_TROP16, COLORMAP_CET16]

const COLORMAP_HSV256 = [
    [226, 56, 41],
    [237, 50, 35],
    [233, 52, 35],
    [234, 54, 37],
    [234, 55, 35],
    [236, 57, 37],
    [234, 60, 36],
    [236, 62, 37],
    [235, 66, 37],
    [235, 70, 38],
    [235, 76, 37],
    [236, 80, 40],
    [235, 84, 41],
    [235, 89, 42],
    [237, 93, 41],
    [236, 97, 42],
    [235, 102, 43],
    [237, 107, 45],
    [237, 112, 45],
    [238, 117, 46],
    [238, 122, 45],
    [239, 128, 47],
    [239, 132, 50],
    [239, 137, 52],
    [240, 142, 51],
    [240, 150, 54],
    [242, 154, 56],
    [242, 159, 57],
    [243, 165, 57],
    [241, 171, 59],
    [242, 175, 62],
    [243, 181, 62],
    [244, 186, 63],
    [245, 192, 64],
    [246, 197, 68],
    [245, 203, 67],
    [246, 209, 68],
    [247, 215, 72],
    [249, 219, 73],
    [250, 224, 75],
    [251, 230, 75],
    [252, 240, 78],
    [252, 244, 81],
    [251, 248, 81],
    [249, 251, 82],
    [248, 254, 84],
    [245, 254, 83],
    [238, 254, 83],
    [235, 254, 84],
    [230, 254, 82],
    [224, 254, 81],
    [220, 254, 80],
    [215, 253, 80],
    [211, 253, 81],
    [206, 254, 82],
    [205, 253, 81],
    [199, 253, 81],
    [195, 253, 80],
    [190, 252, 79],
    [186, 253, 78],
    [183, 253, 79],
    [178, 252, 77],
    [174, 252, 80],
    [170, 252, 79],
    [165, 251, 78],
    [162, 252, 77],
    [159, 251, 78],
    [154, 252, 77],
    [152, 252, 78],
    [148, 252, 77],
    [145, 252, 76],
    [142, 252, 77],
    [140, 252, 79],
    [138, 252, 78],
    [134, 253, 77],
    [130, 253, 77],
    [128, 251, 75],
    [127, 251, 77],
    [124, 251, 76],
    [123, 251, 76],
    [122, 250, 75],
    [120, 251, 77],
    [120, 251, 77],
    [119, 252, 75],
    [118, 251, 74],
    [118, 251, 76],
    [117, 251, 76],
    [117, 251, 78],
    [117, 251, 78],
    [117, 251, 78],
    [117, 251, 78],
    [115, 251, 79],
    [119, 252, 85],
    [118, 251, 84],
    [116, 251, 87],
    [116, 251, 87],
    [117, 251, 92],
    [117, 251, 94],
    [117, 250, 97],
    [117, 251, 102],
    [117, 250, 105],
    [118, 251, 108],
    [116, 251, 112],
    [116, 250, 115],
    [117, 250, 122],
    [116, 250, 125],
    [117, 251, 130],
    [118, 249, 133],
    [117, 251, 140],
    [118, 251, 144],
    [118, 250, 148],
    [117, 251, 154],
    [117, 252, 160],
    [117, 251, 166],
    [118, 251, 170],
    [116, 251, 174],
    [117, 251, 180],
    [117, 252, 186],
    [117, 251, 190],
    [118, 251, 196],
    [117, 251, 201],
    [118, 251, 204],
    [116, 251, 210],
    [117, 251, 218],
    [118, 251, 224],
    [117, 251, 226],
    [118, 251, 234],
    [116, 251, 237],
    [117, 251, 244],
    [117, 250, 247],
    [116, 250, 253],
    [115, 246, 255],
    [113, 239, 253],
    [108, 233, 253],
    [106, 228, 251],
    [101, 222, 251],
    [99, 215, 252],
    [98, 211, 251],
    [96, 204, 250],
    [92, 199, 251],
    [90, 195, 252],
    [85, 187, 251],
    [84, 183, 251],
    [80, 176, 252],
    [78, 171, 249],
    [76, 165, 249],
    [68, 155, 250],
    [67, 150, 246],
    [64, 143, 248],
    [60, 138, 247],
    [60, 132, 250],
    [55, 127, 247],
    [52, 120, 245],
    [50, 114, 246],
    [47, 109, 246],
    [45, 103, 246],
    [42, 98, 247],
    [38, 91, 245],
    [36, 86, 245],
    [32, 79, 245],
    [31, 75, 244],
    [27, 70, 245],
    [24, 64, 247],
    [23, 58, 246],
    [19, 53, 246],
    [15, 47, 244],
    [13, 39, 246],
    [10, 34, 246],
    [8, 28, 245],
    [7, 22, 247],
    [4, 18, 247],
    [3, 13, 248],
    [4, 11, 247],
    [6, 7, 247],
    [6, 2, 245],
    [8, 0, 244],
    [14, 0, 246],
    [19, 1, 247],
    [25, 0, 246],
    [30, 0, 246],
    [35, 1, 245],
    [44, 3, 247],
    [51, 3, 247],
    [54, 5, 245],
    [59, 6, 246],
    [65, 6, 246],
    [72, 8, 245],
    [75, 11, 247],
    [81, 11, 247],
    [86, 12, 247],
    [93, 14, 247],
    [97, 15, 247],
    [103, 18, 244],
    [109, 18, 246],
    [114, 19, 247],
    [118, 21, 248],
    [123, 23, 245],
    [129, 23, 247],
    [135, 25, 244],
    [142, 26, 249],
    [147, 27, 246],
    [152, 28, 246],
    [157, 31, 245],
    [164, 31, 246],
    [167, 32, 246],
    [173, 34, 247],
    [178, 36, 246],
    [184, 37, 247],
    [190, 38, 247],
    [193, 40, 245],
    [200, 41, 247],
    [204, 43, 245],
    [211, 44, 246],
    [216, 45, 247],
    [219, 47, 245],
    [227, 49, 245],
    [229, 49, 244],
    [232, 49, 238],
    [233, 51, 232],
    [234, 51, 231],
    [234, 50, 224],
    [234, 51, 219],
    [233, 51, 213],
    [234, 50, 208],
    [234, 51, 203],
    [234, 50, 196],
    [236, 50, 193],
    [235, 50, 187],
    [234, 50, 180],
    [235, 51, 175],
    [234, 51, 169],
    [233, 50, 164],
    [234, 51, 159],
    [235, 50, 151],
    [235, 51, 149],
    [234, 51, 143],
    [236, 49, 136],
    [236, 50, 133],
    [235, 50, 126],
    [235, 51, 121],
    [234, 51, 117],
    [234, 50, 110],
    [234, 51, 105],
    [237, 49, 100],
    [234, 51, 95],
    [235, 50, 91],
    [234, 51, 82],
    [235, 51, 79],
    [237, 49, 73],
    [236, 51, 67],
    [235, 51, 63],
    [235, 51, 59],
    [234, 51, 55],
    [235, 51, 51],
    [234, 51, 47],
    [235, 50, 45],

];