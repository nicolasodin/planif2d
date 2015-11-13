/** 
 * Application launcher.
 */

// check browser support
dwv.browser.check();

// launch when page is loaded
$(document).ready( function()
{
    // gui setup
    dwv.gui.setup();
    
    // main application
    var myapp = new dwv.App();
    // initialise the application

    // "tools": ["Scroll", "Window/Level", "Zoom/Pan", "Draw", "Livewire", "Filter"],
    myapp.init({
        "containerDivId": "dwv",
        "fitToWindow": true,
        "tools": ["Scroll", "Window/Level", "Zoom/Pan", "Draw", "Filter"],
        "filters": ["Threshold", "Sharpen", "Sobel"],
        "shapes": ["Line", "Protractor", "Rectangle", "Roi", "Ellipse", "Circle", "Meter"],
        "gui": ["tool", "load", "help", "undo", "version", "tags"],
        "isMobile": false
    });
    
    // help
    // TODO Seems accordion only works when at end...
    $("#accordion").accordion({ collapsible: "true", active: "false", heightStyle: "content" });
});
