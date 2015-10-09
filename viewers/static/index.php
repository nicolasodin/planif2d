<!DOCTYPE html>
<!-- <html manifest="cache.manifest"> -->
<html>

<head>
<title>DICOM Web Viewer</title>
<meta charset="UTF-8">
<meta name="description" content="DICOM Web Viewer (DWV) static version">
<meta name="keywords" content="DICOM,HTML5,JavaScript,medical,imaging,DWV">
<link type="text/css" rel="stylesheet" href="../../css/style.css">
<style type="text/css" >
body { background-color: #222; color: white;
  margin: 10px; padding: 0; font-size: 80%  }
#pageHeader h1 { display: inline-block; margin: 0; color: #fff; }
#pageHeader a { color: #ddf; }
#pageHeader #toolbar { display: inline-block; float: right; }
#toolbox li:first-child { list-style-type: none; padding-bottom: 10px; margin-left: -20px; }
#pageMain { position: absolute; height: 92%; width: 99%; bottom: 5px; left: 5px; background-color: #333; }
#infotl { color: #333; text-shadow: 0 1px 0 #fff; }
#infotr { color: #333; text-shadow: 0 1px 0 #fff; }
#dropBox { margin: 20px; }
</style>
<link type="text/css" rel="stylesheet" href="../../ext/jquery-ui/themes/ui-darkness/jquery-ui-1.11.2.min.css">
<!-- Third party -->
<script type="text/javascript" src="../../ext/jquery/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="../../ext/jquery-ui/jquery-ui-1.11.2.min.js"></script>
<script type="text/javascript" src="../../ext/flot/jquery.flot.min.js"></script>
<script type="text/javascript" src="../../ext/pdfjs/jpx.js"></script>
<script type="text/javascript" src="../../ext/pdfjs/util.js"></script>
<script type="text/javascript" src="../../ext/pdfjs/arithmetic_decoder.js"></script>
<script type="text/javascript" src="../../ext/rii-mango/lossless-min.js"></script>
<script type="text/javascript" src="../../ext/notmasteryet/jpg.js"></script>
<script type="text/javascript" src="../../ext/kinetic/kinetic-v5.1.1-06.10.min.js"></script>


<!-- Local -->
  <script src="../../ext/kinetic/kinectic-loader.js"></script>
<script type="text/javascript" src="../../src/app/application.js"></script>
<script type="text/javascript" src="../../src/app/toolboxController.js"></script>
<script type="text/javascript" src="../../src/app/viewController.js"></script>
<script type="text/javascript" src="../../src/app/state.js"></script>
<script type="text/javascript" src="../../src/dicom/dicomParser.js"></script>
<script type="text/javascript" src="../../src/dicom/dictionary.js"></script>
<script type="text/javascript" src="../../src/gui/browser.js"></script>
<script type="text/javascript" src="../../src/gui/filter.js"></script>
<script type="text/javascript" src="../../src/gui/generic.js"></script>
<script type="text/javascript" src="../../src/gui/help.js"></script>
<script type="text/javascript" src="../../src/gui/html.js"></script>
<script type="text/javascript" src="../../src/gui/layer.js"></script>
<script type="text/javascript" src="../../src/gui/loader.js"></script>
<script type="text/javascript" src="../../src/gui/style.js"></script>
<script type="text/javascript" src="../../src/gui/tools.js"></script>
<script type="text/javascript" src="../../src/gui/undo.js"></script>
<script type="text/javascript" src="../../src/image/filter.js"></script>
<script type="text/javascript" src="../../src/image/geometry.js"></script>
<script type="text/javascript" src="../../src/image/image.js"></script>
<script type="text/javascript" src="../../src/image/luts.js"></script>
<script type="text/javascript" src="../../src/image/reader.js"></script>
<script type="text/javascript" src="../../src/image/view.js"></script>
<script type="text/javascript" src="../../src/io/file.js"></script>
<script type="text/javascript" src="../../src/io/url.js"></script>
<script type="text/javascript" src="../../src/math/bucketQueue.js"></script>
<script type="text/javascript" src="../../src/math/point.js"></script>
<script type="text/javascript" src="../../src/math/scissors.js"></script>
<script type="text/javascript" src="../../src/math/shapes.js"></script>
<script type="text/javascript" src="../../src/math/stats.js"></script>
<script type="text/javascript" src="../../src/tools/draw.js"></script>
<script type="text/javascript" src="../../src/tools/editor.js"></script>
<script type="text/javascript" src="../../src/tools/ellipse.js"></script>
<script type="text/javascript" src="../../src/tools/filter.js"></script>
<script type="text/javascript" src="../../src/tools/info.js"></script>
<script type="text/javascript" src="../../src/tools/line.js"></script>
<script type="text/javascript" src="../../src/tools/livewire.js"></script>
<script type="text/javascript" src="../../src/tools/protractor.js"></script>
<script type="text/javascript" src="../../src/tools/rectangle.js"></script>
<script type="text/javascript" src="../../src/tools/roi.js"></script>
<script type="text/javascript" src="../../src/tools/scroll.js"></script>
<script type="text/javascript" src="../../src/tools/toolbox.js"></script>
<script type="text/javascript" src="../../src/tools/undo.js"></script>
<script type="text/javascript" src="../../src/tools/windowLevel.js"></script>
<script type="text/javascript" src="../../src/tools/zoomPan.js"></script>
<script type="text/javascript" src="../../src/utils/string.js"></script>

