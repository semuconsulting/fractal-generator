// ------------------------------------------------------------------------
// Defines ColorRGB object, color manipulation functions and
// cyclic colormaps for fractal generator.
//
// Does not use an RGB color class as instantiating new class instances
// represents a significant overhead in the iterative fractal computation.
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
    var r = (col2.r - col1.r) * f + col1.r;
    var g = (col2.g - col1.g) * f + col1.g;
    var b = (col2.b - col1.b) * f + col1.b;
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

const COLORMAP_BB16 = [
    [66, 30, 15], [25, 7, 26], [9, 1, 47], [4, 4, 73],
    [0, 7, 100], [12, 44, 138], [24, 82, 177], [57, 125, 209],
    [134, 181, 229], [211, 236, 248], [241, 233, 191], [248, 201, 95],
    [255, 170, 0], [204, 128, 0], [153, 87, 0], [106, 52, 3]
];

const COLORMAP_TROP256 = [
    [9, 41, 4], [9, 42, 3], [9, 44, 4], [8, 45, 4],
    [8, 47, 3], [8, 48, 3], [7, 50, 3], [7, 51, 3],
    [7, 52, 3], [7, 54, 3], [7, 55, 3], [6, 56, 2],
    [6, 58, 3], [6, 59, 2], [5, 61, 2], [5, 63, 2],
    [4, 66, 2], [4, 68, 1], [3, 71, 1], [3, 74, 0],
    [2, 76, 1], [2, 79, 0], [4, 81, 1], [5, 84, 1],
    [7, 86, 2], [9, 89, 3], [10, 91, 4], [12, 94, 5],
    [14, 96, 6], [16, 99, 6], [17, 101, 7], [19, 103, 8],
    [21, 106, 8], [23, 109, 10], [25, 111, 10], [26, 113, 11],
    [28, 116, 12], [30, 118, 13], [31, 121, 14], [33, 123, 14],
    [35, 126, 15], [37, 128, 16], [38, 130, 16], [40, 133, 17],
    [42, 135, 18], [44, 138, 19], [45, 140, 20], [47, 143, 21],
    [49, 145, 21], [51, 147, 22], [60, 149, 23], [70, 152, 25],
    [79, 154, 26], [88, 156, 27], [97, 158, 29], [106, 160, 30],
    [115, 163, 31], [124, 165, 33], [133, 167, 34], [142, 169, 35],
    [151, 171, 37], [159, 173, 38], [168, 175, 39], [177, 177, 40],
    [185, 179, 42], [194, 181, 43], [202, 183, 44], [211, 185, 45],
    [219, 187, 47], [228, 189, 48], [236, 192, 49], [236, 187, 49],
    [236, 182, 48], [236, 177, 48], [237, 173, 47], [237, 168, 46],
    [238, 164, 46], [237, 159, 45], [238, 155, 45], [238, 150, 44],
    [238, 145, 44], [239, 141, 43], [239, 136, 43], [239, 132, 42],
    [240, 127, 41], [240, 122, 41], [240, 118, 41], [240, 113, 40],
    [241, 108, 40], [241, 104, 39], [241, 99, 38], [241, 94, 38],
    [242, 90, 37], [242, 85, 37], [242, 81, 36], [242, 76, 35],
    [243, 72, 35], [243, 67, 35], [243, 62, 34], [242, 61, 34],
    [240, 62, 35], [239, 62, 35], [237, 62, 35], [235, 63, 36],
    [234, 63, 36], [232, 63, 36], [230, 63, 37], [228, 64, 37],
    [226, 64, 38], [225, 65, 38], [223, 65, 39], [222, 65, 39],
    [220, 65, 40], [218, 66, 40], [216, 66, 40], [214, 67, 41],
    [213, 67, 41], [211, 67, 41], [209, 67, 42], [208, 68, 42],
    [206, 68, 43], [204, 68, 44], [203, 69, 44], [201, 69, 44],
    [199, 69, 44], [197, 70, 45], [195, 70, 46], [194, 70, 46],
    [193, 71, 46], [191, 71, 47], [189, 72, 47], [184, 72, 49],
    [179, 73, 49], [175, 74, 50], [170, 75, 52], [165, 76, 53],
    [161, 77, 54], [156, 77, 55], [151, 78, 56], [146, 79, 58],
    [141, 80, 59], [137, 81, 60], [135, 81, 65], [134, 81, 72],
    [134, 81, 79], [133, 81, 86], [133, 80, 93], [132, 80, 100],
    [132, 80, 106], [131, 80, 114], [131, 80, 120], [130, 79, 127],
    [130, 79, 134], [129, 79, 141], [128, 79, 148], [128, 78, 155],
    [128, 79, 161], [127, 78, 169], [126, 78, 175], [126, 78, 182],
    [126, 78, 189], [125, 77, 196], [125, 77, 203], [124, 77, 210],
    [124, 77, 217], [123, 76, 223], [122, 76, 230], [122, 76, 237],
    [121, 76, 244], [121, 76, 251], [121, 77, 255], [122, 80, 255],
    [122, 83, 254], [123, 87, 254], [124, 90, 254], [125, 94, 254],
    [126, 97, 254], [127, 100, 253], [127, 103, 253], [128, 107, 253],
    [129, 110, 253], [130, 113, 253], [130, 117, 253], [131, 120, 252],
    [132, 123, 252], [133, 127, 252], [134, 130, 251], [134, 133, 252],
    [136, 136, 251], [136, 140, 251], [137, 143, 251], [138, 147, 251],
    [138, 150, 250], [140, 153, 250], [140, 156, 250], [141, 160, 250],
    [142, 163, 249], [143, 167, 250], [145, 174, 249], [146, 181, 249],
    [148, 187, 248], [149, 194, 248], [151, 201, 248], [152, 207, 247],
    [154, 214, 247], [156, 220, 247], [157, 227, 246], [159, 233, 246],
    [161, 240, 245], [162, 247, 245], [164, 253, 244], [162, 254, 238],
    [159, 252, 229], [156, 250, 221], [153, 249, 213], [151, 247, 204],
    [147, 246, 196], [144, 244, 187], [141, 243, 179], [138, 241, 170],
    [136, 239, 162], [131, 237, 148], [125, 233, 130], [118, 229, 111],
    [112, 226, 92], [105, 222, 74], [104, 221, 71], [104, 220, 69],
    [104, 218, 68], [104, 215, 66], [103, 213, 65], [103, 211, 63],
    [103, 209, 61], [102, 206, 59], [102, 203, 57], [102, 200, 54],
    [101, 197, 52], [101, 193, 50], [100, 191, 48], [100, 187, 45],
    [100, 184, 42], [99, 180, 40], [99, 177, 37], [98, 173, 34],
    [98, 170, 31], [97, 166, 29], [97, 162, 26], [96, 158, 23],
    [96, 154, 20], [95, 150, 17], [95, 146, 14], [95, 142, 11],
    [94, 138, 8], [93, 134, 5], [93, 130, 2], [93, 129, 2]
];

