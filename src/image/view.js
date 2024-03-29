/**
 * Image module.
 * @module image
 */
 var dwv = dwv || {};
dwv.image = dwv.image || {};

/**
 * View class.
 * @class View
 * @namespace dwv.image
 * @constructor
 * @param {Image} image The associated image.
 * @param {Boolean} isSigned Is the data signed.
 * Need to set the window lookup table once created
 * (either directly or with helper methods).
 */
dwv.image.View = function(image, isSigned)
{
    /**
     * Window lookup tables, indexed per Rescale Slope and Intercept (RSI).
     * @property windowLuts
     * @private
     * @type Window
     */
    var windowLuts = {};

    /**
     * Window presets.
     * @property windowPresets
     * @private
     * @type Object
     */
    var windowPresets = null;
    /**
     * colour map
     * @property colourMap
     * @private
     * @type Object
     */
    var colourMap = dwv.image.lut.plain;
    /**
     * Current position
     * @property currentPosition
     * @private
     * @type Object
     */
    var currentPosition = {"i":0,"j":0,"k":0};

    /**
     * Get the associated image.
     * @method getImage
     * @return {Image} The associated image.
     */
    this.getImage = function() { return image; };
    /**
     * Set the associated image.
     * @method setImage
     * @param {Image} inImage The associated image.
     */
    this.setImage = function(inImage) { image = inImage; };

    /**
     * Get the window LUT of the image.
     * @method getWindowLut
     * @return {Window} The window LUT of the image.
     */
    this.getWindowLut = function (rsi) {
        if ( typeof rsi === "undefined" ) {
            var sliceNumber = this.getCurrentPosition().k;
            rsi = image.getRescaleSlopeAndIntercept(sliceNumber);
        }
        return windowLuts[ rsi.toString() ];
    };
    /**
     * Set the window LUT of the image.
     * @method setWindowLut
     * @param {Window} wlut The window LUT of the image.
     */
    this.setWindowLut = function (wlut)
    {
        var rsi = wlut.getRescaleLut().getRSI();
        windowLuts[rsi.toString()] = wlut;
    };

    var self = this;

    /**
     * Initialise the view. Only called at construction.
     * @method initialise
     * @private
     */
    function initialise()
    {
        // create the rescale lookup table
        var rescaleLut = new dwv.image.lut.Rescale(
            image.getRescaleSlopeAndIntercept(0) );
        // initialise the rescale lookup table
        rescaleLut.initialise(image.getMeta().BitsStored);
        // create the window lookup table
        var windowLut = new dwv.image.lut.Window(rescaleLut, isSigned);
        self.setWindowLut(windowLut);
    }

    // default constructor
     initialise();

     /**
     * Get the window presets.
     * @method getWindowPresets
     * @return {Object} The window presets.
     */
    this.getWindowPresets = function() { return windowPresets; };
    /**
     * Set the window presets.
     * @method setWindowPresets
     * @param {Object} presets The window presets.
     */
    this.setWindowPresets = function(presets) {
        windowPresets = presets;
        this.setWindowLevel(presets[0].center, presets[0].width);
    };

    /**
     * Get the colour map of the image.
     * @method getColourMap
     * @return {Object} The colour map of the image.
     */
    this.getColourMap = function() { return colourMap; };
    /**
     * Set the colour map of the image.
     * @method setColourMap
     * @param {Object} map The colour map of the image.
     */
    this.setColourMap = function(map) {
        colourMap = map;
        // TODO Better handle this...
        if( this.getImage().getPhotometricInterpretation() === "MONOCHROME1") {
            colourMap = dwv.image.lut.invPlain;
        }
        this.fireEvent({"type": "colourchange",
           "wc": this.getWindowLut().getCenter(),
           "ww": this.getWindowLut().getWidth() });
    };

    /**
     * Is the data signed data.
     * @method isSigned
     * @return {Boolean} The signed data flag.
     */
    this.isSigned = function() { return isSigned; };

    /**
     * Get the current position.
     * @method getCurrentPosition
     * @return {Object} The current position.
     */
    this.getCurrentPosition = function() { return currentPosition; };
    /**
     * Set the current position. Returns false if not in bounds.
     * @method setCurrentPosition
     * @param {Object} pos The current position.
     */
    this.setCurrentPosition = function(pos) {
        if( !image.getGeometry().getSize().isInBounds(pos.i,pos.j,pos.k) ) {
            return false;
        }
        var oldPosition = currentPosition;
        currentPosition = pos;
        // only display value for monochrome data
        if( image.getPhotometricInterpretation().match(/MONOCHROME/) !== null )
        {
            this.fireEvent({"type": "positionchange",
                "i": pos.i, "j": pos.j, "k": pos.k,
                "value": image.getRescaledValue(pos.i,pos.j,pos.k)});
        }
        else
        {
            this.fireEvent({"type": "positionchange",
                "i": pos.i, "j": pos.j, "k": pos.k});
}
// slice change event (used to trigger redraw)
if( oldPosition.k !== currentPosition.k ) {
    this.fireEvent({"type": "slicechange"});
}
return true;
};

/**
 * Append another view to this one.
 * @method append
 * @param {Object} rhs The view to append.
 */
this.append = function( rhs )
{
    // append images
    this.getImage().appendSlice( rhs.getImage() );
    // init to update self
    this.setWindowLut(rhs.getWindowLut());
};

    /**
     * Set the view window/level.
     * @method setWindowLevel
     * @param {Number} center The window center.
     * @param {Number} width The window width.
     * Warning: uses the latest set rescale LUT or the default linear one.
     */
    this.setWindowLevel = function ( center, width )
    {
        // window width shall be >= 1 (see https://www.dabsoft.ch/dicom/3/C.11.2.1.2/)
        if ( width >= 1 ) {
            for ( var key in windowLuts ) {
                windowLuts[key].setCenterAndWidth(center, width);
            }
            this.fireEvent({"type": "wlchange", "wc": center, "ww": width });
        }
    };

    /**
     * Clone the image using all meta data and the original data buffer.
     * @method clone
     * @return {View} A full copy of this {dwv.image.View}.
     */
    this.clone = function ()
    {
        var copy = new dwv.image.View(this.getImage());
        for ( var key in windowLuts ) {
            copy.setWindowLut(windowLuts[key]);
        }
        copy.setListeners(this.getListeners());
        return copy;
    };

    /**
     * View listeners
     * @property listeners
     * @private
     * @type Object
     */
    var listeners = {};
    /**
     * Get the view listeners.
     * @method getListeners
     * @return {Object} The view listeners.
     */
    this.getListeners = function() { return listeners; };
    /**
     * Set the view listeners.
     * @method setListeners
     * @param {Object} list The view listeners.
     */
    this.setListeners = function(list) { listeners = list; };
};