<!-- Launch the app -->
<script type="text/javascript" src="appgui.js"></script>
<script type="text/javascript" src="applauncher.js"></script>


  <style>


    #container {width:820px;height:100px;overflow:hidden;}
    #container.rotate90,#container.rotate270 {width:100px;height:820px}
    #image {
      transform-origin: top left; /* IE 10+, Firefox, etc. */
      -webkit-transform-origin: top left; /* Chrome */
      -ms-transform-origin: top left; /* IE 9 */
    }
    #container.rotate90 #image {
      transform: rotate(90deg) translateY(-100%);
      -webkit-transform: rotate(90deg) translateY(-100%);
      -ms-transform: rotate(90deg) translateY(-100%);
    }
    #container.rotate180 #image {
      transform: rotate(180deg) translate(-100%,-100%);
      -webkit-transform: rotate(180deg) translate(-100%,-100%);
      -ms-transform: rotate(180deg) translateX(-100%,-100%);
    }
    #container.rotate270 #image {
      transform: rotate(270deg) translateX(-100%);
      -webkit-transform: rotate(270deg) translateX(-100%);
      -ms-transform: rotate(270deg) translateX(-100%);
    }




    body {


      -moz-border-radius: 10px;
      border-radius: 10px;

      -moz-transition: all 200ms linear;
      -webkit-transition: all 200ms linear;
      -o-transition: all 200ms linear;
      transition: all 200ms linear;
      float: right;
    }


    .drop_hover {
      -moz-box-shadow: 0 0 30px rgba(0, 0, 0, 0.8) inset;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.8) inset;
    }

    .draggable {
      display: inline-block;
      margin: 20px 10px 10px 20px;
      padding-top: 20px;
      width: 80px;
      height: 40px;
      /*color: #3D110F;
      background-color: #822520;
      border: 4px solid #3D110F;
      text-align: center;*/
      font-size: 2em;
      cursor: move;

      -moz-transition: all 200ms linear;
      -webkit-transition: all 200ms linear;
      -o-transition: all 200ms linear;
      transition: all 200ms linear;

      -moz-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      user-select: none;

    }
  </style>

</head>

<body>

<div id="pageHeader">

<!-- Title -->
<h1>DICOM Web Viewer
(<a href="https://github.com/ivmartel/dwv">dwv</a>
<span class="dwv-version"></span>)</h1>

<!-- Toolbar -->
<div id="toolbar"></div>

