////////////////////////////////////////////////////////////////////////Fonctions//////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////Permet de créer des cookies//////////////////////////////////////////////////////////// 
function createCookie(name, value) {
    var date = new Date();
    date.setTime(date.getTime()+(360*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/"
}

/////////////////////////////////////////////////////////Permet de lire les cookies que l'on a créés///////////////////////////////////////////////////
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/////////////////////////////////////////Permet d'avoir toutes les valeurs de l'image affichée et de l'image réelle////////////////////////////////////
function getValeursImage() {
	var imageCanvas = document.getElementById("dwv-imageLayer");

	// Taille de l'image réelle
	var widthImageReelle = readCookie("width");
	var heightImageReelle = readCookie("height");

	// Taille de l'image affichée à l'écran
	var widthImageCanvas = imageCanvas.width;
	var heightImageCanvas = imageCanvas.height;

	return {
		widthImageReelle : widthImageReelle, 
		heightImageReelle : heightImageReelle, 
		widthImageCanvas : widthImageCanvas, 
		heightImageCanvas : heightImageCanvas
	};
}

////////////////////////////////////////////////Permet de trouver le facteur de redimensionnement de l'image///////////////////////////////////////////
function facteurRedimensionnementImage() {
	// On récupère les valeurs de l'image affichée et de l'image réelle
	var image = getValeursImage();

	// Calcul du coefficient réducteur de l'image
	var coefWidthImage = image.widthImageCanvas / image.widthImageReelle;
	var coefHeightImage = image.heightImageCanvas / image.heightImageReelle;

	return {
		coefWidth : coefWidthImage, 
		coefHeight : coefHeightImage
	};
}

function CoefRedimensionnementImplant() {
	// On récupère les valeurs de l'image affichée et de l'image réelle
	var image = getValeursImage();

	// On a la valeur de la bille sur l'image dicom.jpg. Après, il faudra demander à l'utilisateur de renseigner le diamètre de la bille en cm et nous on déduira le diamètre en px.
	var diametreBilleMm = 2.8; var diametreBillePx = 170;

	
}
