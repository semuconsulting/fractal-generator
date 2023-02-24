# Fractal Generator

Just a bit of fun...

A JavaScript implementation of an interactive fractal generator.  It supports both Mandelbrot and Julia modes and 'Standard', 'Burning Ship' and 'Tricorn' variants using a variety of color rendering themes, including user-generated colour palettes and gradients.

The application also supports basic 'Deep Zoom' and 'Julia Spin' animation.

Fractal can be configured via a set of 'quick-set' buttons, or more comprehensively via a manual configuration form which allows specific coordinates to be entered in complex (real/imaginary) notation. 

![full app screenshot ubx](/images/screenshot.png)![full app screenshot ubx](/images/screenshot_open.png)

## How to Use

The instructions can be viewed by clicking on the ![btnHelp](/resources/btnHelp.png) button:

- Click anywhere in the image to zoom in current cursor position by the zoom increment amount..
- Click, drag and release to zoom into drawn area.
- Ctrl + Click to zoom out at current cursor position by zoom increment amount.
- Shift + Click to centre at current cursor position.
- Alt(Option) + Click to toggle between Mandelbrot and Julia modes at current cursor position (useful points of interest can be found just outside the perimeter of the Mandelbrot set).
- Press ![btnreset](/resources/btnReset.png) to reset to default settings.
- Press ![btnZoomIn](/resources/btnZoomIn.png) to zoom in at current coordinates.
- Press ![btnZoomOut](/resources/btnZoomOut.png) to zoom out at current coordinates.
- Press ![btnZoomAnimate](/resources/btnZoomAnimate.png) to turn zoom animation on or off. A series of frames will be automatically generated, centered at the current coordinates with the zoom level incremented by the 'zoom increment' amount.
- Press ![btnMode](/resources/btnMode.png) to cycle through modes (Mandelbrot / Julia).
- Press ![btnVariant](/resources/btnVariant.png) to cycle through variants (Standard / Burning Ship / Tricorn).  
- Press ![btnExponent](/resources/btnExponent.png) to cycle exponent (2 - 6).
- Press ![btnColor](/resources/btnColor.png) to cycle through color themes.
- Press ![btnColorUp](/resources/btnColorUp.png)/![btnColorDown](/resources/btnColorDown.png) to shift color theme up or down.
- Press ![btnJuliaUp](/resources/btnJuliaUp.png)/![btnJuliaDown](/resources/btnJuliaDown.png) to rotate Julia Set clockwise or anti-clockwise.
- Press ![btnJuliaSpin](/resources/btnJuliaSpin.png) to turn Julia spin animation on or off.
- Press ![btnSave](/resources/btnSave.png) to save image.
- Press ![btnSettings](/resources/btnSettings.png) to open or close settings panel.
- Press ![btnHelp](/resources/btnHelp.png) to open or close help panel.

### To create a custom color rendering palette

- Choose a palette depth of 4, 8, 12 or 16 colors.
- Choose a gradient depth of 16, 32, 64, 128, 256 or 512 levels.
- Choose the color interpolation method ('None' or 'Linear').
- Create the palette by picking colors using the color picker widget and applying the selection to each palette slot in turn.
- Click 'PAINT'. A color gradient will be created dynamically and applied to the displayed fractal. 
- The custom color gradient will also be added to the list of available color rendering themes in the format 'User_x_nnn', where 'x' is an auto-incremented number and 'nnn' is the number of levels.

## How to Deploy
### To view and deploy as a web page

The project can be deployed as an Electron (Node.js) desktop application (`index2.html`), or as a stand-alone web site `index.html`.

To view as a web page, simply open the [index.html](./index.html) file from the project root directory in any web browser. To deploy to a web server, from your command line:

```bash
# Clone this repository
git clone https://github.com/Algol-Variables/fractal-generator
# Go into the repository
cd fractal-generator
# Copy files to required web server directory e.g. /var/www/html/fractal/
cp {complexlite.js, colorutils.js, fractalutils.js, app.js, index.html, styles.css, resources/*} /var/www/html/fractal
```
See, for example: [fractal-generator](https://www.algolvariables.com/fractals/index.html)

### To build and deploy as a desktop application

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/Algol-Variables/fractal-generator
# Go into the repository
cd fractal-generator
# Install dependencies
npm install
# Install electron-forge (if required)
npm install --save-dev @electron-forge/cli
npx electron-forge import
# Run the app
npm start
# Create local app executable using electron-forge (if required)
npm run make
# The executable application (.app, .exe, etc.) can be found in the /out/make directory
cd out/make
```

## License

Copyright: Algol Variables © 2021

[GPLv3 License](LICENSE)

Icons from [iconmonstr](https://iconmonstr.com/) - [License](https://iconmonstr.com/license/)

## Author Information

admin@algolvariables.com