</div><!-- /pageHeader -->

<div id="pageMain">

<!-- Open file -->
<div id="openData" title="File">
<div id="loaderlist"></div>
<div id="progressbar"></div>
</div>

<!-- Toolbox -->
<div id="toolbox" title="Toolbox">
<ul id="toolList"></ul>
</div>

<!-- History -->
<div id="history" title="History"></div>

<!-- Tags -->
<div id="tags" title="Tags"></div>

<!-- Help -->
<div id="help" title="Help"></div>



  <input type="file" id="files" name="files[]" multiple style="float: right" />
  <p><input type="button" id="reset" value="reset" style  ="float: right"  /></p>
  <output id="list" style="float: right" ></output>

  <?php
    //Définition des variables de connexion à la base de données
    $bd_nom_serveur='127.0.0.1:3306';
    $bd_login='root';
    $bd_mot_de_passe='root';
    $bd_nom_bd='dwv';

    try {
        $dbh = new PDO('mysql:host=localhost;dbname=dwv', "root", "");
    } catch (PDOException $e) {
        print "Erreur !: " . $e->getMessage() . "<br/>";
  die();
  }

  //On récupère tous les implants
  $sql="SELECT * FROM implant";
  $resultat = $dbh->query($sql);

  //On recupère le nombre de résultat
  $nb_res = $resultat->rowCount();
  ?>


  <div class="drop" style="z-index: 1">

  </div>
  <div class="drag" style="float: right">


    <?php

    // Si on a récupéré un résultat on l'affiche.
    if($nb_res) {

      while($ligne = $resultat->fetch(PDO::FETCH_BOTH)) {
    $id_implant = $ligne["id"];
    $nom_implant = $ligne["nom"];
    $chemin_image_implant = $ligne["chemin_image"];

    echo "<img src='".$chemin_image_implant."' class='draggable' alt='implants' style='width:300; height:100 ;z-index:500'>";
    }
    }
    else echo _('Pas d implants dans la base de données.');

    ?>


    <script>
      function handleFileSelect(evt) {
        var files = evt.target.files;
        for (var i = 0, f; f = files[i]; i++) {

          // Only process image files.
          if (!f.type.match('image.*')) {
            continue;
          }
          var reader = new FileReader();
           reader.onload = (function(theFile) {
            return function(e) {
              var span = document.createElement('span');
              span.innerHTML = [' "<img  draggable="true" class = "draggable" style="width:200px; height:200px; class="draggable" src="', e.target.result,
                '" title="', escape(theFile.name), '"/>'].join('');
              document.getElementById('list').insertBefore(span, null);
            };
          })(f);
          reader.readAsDataURL(f);

        }
      }
      document.getElementById('files').addEventListener('change', handleFileSelect, false);

      $(".draggable").draggable({
        revert: 'invalide'
      });

      $("body").droppable({
        accept: ".draggable"
      });

      $("#reset").click(function () {
        $(".draggable").animate({
          top: "0px",
          left: "0px"
        });
      });



    </script>



  </div>

  <!-- Layer Container -->
  <div id="layerDialog" title="Image" style="z-index: 10 ; position: static;">
    <div id="dwv-dropBox" class="dropBox"></div>
    <div id="dwv" class="layerContainer">
      <canvas id="dwv-imageLayer" class="imageLayer">Only for HTML5 compatible browsers...</canvas>
      <div id="dwv-drawDiv" class="drawDiv"></div>
      <div id="dwv-infoLayer" class="infoLayer">
        <div id="dwv-infotl" class="infotl"></div>
        <div id="dwv-infotr" class="infotr"></div>
        <div id="dwv-infobl" class="infobl"></div>
        <div id="dwv-infobr" class="infobr"><div id="dwv-plot" class="plot"></div>
        </div>
      </div><!-- /infoLayer -->
    </div><!-- /layerContainer -->
  </div><!-- /layerDialog -->



</div>


</div><!-- /pageMain -->




</body>
</html>