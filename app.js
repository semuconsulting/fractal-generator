// ------------------------------------------------------------------------
// Help Modal Dialog handler for fractal generator
//
// Copyright (c) 2021 SEMU Consulting
// ------------------------------------------------------------------------
"use strict";

function start() {
    // Get the help modal
    var modal = document.getElementById("helpModal");

    // Get the button that opens the modal
    var btnHelp = document.getElementById("btnHelp");

    // Get the <span> element that closes the modal.
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal.
    btnHelp.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal.
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it.
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Start the interactive fractal window.
    fractalStart()
}