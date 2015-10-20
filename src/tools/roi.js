/** 
 * Tool module.
 * @module tool
 */
var dwv = dwv || {};
dwv.tool = dwv.tool || {};
var Kinetic = Kinetic || {};

/** 
 * ROI factory.
 * @class RoiFactory
 * @namespace dwv.tool
 * @constructor
 */
dwv.tool.RoiFactory = function ()
{
    /** 
     * Get the number of points needed to build the shape.
     * @method getNPoints
     * @return {Number} The number of points.
     */
    this.getNPoints = function () { return 50; };
    /** 
     * Get the timeout between point storage.
     * @method getTimeout
     * @return {Number} The timeout in milliseconds.
     */
    this.getTimeout = function () { return 100; };
};  

/**
 * Create a roi shape to be displayed.
 * @method RoiCreator
 * @param {Array} points The points from which to extract the line.
 * @param {Object} style The drawing style.
 * @param {Object} image The associated image.
 */ 
dwv.tool.RoiFactory.prototype.create = function (points, style /*, image*/)
{
    // physical shape
    var roi = new dwv.math.ROI();
    // add input points to the ROI
    roi.addPoints(points);
    // points stored the kineticjs way
    var arr = [];
    var aide = true;

            for( var i = 0;  aide && i < roi.getLength(); ++i )
            {
                /*console.log("valeur roi",roi.getLength());
                console.log("valeur i ",i);
                console.log("vlauer taille tableau",arr.length)*/

                arr.push( roi.getPoint(i).getX() );
                arr.push( roi.getPoint(i).getY() );

                if (arr.length >= 8 ) {
                    aide = false;
                }

            }


    // draw shape
    var kshape = new Kinetic.Line({
        points: arr,
        stroke: style.getLineColour(),
        strokeWidth: style.getScaledStrokeWidth(),
        name: "shape",
        closed: true
    });



        var centre = [] ;
        var x1 = arr[0] / 2 + arr[2] / 2 ;
        var y1 = arr[1] / 2 + arr[3] / 2 ;
        var x2 = arr[4] / 2 + arr[6] / 2 ;
        var y2 = arr[5] / 2 + arr[7] / 2 ;
        centre.push(x1);
        centre.push(y1);
        centre.push(x2);
        centre.push(y2);

   var kshape2 = new Kinetic.Line({

       points: centre,
       stroke: "red",
       strokeWidth: 5,
       lineJoin: 'round',
       /*
        * line segments with a length of 33px
        * with a gap of 10px
        */
       name: "shape2"
   })
    kshape2.dashArray([10,2]);



    var x = x1 / 2  + x2 /2 ;
    var y = y1/ 2 + y2/2;
    var center_line = [];


    center_line.push(x);
    center_line.push(y);


    var label = new Kinetic.Label({
        x : x,
        y : y,
         draggable: true,
       name : "shape3"
    });


    console.log("Avant    :  ", x   , "{}", y );
   // console.log("ceci est les dfféretnes coord    :  ", x.getLayer()   , "{}", y.getY() );
// add a tag to the label<br>
  /*  label.add(new Kinetic.Tag({
        fill: '#bbb',
        stroke: '#333',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        lineJoin: 'round',
        pointerDirection: 'up',
        pointerWidth: 20,
        pointerHeight: 20,
        cornerRadius: 5
    }));

        // add text to the label<br>
        label.add(new Kinetic.Text({
            text: 'this the center!',
            fontSize: 8,
            lineHeight: 1.2,
            padding: 1,
            fill: 'green'
        }));*/


    function post(x,y)
    {




        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (arr.length == 8){
        xmlhttp.open("POST","insertdata.php",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("x=" + x + "&y=" + y );
        }
    };
    post(x,y);

    // return group
    var group = new Kinetic.Group();
    group.name("roi-group");
    group.add(kshape);
    group.add(kshape2);
    group.add(label);

    return group;
}; 

/**
 * Update a roi shape.
 * @method UpdateRoi
 * @static
 * @param {Object} anchor The active anchor.
 * @param {Object} image The associated image.
 */ 
dwv.tool.UpdateRoi = function (anchor /*, image*/)
{
    // parent group
    var group = anchor.getParent();
    // associated shape
    var kroi = group.getChildren( function (node) {
        return node.name() === 'shape';
    })[0];
    // update self
    var point = group.getChildren( function (node) {
        return node.id() === anchor.id();
    })[0];
    point.x( anchor.x() );
    point.y( anchor.y() );
    // update the roi point and compensate for possible drag
    // (the anchor id is the index of the point in the list)
    var points = kroi.points();
    points[anchor.id()] = anchor.x() - kroi.x();
    points[anchor.id()+1] = anchor.y() - kroi.y();

    kroi.points( points );


    var kline = group.getChildren( function (node) {
        return node.name() === 'shape2';
    })[0];
    // update self
    var x = points[0] / 2 + points[2] / 2 ;
    var y = points[1] / 2 + points[3] / 2 ;
    var a = points[4] / 2 + points[6] / 2 ;
    var b = points[5] / 2 + points[7] / 2 ;
    kline.points( [x,y,a,b] );
    // update the roi point and compensate for possible drag
    // (the anchor id is the index of the point in the list)


    var kpoint = group.getChildren( function (node) {
        return node.name() === 'shape3';
    })[0];
    // update self
    var x1 = x / 2 + a / 2 ;
    var y1 = y / 2 + b / 2 ;

    function post(x,y)
    {




        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

            xmlhttp.open("POST","insertdata.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("x=" + x + "&y=" + y );

    };
    post(x1,y1);

    kpoint.x = x1;
    kpoint.y = y1;
    console.log(" {", x1 , ", " ,y1," }");




};
