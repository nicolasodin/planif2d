
      // Taille de l'ecran
      console.log("Body taille ",window.innerWidth  ,window.innerHeight);
      // coordonnée de la sourie
      function showCoords(event) {
        var x = event.clientX;
        var y = event.clientY;
        console.log(x,"^^",y);
      // Début de la fonction principale
      }
      $(function() {
        var final_coord_global_x1;
        var final_coord_global_y1;
        var coefDirecteur;
        var angleAlignement;
        var weSnap=false;
        var mvtOffset=0;
        var mvtOffsetB=false;
        
        // Fonction pour rendre un élément draggable
        function dragger (value){
          $( ".draggable2" ).draggable({
            disabled: value
          });

          $( ".draggable2" ).draggable( "option", "disabled", value );
          $("body").droppable({
            accept: ".draggable"
          });
          $(".draggable2").draggable({
            revert: 'invalide'
          });

        }
        // On séléctionne un implant après on procède au traitement
        
         var list = document.getElementById('list');
         list.addEventListener('change', function() {
           var canvas1 = document.getElementById("canvas");
           canvas1.style.zIndex = "500";
           var canvas2 = document.getElementById("dwv-imageLayer");
           canvas2.zIndex = "80";
///////////////////////////////////////////////////////////Test console//////////////////////////////////////////////////////////////////////////
          
          // Fonction pour tester le bon fonctionnement des cookies afin de recuperer width and height de l'image
          var width= parseInt(readCookie("width"));
          var height= parseInt(readCookie("height"));
          console.log("this the lol image size : ", width,height);
          console.log("this is the dimension of canvas 2 ",canvas2.width,canvas2.height);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          var id_liste = list.selectedIndex ;
          // On affiche le contenu de l'élément <option> ciblé par la propriété selectedIndex
          console.log(list.options[list.selectedIndex].innerHTML);
          console.log("id réelle liste ", id_liste);
          // Récupération de l'implant séléctionner via Ajax et getimplant.php

          function geturlimplant() {
            var id = id_liste;
            var xhr;
            if (window.XMLHttpRequest) {
              xhr = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
              xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            // On définit l'appel de la fonction au retour serveur
            xhr.open("GET", "php/getimplant.php", false);
            xhr.send(null);
            xhr.responseText;
            var docXML= xhr.responseXML;
            var id_implant = docXML.getElementsByTagName("id");
            var url = docXML.getElementsByTagName("url");
            for (var i = 0; i < id_implant.length; i++) {
              if (id == id_implant.item(i).firstChild.data) {
                var url_ultime =  url.item(i).firstChild.data;
              }
            }
            return url_ultime;
          }

          function getImplantOffsetX() {
            var id = id_liste;
            console.log("id : ", id);
            var xhr;
            if (window.XMLHttpRequest) {
              xhr = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
              xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            // On définit l'appel de la fonction au retour serveur
            xhr.open("GET", "php/getimplant.php", false);
            xhr.send(null);
            xhr.responseText;
            var docXML= xhr.responseXML;
            var id_implant = docXML.getElementsByTagName("id");
            var distOffsetXBDD = docXML.getElementsByTagName("distOffsetX");
            for (var i = 0; i < id_implant.length; i++) {
              if (id == id_implant.item(i).firstChild.data) {
                var distOffsetXFinal =  distOffsetXBDD.item(i).firstChild.data;
              }
            }
            console.log("distOffsetXFinal : ", distOffsetXFinal);
            return distOffsetXFinal;
          }

          function getRoiCoordonnee()
          {
             var xhr;
             if (window.XMLHttpRequest) {
               xhr = new XMLHttpRequest();
             }
             else if (window.ActiveXObject) {
               xhr = new ActiveXObject("Microsoft.XMLHTTP");
             }
             // On définit l'appel de la fonction au retour serveur

             xhr.open("GET", "php/getdata.php", false);
             xhr.send(null);
             xhr.responseText;
             var docXML= xhr.responseXML;
             var x1 = docXML.getElementsByTagName("x1");
             var y1 = docXML.getElementsByTagName("y1");
             var x2 = docXML.getElementsByTagName("x2");
             var y2 = docXML.getElementsByTagName("y2"); 

             return {
              X1 : x1.item(0).firstChild.data,
              Y1 : y1.item(0).firstChild.data,
              X2 : x2.item(0).firstChild.data,
              Y2 : y2.item(0).firstChild.data
             }
          }

          function getCicleCoordonnee()
          {
             var xhr;
             if (window.XMLHttpRequest) {
               xhr = new XMLHttpRequest();
             }
             else if (window.ActiveXObject) {
               xhr = new ActiveXObject("Microsoft.XMLHTTP");
             }
             // On définit l'appel de la fonction au retour serveur

             xhr.open("GET", "php/getDataCircle.php", false);
             xhr.send(null);
             xhr.responseText;
             var docXML= xhr.responseXML;
             var x = docXML.getElementsByTagName("circleCenterX");
             var y = docXML.getElementsByTagName("circleCenterY");

             return {
              X : x.item(0).firstChild.data,
              Y : y.item(0).firstChild.data
             }
          }

          var canvas = document.getElementById("canvas");
          var canvasWidth = 900;
          var canvasHeight = 800;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          var ctx = canvas.getContext("2d");
          console.log(ctx);

          var w, h;
          var r = 0;
          var img = new Image;

           // On récupère le coefficient réducteur de l'image pour l'appliquer sur l'implant
           var coefImage = facteurRedimensionnementImage();

           var coefImplant = CoefRedimensionnementImplant(id_liste, "2.8");

           function MaxIdBis()
           {
            console.log("MaxIdBis");
             canvas.width = canvasWidth;
             canvas.height = canvasHeight;

             var roiCoordonnee = getRoiCoordonnee();

             console.log("this the Roi coordonnée "+ roiCoordonnee.X1+", "+roiCoordonnee.Y1+" et "+roiCoordonnee.X2+", "+roiCoordonnee.Y2);

             var circleCoordonnee = getCicleCoordonnee();

             console.log("this the Circle coordonnée "+ circleCoordonnee.X+", "+circleCoordonnee.Y);

            // function showCoords(event) {
           /*  canvas.width = canvas.width *2 ;
             canvas.height = canvas.height *2 ;*/
             var distOffsetX = getImplantOffsetX();
             var imagelayer = document.getElementById("dwv-imageLayer");
             var width = readCookie("width");
             var height = readCookie("height");
             var coord_global_x1 = (((roiCoordonnee.X1*imagelayer.width) / width)); //-((645)-(canvasWidth/2)));
             var coord_global_y1 = ((roiCoordonnee.Y1*imagelayer.height) / height); 
             var deltaY = roiCoordonnee.Y2-roiCoordonnee.Y1;
             console.log("deltaY ",deltaY);
             var deltaX = roiCoordonnee.X2-roiCoordonnee.X1;
             console.log("deltaX ",deltaX);
             //var hypotenus = Math.sqrt(Math.pow(X2-X1,2)+Math.pow(Y2-Y1,2));
             //console.log("hypotenus ",hypotenus);
             var tan = deltaX/deltaY
             console.log("tan ",tan);
             var atan = Math.atan(tan)*-1;
             console.log("atan ",atan);
             angleAlignement=atan 

             final_coord_global_x1=coord_global_x1-(distOffsetX*coefImplant*coefImage.coefWidth);
             final_coord_global_y1=coord_global_y1;
             coefDirecteur=deltaY/deltaX;

             var angleRad = 135 * Math.PI/180;
             //angleRad+=angleAlignement;
             var tanAngleRad = Math.tan(angleRad);

             var bonneHauteur = false;
             var b=(((roiCoordonnee.Y1-circleCoordonnee.Y)*imagelayer.height)/height)/2;//-final_coord_global_y1;
             console.log("imagelayer : ", imagelayer.width);
             console.log("width : ", width);
             console.log("circleCoordonnee.Y-roiCoordonnee.Y1 : ",roiCoordonnee.Y1-circleCoordonnee.Y)
             console.log("((circleCoordonnee.Y-roiCoordonnee.Y1)*imagelayer.width)/width : ", (((roiCoordonnee.Y1-circleCoordonnee.Y)*imagelayer.height)/height)/2);
             console.log("tanAngleRad ",tanAngleRad);
             console.log("circleCoordonnee.X : ",circleCoordonnee.X);
             console.log("circleCoordonnee.Y : ",circleCoordonnee.Y);
             console.log("Les cooordonnées ", final_coord_global_x1, final_coord_global_y1);
             console.log("b : ",b)
             final_coord_global_x1-=(b/coefDirecteur);
             final_coord_global_y1-=b;
                                
             ctx.save();
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             ctx.translate(final_coord_global_x1,final_coord_global_y1);
             ctx.rotate(angleAlignement);
             ctx.drawImage(img, 0, 0, img.width, img.height, -w / 2, -h / 2, w, h);
             ctx.restore();

             

              console.log("Les cooordonnées ", final_coord_global_x1, final_coord_global_y1);
              console.log("Image taille", img.width, "   ", img.height);
              dragger(false);
           }

           function MoveUpBis(value)
           {
            console.log("MoveUpBis");

                final_coord_global_x1-=(value/coefDirecteur);
                final_coord_global_y1-=value;
                
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(final_coord_global_x1,final_coord_global_y1);
                ctx.rotate(angleAlignement);
                ctx.drawImage(img, 0, 0, img.width, img.height, -w / 2, -h / 2, w, h);
                ctx.restore();              
           }

           function MoveDownBis(value)
           {
            console.log("MoveDownBis");

                final_coord_global_x1+=(value/coefDirecteur);
                final_coord_global_y1+=value;
                
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(final_coord_global_x1,final_coord_global_y1);
                ctx.rotate(angleAlignement);
                ctx.drawImage(img, 0, 0, img.width, img.height, -w / 2, -h / 2, w, h);
                ctx.restore();              
           }

           img.onload = function () {
             /*w = img.width * coef.coefWidth * 2.2;
             h = img.height * coef.coefHeight * 2.2;*/

             /*w = img.width * coefImage.coefWidth * 0.51;
             h = img.height * coefImage.coefHeight * 0.51;*/

             w = img.width * coefImage.coefWidth * coefImplant;
             h = img.height * coefImage.coefHeight * coefImplant;

            ctx.save();
            ctx.clearRect(0, 0, canvas.width,canvas.height);
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.drawImage(img, 0,0 , img.width, img.height, -w/2, -h/2 , w, h);
            ctx.restore();

            console.log("weSnap:", weSnap)
            if (weSnap==true)
            {
              MaxIdBis();
              if(mvtOffset>=0)
              {
                MoveUpBis(mvtOffset);
              }
              else
              {
                MoveDownBis(mvtOffset);
              }
            }
              
           }
           img.src = geturlimplant();

           // On ajoute un z-index pour avoir différentes couches et pour pouvoir tracer sur un implant
           document.getElementById("layerDialog").style.zIndex = "2";
            document.getElementById("canvas").style.zIndex = "2";
            document.getElementById("dwv-drawDiv").style.zIndex = "10";

    /// fonction pour le chargement de l'image et le dessin du petit rectangle bleu pour la rotation

           /*function draw() {
             ctx.clearRect(0, 0, canvas.width,canvas.height);
             drawRotationHandle(false);
             drawRect();
           }
           function drawRect() {
             ctx.save();
             ctx.translate(0,0);
             ctx.rotate(r);
             ctx.drawImage(img, 0, 0, img.width, img.height);
             ctx.restore();
           }
           function drawRotationHandle(withFill) {
             ctx.save();
             //ctx.translate(0, 0);
             ctx.translate(canvas.width/2,canvas.height/2);
             ctx.rotate(r);
             ctx.beginPath();
             ctx.moveTo(0, -1);
             ctx.lineTo(w / 2 + 20, -1);
             ctx.lineTo(w / 2 + 20, -7);
             ctx.lineTo(w / 2 + 30, -7);
             ctx.lineTo(w / 2 + 30, 7);
             ctx.lineTo(w / 2 + 20, 7);
             ctx.lineTo(w / 2 + 20, 1);
             ctx.lineTo(0, 1);
             ctx.closePath();
             if (withFill) {
               ctx.fillStyle = "blue";
               ctx.fill();
             }*/
             ctx.restore();

                 dragger(false);
/////////////////////////////////////////////////////////////////////////////////Button 1 déplacer////////////////////////////////////////////////////////////
           /// Opération sur le button 1 déplacement
           var element = document.getElementById("button1");
           element.addEventListener('click', function(){
               // Récupération de l'offset en jquery

             var canvasOffset = $("#canvas").offset();
               // Offset permet d'enregistrer le déplacement
             var offsetX = canvasOffset.left;
             var offsetY = canvasOffset.top;
             console.log(offsetX," je suis l'offset ",offsetY);
              /* canvas.width = canvasWidth;
               canvas.height= canvasHeight;*/
             dragger(false);
            /* var canvas = document.getElementById("canvas");
             var ctx = canvas.getContext("2d");*/
             ctx.restore();
           },false)

////////////////////////////////////////////////////////////////////////////////////Button 2 rotate///////////////////////////////////////////////////////////
          // Opération sur le button 2 rotate
          var element2 = document.getElementById("button2");
          element2.addEventListener('click', function() {
              // désactiver le mode draggable
              dragger(true);
              canvas.width = canvasWidth;
              canvas.height= canvasHeight;
              /*var canvas = document.getElementById("canvas");
              var ctx = canvas.getContext("2d");*/
              var canvasOffset = $("#canvas").offset();
              var offsetX = canvasOffset.left;
              var offsetY = canvasOffset.top;
              var isDown = false;
              var cx = canvas.width/2;
              var cy = canvas.height/2;
              var w;
              var h;
              var r = 0;

               w = img.width * coefImage.coefWidth * coefImplant;
               h = img.height * coefImage.coefHeight * coefImplant;
               draw();
               var canvasOffset = $("#canvas").offset();
               // Offset permet d'enregistrer le déplacement
               var offsetX = canvasOffset.left;
               var offsetY = canvasOffset.top;
             function draw() {
               ctx.clearRect(0, 0, canvas.width, canvas.height);
               drawRotationHandle(true);
               drawRect();
             }
             function drawRect() {
               ctx.save();
              //ctx.translate(img.width/2, img.height/2);
              ctx.translate(canvas.width/2 , canvas.height/2)
               //  ctx.translate( offsetX,offsetY);
               ctx.rotate(r);
               ctx.drawImage(img, 0,0 , img.width, img.height, -w / 2, -h/2 , w, h);
               ctx.restore();
             }
             function drawRotationHandle(withFill) {
               ctx.save();
               ctx.translate(canvas.width/2 , canvas.height/2);
               ctx.rotate(r);
               ctx.beginPath();
               ctx.moveTo(0, 1);
               ctx.lineTo(w / 2 + 10, -1);
               ctx.lineTo(w / 2 + 10, -7);
               ctx.lineTo(w / 2 + 20, -7);
               ctx.lineTo(w / 2 + 20, 7);
               ctx.lineTo(w / 2 + 10, 7);
               ctx.lineTo(w / 2 + 10, 1);
               ctx.lineTo(0, 1);
               ctx.closePath();
               if (withFill) {
                 ctx.fillStyle = "blue";
                 ctx.fill();
               }
               ctx.restore();
               ctx.save();
             }
             function handleMouseDown(e) {
               mouseX = parseInt(e.clientX - offsetX);
               mouseY = parseInt(e.clientY - offsetY);
               drawRotationHandle(false);
               isDown = ctx.isPointInPath(mouseX, mouseY);
               console.log(isDown);
             }
             function handleMouseUp(e) {
               isDown = false;
             }
             function handleMouseOut(e) {
               isDown = false;
             }
             function handleMouseMove(e) {
               if (!isDown) {
                 return;
               }
               mouseX = parseInt(e.clientX - offsetX);
               mouseY = parseInt(e.clientY - offsetY);
               var dx = mouseX - cx;
               var dy = mouseY - cy;
               r = Math.atan2(dy, dx);
               draw();
             }
             $("#canvas").mousedown(function (e) {
               handleMouseDown(e);
             });
             $("#canvas").mousemove(function (e) {
               handleMouseMove(e);
             });
             $("#canvas").mouseup(function (e) {
               handleMouseUp(e);
             });
             $("#canvas").mouseout(function (e) {
               handleMouseOut(e);
             });
           },false)

////////////////////////////////////////////////////////////////////////////////Button 3 Snap/////////////////////////////////////////////////////////////////
           /// 3ème button pour snap ( positionnement auto )
           var element = document.getElementById("button3");
           element.addEventListener('click', function(){
            // Fonction qui permet de récuperer l'id maximum de getdata et qui correspond à (x, y) du centre de l'axe du trapèze
            
             function MaxId() {
               weSnap=true;

               canvas.width = canvasWidth;
               canvas.height = canvasHeight;

               var roiCoordonnee = getRoiCoordonnee();

               console.log("this the Roi coordonnée "+ roiCoordonnee.X1+", "+roiCoordonnee.Y1+" et "+roiCoordonnee.X2+", "+roiCoordonnee.Y2);

               var circleCoordonnee = getCicleCoordonnee();

               console.log("this the Circle coordonnée "+ circleCoordonnee.X+", "+circleCoordonnee.Y);

              // function showCoords(event) {
             /*  canvas.width = canvas.width *2 ;
               canvas.height = canvas.height *2 ;*/
               var distOffsetX = getImplantOffsetX();
               var imagelayer = document.getElementById("dwv-imageLayer");
               var width = readCookie("width");
               var height = readCookie("height");
               var coord_global_x1 = (((roiCoordonnee.X1*imagelayer.width) / width)); //-((645)-(canvasWidth/2)));
               var coord_global_y1 = ((roiCoordonnee.Y1*imagelayer.height) / height); 
               var deltaY = roiCoordonnee.Y2-roiCoordonnee.Y1;
               console.log("deltaY ",deltaY);
               var deltaX = roiCoordonnee.X2-roiCoordonnee.X1;
               console.log("deltaX ",deltaX);
               //var hypotenus = Math.sqrt(Math.pow(X2-X1,2)+Math.pow(Y2-Y1,2));
               //console.log("hypotenus ",hypotenus);
               var tan = deltaX/deltaY
               console.log("tan ",tan);
               var atan = Math.atan(tan)*-1;
               console.log("atan ",atan);
               angleAlignement=atan 

               final_coord_global_x1=coord_global_x1-(distOffsetX*coefImplant*coefImage.coefWidth);
               final_coord_global_y1=coord_global_y1;
               coefDirecteur=deltaY/deltaX;

               var angleRad = 135 * Math.PI/180;
               //angleRad+=angleAlignement;
               var tanAngleRad = Math.tan(angleRad);

               var bonneHauteur = false;
               var b=(((roiCoordonnee.Y1-circleCoordonnee.Y)*imagelayer.height)/height)/2;//-final_coord_global_y1;
               console.log("imagelayer : ", imagelayer.width);
               console.log("width : ", width);
               console.log("circleCoordonnee.Y-roiCoordonnee.Y1 : ",roiCoordonnee.Y1-circleCoordonnee.Y)
               console.log("((circleCoordonnee.Y-roiCoordonnee.Y1)*imagelayer.width)/width : ", (((roiCoordonnee.Y1-circleCoordonnee.Y)*imagelayer.height)/height)/2);
               console.log("tanAngleRad ",tanAngleRad);
               console.log("circleCoordonnee.X : ",circleCoordonnee.X);
               console.log("circleCoordonnee.Y : ",circleCoordonnee.Y);
               console.log("Les cooordonnées ", final_coord_global_x1, final_coord_global_y1);
               console.log("b : ",b)
               final_coord_global_x1-=(b/coefDirecteur);
               final_coord_global_y1-=b;
                                  
               ctx.save();
               ctx.clearRect(0, 0, canvas.width, canvas.height);
               ctx.translate(final_coord_global_x1,final_coord_global_y1);
               ctx.rotate(angleAlignement);
               ctx.drawImage(img, 0, 0, img.width, img.height, -w / 2, -h / 2, w, h);
               ctx.restore();

               

                console.log("Les cooordonnées ", final_coord_global_x1, final_coord_global_y1);
                console.log("Image taille", img.width, "   ", img.height);
                dragger(false);
               //}
             };
             MaxId();
           },false)

          // Déplace la prothèse suivant l'axe centrale du trapèze vers le haut
          var PlusImplant = document.getElementById("+Implant");
          PlusImplant.addEventListener('click', function() {
              function MoveUP(value){

                final_coord_global_x1-=(value/coefDirecteur);
                final_coord_global_y1-=value;

                console.log("final_coord_global_y1 : ",final_coord_global_y1);

                mvtOffset-=value;

                console.log("mvtOffset : ",mvtOffset);                
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(final_coord_global_x1,final_coord_global_y1);
                ctx.rotate(angleAlignement);
                ctx.drawImage(img, 0, 0, img.width, img.height, -w / 2, -h / 2, w, h);
                ctx.restore();
              
              };
             MoveUP(2)
           },false)

          var MoinsImplant = document.getElementById("-Implant");
          MoinsImplant.addEventListener('click', function() {
              function MoveDown(value){
        
                final_coord_global_x1+=(value/coefDirecteur);
                final_coord_global_y1+=value;
                
                mvtOffset+=value;
                                
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(final_coord_global_x1,final_coord_global_y1);
                ctx.rotate(angleAlignement);
                ctx.drawImage(img, 0, 0, img.width, img.height, -w / 2, -h / 2, w, h);
                ctx.restore();
              
              };
             MoveDown(2);
           },false)

        }, true);
///////////////////////////////////////////////////////////////Selection des patients////////////////////////////////////////////
        var list2 = document.getElementById('list2');

        // Créer un message d'erreur si le patient n'est pas séléctionné !
        list2.addEventListener('change', function() {
          var idListe2 = list2.selectedIndex;
//////////////////////////////////////////////////////////////Button 4 "Export PDF"//////////////////////////////////////
          var element4 = document.getElementById("button4");
           element4.addEventListener('click', function() {
              function getPatient(idPatient) {
                console.log(idPatient);
                var xhr;
                if (window.XMLHttpRequest) {
                  xhr = new XMLHttpRequest();
                } 
                else if (window.ActiveXObject) {
                  xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.open("GET", "php/getPatient.php", false);
                xhr.send(null);
                xhr.responseText;
                var docXML = xhr.responseXML;
                var idPatientBDD = docXML.getElementsByTagName("ID");
                var nomPatientBDD = docXML.getElementsByTagName("Nom");
                var prenomPatientBDD = docXML.getElementsByTagName("Prenom");
                var vitalePatientBDD = docXML.getElementsByTagName("NVitale");

                for (var i=0; i < idPatientBDD.length; i++) {
                  if (idPatient == idPatientBDD.item(i).firstChild.data) {
                      var nomPatientFinal = nomPatientBDD.item(i).firstChild.data;
                      var prenomPatientFinal = prenomPatientBDD.item(i).firstChild.data;
                      var vitalePatientFinal = vitalePatientBDD.item(i).firstChild.data;
                  };
                };
                return nomPatientFinal + "_" + prenomPatientFinal + "_" + vitalePatientFinal;
              }
              
              function ExportPDF() {
                var imageLayer = document.getElementById("dwv-imageLayer");
                var divt = document.getElementById("layerDialog");
                
                var wImageLayer = imageLayer.width;
                var hImageLayer = imageLayer.height;
                console.log("image size ", wImageLayer, " - ", hImageLayer);

                var divLayer = document.getElementById("layerDialog");
                /*var wDivLayer = divLayer.width;
                var hDivLayer = divLayer.height;*/
                var wDivLayer = 1008;
                var hDivLayer = 826;
                console.log(hDivLayer + " - " + wDivLayer);

                var imageData = imageLayer.toDataURL("image/jpeg");
                var divData;
                var imageSerf = "data:image/jpeg;base64,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";
                html2canvas(divLayer, {
                  onrendered: function(canvas) {
                    document.body.appendChild(canvas);
                    console.log("draw canvas");
                    divData = canvas.toDataURL("image/jpeg");
                    console.log("divData1 = " + divData);
                    var now = new Date();
                    var nowMonth = now.getMonth() + 1;
                    console.log(now);

                    var docPDF = new jsPDF();
                    var idPatientLocal = idListe2;
                    var patientBDD = getPatient(idPatientLocal);
                    var patient = patientBDD.split('_');
                    console.log("imgData =" + imageData);
                    docPDF.setFontSize(12);
                    docPDF.addImage(imageSerf, 'JPEG', 15, 20, 45, 12);
                    docPDF.text(160, 30, now.getDate() + "/" + nowMonth + "/" + now.getFullYear());
                    docPDF.setFontType("bold");
                    docPDF.setFontSize(18);
                    docPDF.text(30, 50, "Planification pour la chirurgie de la hanche du patient :");
                    docPDF.setFontSize(12);
                    docPDF.setFontType("normal");
                    docPDF.text(15, 70, "Nom : " + patient[0]);
                    docPDF.text(15, 75, "Prénom : " + patient[1]);
                    docPDF.text(15, 80, "Numéro de carte vitale : " + patient[2]);
                    console.log("Nom : " + patient[0]);
                    console.log("Prénom : " + patient[1]);
                    console.log("Numéro de carte vitale : " + patient[2]);
                    
                    docPDF.setFontType("bold");
                    docPDF.text(15, 105, "Votre image DICOM d'origine :");
                    docPDF.addImage(imageData, 'JPEG', 15, 110, 180, ((180*hImageLayer)/wImageLayer));
                    console.log(hImageLayer + "  " + wImageLayer);
                    docPDF.addPage();
                    docPDF.text(15, 20, "Votre planification :");
                    docPDF.addImage(divData, 'JPEG', 15, 25, 180, ((180*hDivLayer)/wDivLayer));
                    console.log(hDivLayer + "  " + wDivLayer);
                    docPDF.save(patient[0]);
                  },
                  id: "toto"
                });
                var divDataOk = false;
              };
              ExportPDF();
            },false)
        },true)


    });

