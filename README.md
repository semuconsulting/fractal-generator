# Fractal Generator

Just a bit of fun...

A JavaScript implementation of an interactive fractal generator.  It supports both Mandelbrot and Julia modes and with 'Standard', 'Burning Ship' and 'Tricorn' variants using a variety of color rendering themes.  Simple zoom, pan and color interaction is supported via mouse clicks/drags and hotkey strokes.

The app implements two alternate fractal calculation methodologies; one using standard maths, the other using the provided `complexlite.js` complex maths library.

![full app screenshot ubx](/images/screenshot.png)

The project can be deployed as an Electron (Node.js) desktop application (`index2.html`), or as a stand-alone web site `index.html`.

The following instructions can be viewed by clicking on the `?` button:

- Click to zoom in by fixed factor.
- Click and drag to zoom into drawn area.
- Ctrl + Click to zoom out by fixed factor.
- Shift + Click to centre at current coordinates.
- Alt(Option) + Click to toggle between Mandelbrot and Julia modes at current coordinates (useful points of interest can be found just outside the perimeter of the Mandelbrot set).
- Press 'R' to reset to default settings.
- Press 'M' to cycle through modes (Mandelbrot / Julia).
- Press 'J' to enter Julia mode at current coordinates.
- Press 'V' to cycle through variants (Standard / Burning Ship / Tricorn).   
- Press 'C' to cycle through color themes.
- Press 'up/down arrow' to shift color theme up or down.
- Press 'left/right arrow' to rotate Julia Set clockwise or anti-clockwise.
- Press 'E' to cycle exponent (2 - 6).

## To view and deploy as a web page

To view as a web page, simply open the [index.html](./index.html) file from the project root directory in any web browser. To deploy to a web server, from your command line:

```bash
# Clone this repository
git clone https://github.com/Algol-Variables/fractal-generator
# Go into the repository
cd fractal-generator
# Copy files to required web server directory e.g. /var/www/html/fractal/
cp {index.html, app.js, complexlite.js, colormaps.js, fractal.js, styles.css} /var/www/html/fractal
```
See, for example: [fractal-generator](https://www.algolvariables.com/fractals/)

## To build and deploy as a desktop application

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

[BSD 3-Clause License](LICENSE)

## Author Information

algol variables