/**
 * Set the image window/level to cover the full data range.
 * @method setWindowLevelMinMax
 * Warning: uses the latest set rescale LUT or the default linear one.
 */
dwv.image.View.prototype.setWindowLevelMinMax = function()
{
    // calculate center and width
    var range = this.getImage().getRescaledDataRange();
    var min = range.min;
    var max = range.max;
    var width = max - min;
    var center = min + width/2;
    // set window level
    this.setWindowLevel(center,width);
};

/**
 * Generate display image data to be given to a canvas.
 * @method generateImageData
 * @param {Array} array The array to fill in.
 * @param {Number} sliceNumber The slice position.
 */
dwv.image.View.prototype.generateImageData = function( array )
{
    var sliceNumber = this.getCurrentPosition().k;
    var image = this.getImage();
    var pxValue = 0;
    var photoInterpretation = image.getPhotometricInterpretation();
    var planarConfig = image.getPlanarConfiguration();
    var windowLut = this.getWindowLut();
    windowLut.update();
    var colourMap = this.getColourMap();
    var index = 0;
    var sliceSize = image.getGeometry().getSize().getSliceSize();
    var sliceOffset = 0;
    switch (photoInterpretation)
    {
    case "MONOCHROME1":
    case "MONOCHROME2":
        sliceOffset = (sliceNumber || 0) * sliceSize;
        var iMax = sliceOffset + sliceSize;
        for(var i=sliceOffset; i < iMax; ++i)
        {
            pxValue = parseInt( windowLut.getValue(
                    image.getValueAtOffset(i) ), 10 );
            array.data[index] = colourMap.red[pxValue];
            array.data[index+1] = colourMap.green[pxValue];
            array.data[index+2] = colourMap.blue[pxValue];
            array.data[index+3] = 0xff;
            index += 4;
        }
        break;

    case "RGB":
        // the planar configuration defines the memory layout
        if( planarConfig !== 0 && planarConfig !== 1 ) {
            throw new Error("Unsupported planar configuration: "+planarConfig);
        }
        sliceOffset = (sliceNumber || 0) * 3 * sliceSize;
        // default: RGBRGBRGBRGB...
        var posR = sliceOffset;
        var posG = sliceOffset + 1;
        var posB = sliceOffset + 2;
        var stepPos = 3;
        // RRRR...GGGG...BBBB...
        if (planarConfig === 1) {
            posR = sliceOffset;
            posG = sliceOffset + sliceSize;
            posB = sliceOffset + 2 * sliceSize;
            stepPos = 1;
        }

        var redValue = 0;
        var greenValue = 0;
        var blueValue = 0;
        for(var j=0; j < sliceSize; ++j)
        {
            redValue = parseInt( windowLut.getValue(
                    image.getValueAtOffset(posR) ), 10 );
            greenValue = parseInt( windowLut.getValue(
                    image.getValueAtOffset(posG) ), 10 );
            blueValue = parseInt( windowLut.getValue(
                    image.getValueAtOffset(posB) ), 10 );

            array.data[index] = redValue;
            array.data[index+1] = greenValue;
            array.data[index+2] = blueValue;
            array.data[index+3] = 0xff;
            index += 4;

            posR += stepPos;
            posG += stepPos;
            posB += stepPos;
        }
        break;

    default:
        throw new Error("Unsupported photometric interpretation: "+photoInterpretation);
    }
};