const COLORMAP_CET4S = [
    [26, 99, 229], [28, 100, 229], [32, 100, 229], [36, 101, 229],
    [41, 102, 229], [46, 103, 229], [51, 104, 229], [56, 106, 229],
    [61, 107, 229], [66, 109, 229], [71, 111, 229], [75, 113, 229],
    [80, 114, 229], [84, 116, 230], [89, 118, 230], [93, 120, 230],
    [97, 122, 230], [101, 124, 230], [104, 126, 230], [108, 128, 230],
    [112, 131, 230], [115, 133, 230], [118, 135, 230], [122, 137, 230],
    [125, 139, 230], [128, 141, 230], [131, 143, 230], [134, 145, 230],
    [137, 147, 230], [140, 150, 230], [143, 152, 230], [146, 154, 230],
    [149, 156, 230], [152, 158, 230], [155, 161, 230], [157, 163, 229],
    [160, 165, 229], [163, 167, 229], [166, 169, 229], [168, 172, 229],
    [171, 174, 229], [173, 176, 229], [176, 178, 229], [179, 181, 229],
    [181, 183, 229], [184, 185, 229], [186, 187, 229], [189, 190, 229],
    [191, 192, 229], [193, 194, 228], [196, 196, 228], [198, 198, 228],
    [201, 200, 228], [203, 202, 228], [205, 204, 227], [207, 206, 227],
    [209, 208, 226], [211, 209, 226], [213, 211, 225], [215, 212, 224],
    [217, 213, 223], [219, 213, 222], [220, 214, 220], [222, 214, 219],
    [223, 213, 217], [224, 213, 215], [225, 212, 212], [226, 211, 210],
    [227, 210, 207], [228, 208, 205], [228, 206, 202], [229, 204, 199],
    [230, 202, 196], [230, 200, 192], [230, 197, 189], [230, 195, 186],
    [231, 192, 182], [231, 190, 179], [231, 187, 175], [231, 184, 172],
    [231, 181, 168], [231, 179, 164], [231, 176, 161], [230, 173, 157],
    [230, 170, 154], [230, 167, 150], [230, 165, 147], [230, 162, 143],
    [229, 159, 140], [229, 156, 136], [229, 153, 133], [228, 150, 129],
    [228, 148, 126], [227, 145, 122], [227, 142, 119], [226, 139, 116],
    [226, 136, 112], [225, 133, 109], [225, 130, 105], [224, 127, 102],
    [223, 124, 99], [223, 122, 95], [222, 119, 92], [221, 116, 89],
    [220, 113, 85], [220, 110, 82], [219, 107, 79], [218, 104, 76],
    [217, 101, 72], [216, 97, 69], [215, 94, 66], [214, 91, 62],
    [213, 88, 59], [212, 85, 56], [211, 82, 53], [210, 79, 50],
    [209, 75, 47], [208, 72, 44], [208, 69, 41], [207, 66, 38],
    [206, 63, 35], [205, 60, 33], [204, 57, 30], [203, 55, 28],
    [203, 53, 26], [202, 51, 25], [202, 50, 24], [202, 49, 23],
    [202, 48, 23], [202, 48, 23], [202, 49, 23], [202, 50, 24],
    [202, 52, 25], [203, 53, 27], [204, 56, 29], [204, 58, 31],
    [205, 61, 33], [206, 64, 36], [207, 67, 39], [208, 70, 41],
    [209, 73, 44], [210, 76, 47], [211, 79, 51], [212, 83, 54],
    [213, 86, 57], [214, 89, 60], [215, 92, 63], [215, 95, 67],
    [216, 98, 70], [217, 101, 73], [218, 104, 76], [219, 107, 80],
    [220, 110, 83], [221, 113, 86], [221, 116, 90], [222, 119, 93],
    [223, 122, 96], [223, 125, 100], [224, 128, 103], [225, 131, 106],
    [225, 134, 110], [226, 137, 113], [226, 140, 117], [227, 143, 120],
    [227, 145, 123], [228, 148, 127], [228, 151, 130], [229, 154, 134],
    [229, 157, 137], [229, 160, 141], [230, 163, 144], [230, 165, 148],
    [230, 168, 151], [230, 171, 155], [231, 174, 158], [231, 177, 162],
    [231, 179, 165], [231, 182, 169], [231, 185, 173], [231, 188, 176],
    [230, 190, 180], [230, 193, 183], [230, 195, 187], [230, 198, 190],
    [229, 200, 193], [228, 202, 197], [228, 204, 200], [227, 205, 203],
    [226, 207, 206], [225, 208, 208], [224, 209, 211], [222, 210, 213],
    [221, 210, 216], [219, 210, 218], [217, 210, 219], [215, 209, 221],
    [213, 208, 222], [211, 207, 224], [209, 206, 225], [207, 205, 225],
    [205, 203, 226], [203, 201, 227], [200, 199, 227], [198, 197, 228],
    [195, 195, 228], [193, 193, 228], [191, 191, 228], [188, 189, 229],
    [186, 187, 229], [183, 185, 229], [181, 182, 229], [178, 180, 229],
    [175, 178, 229], [173, 176, 229], [170, 173, 229], [168, 171, 229],
    [165, 169, 229], [162, 167, 229], [160, 164, 229], [157, 162, 230],
    [154, 160, 230], [151, 158, 230], [148, 156, 230], [146, 154, 230],
    [143, 151, 230], [140, 149, 230], [137, 147, 230], [134, 145, 230],
    [131, 143, 230], [127, 141, 230], [124, 138, 230], [121, 136, 230],
    [118, 134, 230], [114, 132, 230], [111, 130, 230], [107, 128, 230],
    [104, 126, 230], [100, 124, 230], [96, 122, 230], [92, 120, 230],
    [88, 118, 230], [83, 116, 230], [79, 114, 229], [74, 112, 229],
    [70, 110, 229], [65, 109, 229], [60, 107, 229], [55, 106, 229],
    [50, 104, 229], [45, 103, 229], [40, 102, 229], [35, 101, 229],
    [31, 100, 229], [28, 100, 229], [25, 99, 229], [25, 99, 229]
];

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