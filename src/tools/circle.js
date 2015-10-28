/** 
 * Tool module.
 * @module tool
 */
var dwv = dwv || {};
dwv.tool = dwv.tool || {};
var Kinetic = Kinetic || {};

/** 
 * Circle factory.
 * @class CircleFactory
 * @namespace dwv.tool
 * @constructor
 */
dwv.tool.CircleFactory = function ()
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
 * Create a cercle shape to be displayed.
 * @method create
 * @param {Array} points The points from which to extract the cercle.
 * @param {Object} style The drawing style.
 * @param {Object} image The associated image.
 */ 
 dwv.tool.CircleFactory.prototype.create = function (points, style, image)
{
    console.log("CircleFactory OK")
    // calculate radius
    var radiusCircle = Math.sqrt(Math.pow(points[1].getX()-points[0].getX(),2)+Math.pow(points[1].getY()-points[0].getY(),2));
    // physical shape
    var circle = new dwv.math.Circle(points[0], radiusCircle);
    // draw shape
    var kshape = new Kinetic.Circle({
        x: circle.getCenter().getX(),
        y: circle.getCenter().getY(),
        radius: circle.getRadius(),
        stroke: style.getLineColour(),
        strokeWidth: style.getScaledStrokeWidth(),
        name: "shape"
    });
    // quantification
    //var quant = image.quantifyCircle( circle );
    //var cm2 = quant.surface / 100;
    var str = radiusCircle + " mm";//cm2.toPrecision(4) + " cm2";
    // quantification text
    var ktext = new Kinetic.Text({
        x: circle.getCenter().getX(),
        y: circle.getCenter().getY(),
        text: str,
        fontSize: style.getScaledFontSize(),
        fontFamily: style.getFontFamily(),
        fill: style.getLineColour(),
        name: "text"
    });
    // return group
    var group = new Kinetic.Group();
    group.name("circle-group");
    group.add(kshape);
    group.add(ktext);
    return group;
};

dwv.tool.UpdateCircle = function (anchor, image)
{
    console.log("UpdateCircle OK")
    // parent group
    var group = anchor.getParent();
    // associated shape
    var kcircle = group.getChildren( function (node) {
        return node.name() === 'shape';
    })[0];
    // associated text
    var ktext = group.getChildren(function(node){
        return node.name() === 'text';
    })[0];
    // find special points
    var centerCircleAnchor = group.getChildren( function (node) {
        return node.id() === 'centerCircleAnchor';
    })[0];
    var radiusPoint = group.getChildren( function (node) {
        return node.id() === 'radiusPoint';
    })[0];
    
    // update 'self' (undo case) and special points
    var radiusCircle = ( centerCircleAnchor.x() -  radiusPoint.x());
    console.log(radiusCircle)
    var radiusCircleAbs = Math.abs(radiusCircle);
    switch ( anchor.id() ) {
    case 'radiusPoint':
        radiusPoint.x(anchor.x());
        radiusPoint.y(centerCircleAnchor.y())
        break;
    case 'centerCircleAnchor':
        centerCircleAnchor.x(centerCircleAnchor.x());
        centerCircleAnchor.y(centerCircleAnchor.y());
        radiusPoint.x(anchor.x()+radiusCircle);
        radiusPoint.y(centerCircleAnchor.y());
        break;

    default :
        console.error('Unhandled anchor id: '+anchor.id());
        break;
    }
    // update shape

    //var radiusCircle = ( topRight.x() - topLeft.x() ) / 2; //Math.sqrt(Math.pow(topRight.x()-topLeft.x())+Math.pow(bottomRight.y()-topRight.y()));
    var centerCircle = { 'x': centerCircleAnchor.x(), 'y': centerCircleAnchor.y()};//dwv.math.Point2D(topLeft.x()+radiusCircle, topLeft.y()+radiusCircle);
    // physical shape
    //var circle = new dwv.math.Circle(points[0], radiusCircle);
    //var radiusX = ( topRight.x() - topLeft.x() ) / 2;
    //var radiusY = ( bottomRight.y() - topRight.y() ) / 2;
    //var center = { 'x': topLeft.x() + radiusCircle, 'y': topRight.y() + radiusCircle };
    console.log("circle.js : centerCircle = "+centerCircle);
    kcircle.position( centerCircle );
    console.log("circle.js : kcircle.position = "+kcircle.position());
    
    console.log("circle.js : radiusCircleAbs = "+radiusCircleAbs);
    kcircle.radius( radiusCircleAbs );
    console.log("circle.js : kcircle.radius = "+kcircle.radius());
    // update text
    var circle = new dwv.math.Circle(centerCircle, radiusCircle);
    //var quant = image.quantifyCircle( circle );
    //var cm2 = quant.surface / 100;
    var str = radiusCircleAbs  + " mm";
    var textPos = centerCircle;
    ktext.position(textPos);
    ktext.text(str);
};

