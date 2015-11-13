/** 
 * Tool module.
 * @module tool
 */
var dwv = dwv || {};
dwv.tool = dwv.tool || {};
var Kinetic = Kinetic || {};

/** 
 * Line factory.
 * @class LineFactory
 * @namespace dwv.tool
 * @constructor
 */
dwv.tool.MeterFactory = function ()
{
    /** 
     * Get the number of points needed to build the shape.
     * @method getNPoints
     * @return {Number} The number of points.
     */
    this.getNPoints = function () { return 2; };
    /** 
     * Get the timeout between point storage.
     * @method getTimeout
     * @return {Number} The timeout in milliseconds.
     */
    this.getTimeout = function () { return 0; };
};  

/**
 * Create a line shape to be displayed.
 * @method create
 * @param {Array} points The points from which to extract the line.
 * @param {Object} style The drawing style.
 * @param {Object} image The associated image.
 */ 
dwv.tool.MeterFactory.prototype.create = function (points, style, image)
{
    console.log("MeterFactory");
    // physical shape
    var line = new dwv.math.Line(points[0], points[1]);
    // draw shape
    var kshape = new Kinetic.Line({
        points: [line.getBegin().getX(), line.getBegin().getY(), 
                 line.getEnd().getX(), line.getEnd().getY() ],
        stroke: style.getLineColour(),
        strokeWidth: style.getScaledStrokeWidth(),
        opacity: 0.0,
        name: "shape"
    });

    var kshape = new Kinetic.Line({
        points: [line.getBegin().getX(), line.getBegin().getY(), 
                 line.getEnd().getX(), line.getEnd().getY() ],
        stroke: style.getLineColour(),
        strokeWidth: style.getScaledStrokeWidth(),
        opacity: 0.0,
        name: "shape"
    });

    var horizontalCoteShape = new Kinetic.Line({
        points: [line.getBegin().getX(), line.getBegin().getY(), 
                 line.getEnd().getX(), line.getBegin().getY() ],
        stroke: style.getLineColour(),
        strokeWidth: style.getScaledStrokeWidth(),
        name: "horizontalCoteShape"
    });
    horizontalCoteShape.dashArray([10,2]);

    var verticalCoteShape = new Kinetic.Line({
        points: [line.getBegin().getX(), line.getBegin().getY(), 
                 line.getBegin().getX(), line.getEnd().getY() ],
        stroke: style.getLineColour(),
        strokeWidth: style.getScaledStrokeWidth(),
        name: "verticalCoteShape"
    });
    verticalCoteShape.dashArray([10,2]);

    var startShape = new Kinetic.Circle({
        x: line.getBegin().getX(),
        y: line.getBegin().getY(),
        radius: 15,
        fill: "#F47D30"
    });

    var endShape = new Kinetic.Circle({
        x: line.getEnd().getX(),
        y: line.getEnd().getY(),
        radius: 15,
        fill: "#F47D30"
    });

    // quantification
    var deltaX = Math.round(((Math.abs(line.getEnd().getX()-line.getBegin().getX())*28)/170)*100)/100;
    var deltaY = Math.round(((Math.abs(line.getEnd().getY()-line.getBegin().getY())*28)/170)*100)/100;
    var strDeltaX = deltaX + " mm";
    var strDeltaY = deltaY + " mm";
    /*meter : dev en cours
              -> create = OK
              -> update = à faire*/
    // quantification text
    var horizontalCoteText = new Kinetic.Text({
        x: line.getBegin().getX()+((line.getEnd().getX()-line.getBegin().getX())/2),
        y: line.getBegin().getY()+10,
        text: strDeltaX,
        fontSize: style.getScaledFontSize(),
        fontFamily: style.getFontFamily(),
        fill: style.getLineColour(),
        name: "horizontalCoteText"
    });

     var verticalCoteText = new Kinetic.Text({
        x: line.getBegin().getX()+10,
        y: line.getBegin().getY()+((line.getEnd().getY()-line.getBegin().getY())/2),
        text: strDeltaY,
        fontSize: style.getScaledFontSize(),
        fontFamily: style.getFontFamily(),
        fill: style.getLineColour(),
        name: "verticalCoteText"
    });

    // return group
    var group = new Kinetic.Group();
    group.name("line-group");
    group.add(kshape);
    group.add(horizontalCoteShape);
    group.add(verticalCoteShape);
    group.add(startShape);
    group.add(endShape);
    group.add(horizontalCoteText);
    group.add(verticalCoteText);

    return group;
};

/**
 * Update a line shape.
 * @method UpdateLine
 * @static
 * @param {Object} anchor The active anchor.
 * @param {Object} image The associated image.
 */ 
dwv.tool.UpdateMeter = function (anchor, image)
{
    console.log("UpdateMeter");
    // parent group
    var group = anchor.getParent();
    // associated shape
    var kline = group.getChildren( function (node) {
        return node.name() === 'shape';
    })[0];
    // associated text
    var ktext = group.getChildren( function (node) {
        return node.name() === 'text';
    })[0];
    // find special points
    var begin = group.getChildren( function (node) {
        return node.id() === 'begin';
    })[0];
    var end = group.getChildren( function (node) {
        return node.id() === 'end';
    })[0];
    // update special points
    switch ( anchor.id() ) {
    case 'begin':
        begin.x( anchor.x() );
        begin.y( anchor.y() );
        break;
    case 'end':
        end.x( anchor.x() );
        end.y( anchor.y() );
        break;
    }
    // update shape and compensate for possible drag
    // note: shape.position() and shape.size() won't work...
    var bx = begin.x() - kline.x();
    var by = begin.y() - kline.y();
    var ex = end.x() - kline.x();
    var ey = end.y() - kline.y();
    kline.points( [bx,by,ex,ey] );
    // update text
    var p2d0 = new dwv.math.Point2D(begin.x(), begin.y());
    var p2d1 = new dwv.math.Point2D(end.x(), end.y());
    var line = new dwv.math.Line(p2d0, p2d1);
    var quant = image.quantifyLine( line );
    var str = Math.round(((quant.length.toPrecision(4)*28)/170)*100)/100 + " mm";
    var dX = line.getBegin().getX() > line.getEnd().getX() ? 0 : -1;
    var dY = line.getBegin().getY() > line.getEnd().getY() ? -1 : 0.5;
    var textPos = { 
        'x': line.getEnd().getX() + dX * 25,
        'y': line.getEnd().getY() + dY * 15, };
    ktext.position( textPos );
    ktext.text(str);
};