/**
 * Add an event listener on the view.
 * @method addEventListener
 * @param {String} type The event type.
 * @param {Object} listener The method associated with the provided event type.
 */
dwv.image.View.prototype.addEventListener = function(type, listener)
{
    var listeners = this.getListeners();
    if( !listeners[type] ) {
        listeners[type] = [];
    }
    listeners[type].push(listener);
};

/**
 * Remove an event listener on the view.
 * @method removeEventListener
 * @param {String} type The event type.
 * @param {Object} listener The method associated with the provided event type.
 */
dwv.image.View.prototype.removeEventListener = function(type, listener)
{
    var listeners = this.getListeners();
    if( !listeners[type] ) {
        return;
    }
    for(var i=0; i < listeners[type].length; ++i)
    {
        if( listeners[type][i] === listener ) {
            listeners[type].splice(i,1);
        }
    }
};

/**
 * Fire an event: call all associated listeners.
 * @method fireEvent
 * @param {Object} event The event to fire.
 */
dwv.image.View.prototype.fireEvent = function(event)
{
    var listeners = this.getListeners();
    if( !listeners[event.type] ) {
        return;
    }
    for(var i=0; i < listeners[event.type].length; ++i)
    {
        listeners[event.type][i](event);
    }
};

/**
 * View factory.
 * @class ViewFactory
 * @namespace dwv.image
 * @constructor
 */
dwv.image.ViewFactory = function () {};

/**
 * Get an View object from the read DICOM file.
 * @method create
 * @param {Object} dicomElements The DICOM tags.
 * @param {Array} pixelBuffer The pixel buffer.
 * @returns {View} The new View.
 */
dwv.image.ViewFactory.prototype.create = function (dicomElements, pixelBuffer)
{
    // create the image
    var imageFactory = new dwv.image.ImageFactory();
    var image = imageFactory.create(dicomElements, pixelBuffer);

    // PixelRepresentation
    var isSigned = false;
    var pixelRepresentation = dicomElements.getFromKey("x00280103");
    if ( pixelRepresentation === 1 ) {
        isSigned = true;
    }
    // view
    var view = new dwv.image.View(image, isSigned);
    // presets
    var windowPresets = [];
    // WindowCenter and WindowWidth
    var windowCenter = dicomElements.getFromKey("x00281050", true);
    var windowWidth = dicomElements.getFromKey("x00281051", true);
    if ( windowCenter && windowWidth ) {
        var name;
        for ( var j = 0; j < windowCenter.length; ++j) {
            var width = parseFloat( windowWidth[j], 10 );
            var center = parseFloat( windowCenter[j], 10 );
            if ( width ) {
                name = "Default"+j;
                var windowCenterWidthExplanation = dicomElements.getFromKey("x00281055");
                if ( windowCenterWidthExplanation ) {
                    name = windowCenterWidthExplanation[j];
                }
                windowPresets.push({
                    "center": center,
                    "width": width,
                    "name": name
                });
            }
        }
    }
    if ( windowPresets.length !== 0 ) {
        view.setWindowPresets( windowPresets );
    }
    else {
        view.setWindowLevelMinMax();
    }

    return view;
};