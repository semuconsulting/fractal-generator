// ------------------------------------------------------------------------
// Interactive fractal generation using JavaScript and the 
// HTML5 Canvas element.
//
// Uses Complex object type from complexlite.js
// and fractal rendering routins from fractals.js.
//
// Copyright (c) 2021 Algol Variables
//
// BSD 3-Clause License
// ------------------------------------------------------------------------
"use strict";

const ASPECT_RATIO = 1.5; // aspect ratio 4:3
const CANVAS_INSET = 0.8; // image inset relative to document

// Main interactive fractal routine
function start() {

    const SETMODES = [
        "Mandelbrot",
        "Julia",
    ]
    const SETVARS = [
        "Standard",
        "Burning Ship",
        "Tricorn",
    ]
    const THEMES = [ // Remember to update if you add more themes
        "Blue/Brown Cyclic 16",
        "Tropical Cyclic 256",
        "CET4s Cyclic 256",
        "Rainbow Cyclic 256",
        "Basic Hue",
        "Normalized Hue",
        "Sqrt Maxiter Hue",
        "Sin Sqrt Maxiter Hue",
        "Banded RGB",
        "Grayscale",
    ];
    const BUTTONS = ["btnReset", "btnZoomIn", "btnZoomOut", "btnZoomAnimate", "btnMode", "btnVariant",
        "btnColor", "btnColorUp", "btnColorDown", "btnJuliaUp", "btnJuliaDown", "btnJuliaSpin",
        "btnExponent", "btnApply", "btnSettings", "btnSave", "btnHelp"];

    // Create and size canvas relative to window size.
    var canvasdiv = document.getElementById("canvas");
    var canvas = document.createElement('canvas');
    canvas.id = "fractal";
    var size = getSize();
    canvas.width = size.width;
    canvas.height = size.height;
    canvasdiv.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var imagew = canvas.width; // Pixels
    var imageh = canvas.height; // Pixels
    var imagedata = ctx.createImageData(imagew, imageh);
    var setmode; // Fractal set type (Mandelbrot/Julia)
    var setvar; // Fractal set variation (Standard/BurningShip/Tricorn)
    var pinit = new Complex(0, 0); // Mouse click complex coordinate
    var jpos = new Complex(0, 0); // Constant Complex coordinate for Julia sets
    var zoffpos = new Complex(-0.5, 0); // Offset (pan) complex coordinate
    var zoom;
    var maxiter;
    var exponent = 2;
    var radius = 1 << 8; // Bailout radius
    var autoiter = true; // Set to false to retain fixed value for maxiter
    var theme; // Color theme
    var shift; // Color theme shift 0-100
    var zoomarea = { x: 0, y: 0, w: 1, h: 1 } // Zooming area
    var zoomdraw = false;
    var zoominc = 1.5; // zoom in/out increment
    var duration = 0;
    var spinning = false;
    var zooming = false;
    var angle = 0; // Current Julia rotation angle
    var spininc = 1; // Julia rotate/spin increment in degrees
    var swapaxes = false;

    // Initialize the interactive canvas.
    function init() {

        // Add mouse events
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);

        // Add button event handlers
        for (let i in BUTTONS) {
            document.getElementById(BUTTONS[i]).addEventListener("click", onButtonClick);
        }

        // Populate select inputs
        selectPopulate("modeset", SETMODES);
        selectPopulate("variantset", SETVARS);
        selectPopulate("themeset", THEMES);

        // Reset initial settings
        reset();
        // Generate image
        generateImage(imagew, imageh);
        // Enter main loop
        main(0);
    }

    // Main loop.
    function main(tframe) {

        // Request animation frames
        window.requestAnimationFrame(main);

        // Draw the generated image
        ctx.putImageData(imagedata, 0, 0);

        // Draw zooming area during mouse drag operation
        doZoomDraw();

        // If in Zooming animation mode
        doZooming();

        // If in Spinning Julia animation mode
        doSpinning();

    }

    // Get size of canvas relative to document window, while maintaining constant aspect ratio.
    // NB: does not automaticallty resize on window resize - document would have to be reloaded.
    function getSize() {
        var width, height;
        var w = window.innerWidth;
        var h = window.innerHeight;
        if (w >= h) {
            height = Math.floor(h * CANVAS_INSET);
            width = Math.floor(height * ASPECT_RATIO);
        }
        else {
            width = Math.floor(w * CANVAS_INSET);
            height = Math.floor(width / ASPECT_RATIO);
        }
        return { width, height };
    }

    // Reset to default settings.
    function reset() {
        zoffpos.set(-0.5, 0);
        jpos.set(0, 0);
        zoom = 0.75;
        maxiter = MINITERM;
        zoominc = 1.5;
        radius = 1 << 8;
        exponent = 2;
        theme = 0;
        shift = 0;
        setmode = 0;
        setvar = 0;
        autoiter = true;
        spinning = false;
        zooming = false;
        spininc = 1;
        swapaxes = false;
        angle = 0;
        updateInfo();
    }

    // Generate the fractal image.
    function generateImage(width, height) {
        duration = Date.now();
        var x, y, cpos, scalars, color;
        var radius2 = radius ** 2; // Square here to save a step inside the iteration 
        // Calculate number of iterations based on zoom level
        maxiter = autoiter ? getAutoiter(zoom, setmode) : maxiter;
        for (x = 0; x < width; x += 1) {
            for (y = 0; y < height; y += 1) {
                // Convert pixel coordinate to complex plane coordinate
                cpos = ptoc(width, height, x, y, zoffpos, zoom, swapaxes);
                // Calculate fractal escape scalars
                scalars = fractal(cpos, jpos, exponent, maxiter, radius2, setmode, setvar);
                // Pass escape scalars to pixel coloring algorithm
                color = getColor(scalars, maxiter, theme, shift);
                // Plot pixel in imagemap
                plot(x, y, color, width);
            }
        }
        duration = Date.now() - duration;
        inProgress(false);
        updateInfo();
    }

    // Get pixel color for given escape scalars and color theme.
    function getColor(scalars, maxiter, theme, shift) {

        var color, h, steps, bands;
        var i = scalars.i;
        if (i == maxiter) {
            return { r: 0, g: 0, b: 0 }; // Black
        }
        switch (theme) {
            case 1: // Tropical 256-level cyclic colormap
                color = getColormap(scalars, COLORMAP_TROP256, shift);
                break;
            case 2: // Cet4s 256-level cyclic colormap
                color = getColormap(scalars, COLORMAP_CET4S, shift);
                break;
            case 3: // Rainbow HSV 256-level cyclic colormap
                color = getColormap(scalars, COLORMAP_HSV256, shift);
                break;
            case 4: // Basic hue
                h = ((i / maxiter) + (shift / 100)) % 1;
                color = hsv2rgb(h, 0.75, 1);
                break;
            case 5: // Normalized hue (smoother color gradation than basic)
                h = ((normalize(scalars, radius, exponent) / maxiter) + (shift / 100)) % 1;
                color = hsv2rgb(h, 0.75, 1);
                break;
            case 6: // Sqrt hue
                h = ((normalize(scalars, radius, exponent) / Math.sqrt(maxiter)) + (shift / 100)) % 1;
                color = hsv2rgb(h, 0.75, 1);
                break;
            case 7: // Sin sqrt hue
                steps = 1 + shift / 100;
                h = 1 - (Math.sin((normalize(scalars, radius, exponent) / Math.sqrt(maxiter) * steps) + 1) / 2);
                color = hsv2rgb(h, 0.75, 1);
                break;
            case 8: // Banded rgb
                bands = [0, 32, 96, 192]; // Arbitrary - amend as desired
                color = { r: bands[(i / 4) % 4], g: bands[i % 4], b: bands[(i / 16) % 4] };
                break;
            case 9: // Grayscale
                h = ((256 * i / maxiter) + shift) % 255;
                color = { r: h, g: h, b: h };
                break;
            default: // Blue brown 16-level cyclic colormap
                color = getColormap(scalars, COLORMAP_BB16, shift);
                break;
        }

        return color;

    }

    // Get pixel color from RGB colormap.
    function getColormap(scalars, colmap, shift = 0) {

        try {
            var ni = normalize(scalars, radius, exponent); // normalised iteration count
            var sh = Math.ceil(shift * (colmap.length) / 100); // palette shift
            var col1 = colmap[(Math.floor(ni) + sh) % colmap.length];
            var col2 = colmap[(Math.floor(ni) + sh + 1) % colmap.length];
            return interpolate(col1, col2, ni);
        }
        catch (err) {
            console.log("getColormap error:", ni, sh, ni + sh, scalars.i, scalars.za);
            return { r: 255, g: 255, b: 255 };
        }
    }

    // Plot the pixel color in the imagedata.
    function plot(x, y, color, width) {
        var pixelindex = (y * width + x) << 2; // * 4
        imagedata.data[pixelindex] = color.r;
        imagedata.data[pixelindex + 1] = color.g;
        imagedata.data[pixelindex + 2] = color.b;
        imagedata.data[pixelindex + 3] = 255;
    }

    // Mouse down handler.
    function onMouseDown(e) {
        var mpos = getMousePos(canvas, e);
        var xm = mpos.x;
        var ym = mpos.y;
        var regen = true;
        pinit = ptoc(imagew, imageh, xm, ym, zoffpos, zoom);
        inProgress(true);
        zooming = false;

        if (e.altKey) { // toggle between Julia and Mandelbrot
            if (setmode === MANDELBROT) {
                setmode = JULIA;
                jpos = pinit;
                zoffpos.set(0, 0);
            } else {
                setmode = MANDELBROT;
                zoffpos.set(-0.5, 0);
            }
        }
        else if (e.shiftKey) { // Centre image at mouse position
            zoffpos = pinit;
        }
        else if (e.ctrlKey) { // Zoom out at mouse position by zoom increment
            zoffpos = pinit;
            zoom /= zoominc;
        }
        else { // Beginning of zoom in action
            zoomarea.x = mpos.x;
            zoomarea.y = mpos.y;
            zoomarea.w = 0;
            zoomarea.h = 0;
            zoomdraw = true;
            regen = false;
        }

        if (regen) {
            // Generate a new image
            generateImage(imagew, imageh);

            // Update information panel
            updateInfo();
        }
    }

    // Mouse move handler.
    function onMouseMove(e) {
        var mpos = getMousePos(canvas, e);
        // Redraw zoom area
        zoomarea.w = Math.abs(mpos.x - zoomarea.x);
        zoomarea.h = Math.abs(mpos.y - zoomarea.y);
    }

    // Mouse up handler.
    function onMouseUp(e) {
        if (zoomdraw) {
            // Zoom in based on drawn zoom area
            // Image aspect ratio is fixed by canvas size, so drawn zoom area
            // is purely used to derive zoom factor and does not necessarily
            // represent the extent of the zoomed image
            var zoomf, zx, zy;
            var mpos = getMousePos(canvas, e);
            zoomarea.w = Math.abs(mpos.x - zoomarea.x);
            zoomarea.h = Math.abs(mpos.y - zoomarea.y);
            zx = zoomarea.x + zoomarea.w / 2;
            zy = zoomarea.y + zoomarea.h / 2;
            if (zoomarea.w > 2 && zoomarea.h > 2) { // Calculate most appropriate zoom factor
                zoomf = (zoomarea.w > zoomarea.h ? imagew / zoomarea.w : imageh / zoomarea.h);
            }
            else { // No drag; zoom using predefined zoom factor
                zoomf = zoominc;
            }

            zoffpos = ptoc(imagew, imageh, zx, zy, zoffpos, zoom)
            zoom *= zoomf;

            // Generate a new image
            generateImage(imagew, imageh);

            // Update information panel
            updateInfo();
        }
        zoomdraw = false;
    }

    // Get the mouse position.
    function getMousePos(canv, e) {
        var rect = canv.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canv.width),
            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canv.height)
        };
    }

    // Button click handlers.
    function onButtonClick(e) {
        inProgress(true);
        var btn = document.getElementById(e.target.id);
        switch (e.target.id) {
            case "btnZoomOut": // zoom out
                zoom /= zoominc;
                break;
            case "btnZoomIn": // zoom in
                zoom *= zoominc;
                break;
            case "btnZoomAnimate": // zoom animation
                zooming = !zooming;
                if (zooming) {
                    btn.style.backgroundColor = "darkseagreen";
                } else {
                    btn.style.backgroundColor = "white";
                }
                break;
            case "btnReset": // r = reset to defaults
                reset();
                break;
            case "btnMode": // t = cycle through modes
                setmode = (setmode + 1) % SETMODES.length;
                if (setmode === MANDELBROT) {
                    zoffpos.set(-0.5, 0);
                    jpos.set(0, 0)
                } else {
                    zoffpos.set(0, 0);
                    jpos = pinit; // pinit set via prior mouse click
                }
                break;
            case "btnVariant": // v = cycle through set variants
                setvar = (setvar + 1) % SETVARS.length;
                break;
            case "btnColor": // c = cycle through color themes
                theme = (theme + 1) % THEMES.length;
                break;
            case "btnExponent": // e = cycle exponent (limited to 6)
                exponent = exponent > 6 ? 2 : exponent += 1;
                break;
            case "btnColorUp": // up arrow = shift color theme up
                shift = (shift - 5) % 100;
                break;
            case "btnColorDown": // down arrow = shift color theme down
                shift = (shift + 5) % 100;
                if (shift < 0) {
                    shift = 100 + shift;
                }
                break;
            case "btnJuliaDown": // left arrow = rotate Julia left
                var a = spininc * Math.PI / 180;
                jpos = jpos.rotate(a);
                angle = (angle + a) % (2 * Math.PI);
                break;
            case "btnJuliaUp": // right arrow = rotate Julia right
                var a = -spininc * Math.PI / 180;
                jpos = jpos.rotate(a);
                angle = (angle + a) % (2 * Math.PI);
                break;
            case "btnJuliaSpin": // toggle automated Julia spin
                spinning = !spinning;
                if (spinning && setmode === JULIA) {
                    btn.style.backgroundColor = "darkseagreen";
                } else {
                    btn.style.backgroundColor = "white";
                }
                break;
            case "btnSettings": { // show settings panel
                settings.style.display = settings.style.display === "block" ? "none" : "block";
                if (settings.style.display === "block") {
                    btn.style.backgroundColor = "lightblue";
                } else {
                    btn.style.backgroundColor = "white";
                }
                break;
            }
            case "btnHelp": { // show help panel
                help.style.display = help.style.display === "block" ? "none" : "block";
                if (help.style.display === "block") {
                    btn.style.backgroundColor = "lightblue";
                } else {
                    btn.style.backgroundColor = "white";
                }
                break;
            }
            case "btnApply": // apply manual settings
                doValidateSettings();
                break;
            case "btnSave": {
                doSave();
                break;
            }
        }

        // Generate a new image
        generateImage(imagew, imageh);

        // Update information panel
        updateInfo();

    }

    // Plot image using manual settings.
    function doValidateSettings() {
        var inzoffre = parseFloat(document.getElementById("zoffre").value);
        var inzoffim = parseFloat(document.getElementById("zoffim").value);
        var injre = parseFloat(document.getElementById("jre").value);
        var injim = parseFloat(document.getElementById("jim").value);
        var expset = parseInt(document.getElementById("expset").value);
        var maxiset = parseInt(document.getElementById("maxiset").value);
        autoiter = document.getElementById("autoiter").checked;
        var zoomset = parseFloat(document.getElementById("zoomset").value);
        var zoomincset = parseFloat(document.getElementById("zoomincset").value);
        var rotateset = parseFloat(document.getElementById("rotateset").value);
        var spinincset = parseFloat(document.getElementById("spinincset").value);
        var shiftset = document.getElementById("shiftset").value;
        setmode = document.getElementById("modeset").selectedIndex;
        setvar = document.getElementById("variantset").selectedIndex;
        theme = document.getElementById("themeset").selectedIndex;
        swapaxes = document.getElementById("swapaxes").checked;

        if (!isNaN(inzoffre) && !isNaN(inzoffim)) {
            zoffpos.set(inzoffre, inzoffim);
        }
        if (!isNaN(injre) && !isNaN(injim)) {
            jpos.set(injre, injim);
        }
        if (!isNaN(expset)) {
            exponent = expset;
        }
        if (!isNaN(maxiset)) {
            maxiter = maxiset;
        }
        if (!isNaN(zoomset)) {
            zoom = zoomset;
        }
        if (!isNaN(zoomincset)) {
            zoominc = zoomincset;
        }
        if (!isNaN(rotateset)) {
            angle = rotateset & (2 * Math.PI);
            jpos = jpos.rotate(angle);
        }
        if (!isNaN(spinincset)) {
            spininc = spinincset;
        }
        if (!isNaN(shiftset)) {
            shift = shiftset;
        }
    }

    // Save image as png file.
    function doSave() {
        var image = canvas.toDataURL(); // get canvas data
        var tmpLink = document.createElement('a'); // create temporary link
        tmpLink.download = "image-" + Date.now() + ".png"; // set the name of the download file
        tmpLink.href = image;
        document.body.appendChild(tmpLink); // temporarily add link to body and initiate the download
        tmpLink.click();
        document.body.removeChild(tmpLink);
    }

    // Change cursor to indicate in progress.
    function inProgress(inprog) {
        if (inprog ? canvas.style.cursor = 'progress' : canvas.style.cursor = 'crosshair');
    }

    // Update information panel.
    function updateInfo() {
        elementSet("zoffpos", "z offset: " + zoffpos.toString(6));
        elementSet("jpos", "c Julia: " + jpos.toString(6));
        elementSet("zoom", "Zoom: " + zoom.toExponential(3));
        elementSet("exponent", "Exp: " + exponent);
        elementSet("theme", THEMES[theme] + "+" + shift);
        elementSet("setmode", SETMODES[setmode]);
        elementSet("setvar", SETVARS[setvar]);
        elementSet("duration", duration + "ms");
        elementSet("size", size.width + "x" + size.height);
        // Update settings panel if it's visible
        if (document.getElementById("settings").offsetParent !== null) {
            elementSet("zoffre", zoffpos.re);
            elementSet("zoffim", zoffpos.im);
            elementSet("jre", jpos.re);
            elementSet("jim", jpos.im);
            elementSet("modeset", setmode);
            elementSet("variantset", setvar);
            elementSet("expset", exponent);
            elementSet("maxiset", maxiter);
            elementSet("autoiter", autoiter);
            elementSet("zoomset", zoom);
            elementSet("zoomincset", zoominc);
            elementSet("rotateset", angle);
            elementSet("spinincset", spininc);
            elementSet("themeset", theme);
            elementSet("shiftset", shift);
            elementSet("swapaxes", swapaxes);
        }
    }

    // Helper function to populate select input.
    function selectPopulate(id, options) {
        var i, opt;
        var sel = document.getElementById(id);
        for (i = 0; i < options.length; i += 1) {
            opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = options[i];
            sel.appendChild(opt);
        }
    }

    // Helper function to set element value.
    function elementSet(id, value) {
        var sel = document.getElementById(id);
        switch (sel.nodeName) {
            case "SPAN": // span element
                sel.innerHTML = value;
                break;
            case "SELECT": // select element
                sel.selectedIndex = value;
                break;
            default: // input element
                if (sel.type === "checkbox") {
                    sel.checked = value;
                }
                else {
                    sel.value = value;
                }
                break;
        }
    }

    // Draw zoom area rectangle.
    function doZoomDraw() {
        if (zoomdraw) {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "yellow";
            ctx.rect(zoomarea.x, zoomarea.y, zoomarea.w, zoomarea.h);
            ctx.stroke();
        }
    }

    // Animate zooming in.
    // zoominc determines the speed of zooming.
    // Zoom limited to 1e15 due to pixelation.
    // CHALLENGE: Can you improve the maximum zoom level?
    function doZooming() {
        if (zooming) {
            if (zoom < 1e15) {
                zoom *= zoominc;
            }
            else { zooming = false }
            generateImage(imagew, imageh);
        }
    }

    // Animate spinning Julia set.
    // spininc determines the speed of rotation.
    function doSpinning() {
        if (spinning && setmode === JULIA) {
            var a = spininc / 100;
            jpos = jpos.rotate(a);
            angle = (angle + a) % (2 * Math.PI);
            generateImage(imagew, imageh);
        }
    }

    // Call init to start the interactive canvas.
    init();
}
