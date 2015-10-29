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

////////////////////////////////////////////////////////////////Permet d'exporter un PDF///////////////////////////////////////////////////////////////
// A ajouter mais problème avec les cookies

function CoefRedimensionnementImplant(id, diametreBillemm) {
	var idImplant = id;

	// On récupère les valeurs de l'image affichée et de l'image réelle
	var image = getValeursImage();

	// On a la valeur de la bille sur l'image dicom.jpg. Après, il faudra demander à l'utilisateur de renseigner le diamètre de la bille en cm et nous on déduira le diamètre en px.
	var diametreBilleMm = diametreBillemm;
	var diametreBillePx = 170;

	var widthReelleImageCm = (image.widthImageReelle * diametreBilleMm) / diametreBillePx;
	var heightReelleImageCm = (image.heightImageReelle * diametreBilleMm) / diametreBillePx;

	unCmEgalCbPxWidthImage = image.widthImageReelle / widthReelleImageCm;
	unCmEgalCbPxHeightImage = image.heightImageReelle / heightReelleImageCm;

	// On récupère dans la BDD la largeur et la hauteur en px et cm des implants
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	// On définit l'appel de la fonction au retour serveur
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

    xhr.open("GET", 'php/getimplantId.php?idImp='+ idImplant +'', false);
    xhr.send(null);
    xhr.responseText;
    var docXML = xhr.responseXML;

    var idImplantBDD = docXML.getElementsByTagName("id");
    var widthPxImplantBDD = docXML.getElementsByTagName("widthPx");
    var widthCmImplantBDD = docXML.getElementsByTagName("widthCm");
	var heightPxImplantBDD = docXML.getElementsByTagName("heightPx");
    var heightCmImplantBDD = docXML.getElementsByTagName("heightCm");
    // Est ce qu'on récupère vraiment les données ???

     for (var i = 0; i < idImplantBDD.length; i++) {
		if (idImplant == idImplantBDD.item(i).firstChild.data) {
			var widthPxImplant = widthPxImplantBDD.item(i).firstChild.data;
		    var widthCmImplant = widthCmImplantBDD.item(i).firstChild.data;
			var heightPxImplant = heightPxImplantBDD.item(i).firstChild.data;
		    var heightCmImplant = heightCmImplantBDD.item(i).firstChild.data;
		};
    };

    alert(widthPxImplant);

    var unCmEgalCbPxWidthImp = widthPxImplant / widthCmImplant;
	var unCmEgalCbPxHeightImp = heightPxImplant / heightCmImplant;
	// Faut-il faire la moyenne des deux ? Non, il faut prendre l'équivalent en cm pour la largeur et la longueur

	// tailleImplant * X = tailleImage
	// On prend pour le moment la largeur mais après on prendra la largeur et la hauteur
	var coef = unCmEgalCbPxWidthImage / unCmEgalCbPxWidthImp;
    return coef;
}

