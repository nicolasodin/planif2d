
      // Taille de l'ecran
      console.log("Body taille ",window.innerWidth  ,window.innerHeight  );
      // coordonnée de la sourie
      function showCoords(event) {
        var x = event.clientX;
        var y = event.clientY;
        console.log(x,"^^",y);
      // Début de la fonction principale
      }
      $(function() {
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
           canvas1.style.zIndex = "500" ;
           var canvas2 = document.getElementById("dwv-imageLayer") ;
           canvas2.zIndex = "80" ;
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
           }
           img.src = geturlimplant();

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
      /////////////////////////////////////////////////////////////////////////////////Button 1 déplacer ///////////////////////////////////////////////////////
           /// Opération sur le button 1 déplacement
           var element = document.getElementById("button1");
           element.addEventListener('click', function(){
               // Récupération de l'offset en jquery

             var canvasOffset = $("#canvas").offset();
               // Offset permet d'enregistrer le déplacement
             var offsetX = canvasOffset.left ;
             var offsetY = canvasOffset.top   ;
             console.log(offsetX," je suis l'offset ",offsetY);
              /* canvas.width = canvasWidth;
               canvas.height= canvasHeight;*/
             dragger(false);
            /* var canvas = document.getElementById("canvas");
             var ctx = canvas.getContext("2d");*/
             ctx.restore();

           },false)
////////////////////////////////////////////////////////////////////////////////////Button2 rotate//////////////////////////////////////////////////////////
           // opération sur le button 2 rotate
           var element2 = document.getElementById("button2");
           element2.addEventListener('click', function(){
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
              var cx = canvas.width /2 ;
              var cy = canvas.height / 2;
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
///////////////////////////////////////////////////////// Button 3 Snap //////////////////////////////////////////////////////////////////////////////////
           ///  3eme button pour snap ( positionnement auto )
           var element = document.getElementById("button3");
           element.addEventListener('click', function(){
            // Fonction qui permet de récuperer l'id maximum de getdata et qui correspond à (x, y) du centre de l'axe du trapèze
             function MaxId() {
               var xhr;
               canvas.width = canvasWidth;
               canvas.height= canvasHeight;
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
               // On ajoute x2, y2
               var x2 = docXML.getElementsByTagName("x2");
               var y2 = docXML.getElementsByTagName("y2");

               // Il faut changer le nom des variables !!!
               var X1 = x1.item(0).firstChild.data;
               var Y1 = y1.item(0).firstChild.data;
               var X2 = x2.item(0).firstChild.data;
               var Y2 = y2.item(0).firstChild.data;
               console.log("this the max id coordonnée "+X1+","+Y1+" et "+X2+","+Y2);
              // function showCoords(event) {
             /*  canvas.width = canvas.width *2 ;
               canvas.height = canvas.height *2 ;*/

               var imagelayer = document.getElementById("dwv-imageLayer");
               var width = readCookie("width");
               var height = readCookie("height");
               var coord_global_x1 = ( X1 * 645); // width;
               var coord_global_y1 = ( Y1 * 2000 ); // height;
               // Démonstration
               /*  var houss1 = ( X * 1078) /3264 ;
               var houss2 = ( Y * 806) / 2448;*/
              /* var canvas = document.getElementById("canvas");
               var ctx = canvas.getContext("2d");*/
               ctx.save();

               //canvas.width = canvas.width;
               //canvas.height = canvas.height;

               ctx.clearRect(0, 0, canvas.width, canvas.height);
               ctx.translate(coord_global_x1,coord_global_y1);
               ctx.drawImage(img, 0,0, img.width, img.height, -w / 2, -h / 2, w, h);
               ctx.restore();
               //
                console.log("les cooordonnées " , coord_global_x1, coord_global_y1);
                console.log("image taille", img.width, "   ", img.height);
                dragger(false);
               //}
             };
             MaxId();
           },false)
        }, true);
///////////////////////////////////////////////////////////////Select Patients////////////////////////////////////////////
        var list2 = document.getElementById('list2');

        list2.addEventListener('change',function() {
          var idListe2 = list2.selectedIndex;
//////////////////////////////////////////////////////////////Button 4 "Export PDF"//////////////////////////////////////
          var element4=document.getElementById("button4");
          element4.addEventListener('click', function() {
              function getPatient(idPatient) {
                console.log(idPatient);
                var xhr;
                if (window.XMLHttpRequest) {
                  xhr = new XMLHttpRequest();
                }
                else if (window.ActiveXObject) {
                  xhr=new ActiveXObject("Microsoft.XMLHTTP");
                }

                xhr.open("GET", "php/getPatient.php", false);
                xhr.send(null);
                xhr.responseText;
                var docXML = xhr.responseXML;
                var idPatientBDD = docXML.getElementsByTagName("ID");
                var nomPatientBDD = docXML.getElementsByTagName("Nom");
                var prenomPatientBDD = docXML.getElementsByTagName("Prenom");
                var vitalePatientBDD = docXML.getElementsByTagName("NVitale");

                for (var i = 0; i < idPatientBDD.length; i++) {
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
                var canvasLayer = document.getElementById("canvas");

                var wImageLayer=imageLayer.width;
                var hImageLayer=imageLayer.height;
                console.log("image size ",wImageLayer,"   ", hImageLayer);

                var wCanvasLayer=canvasLayer.width;
                var hCanvasLayer=canvasLayer.height;
                console.log("Canvas size ",wCanvasLayer,"   ", hCanvasLayer);

                var imageData = imageLayer.toDataURL("image/jpeg");
                var canvasData = canvasLayer.toDataURL("image/png");

                var docPDF = new jsPDF();
                var idPatientLocal = idListe2;
                var patientBDD = getPatient(idPatientLocal);
                var patient = patientBDD.split('_');
                console.log(imageData);
                docPDF.setFontSize(20);
                docPDF.text(15,30,"Nom : " + patient[0]);
                docPDF.text(15,40,"Prénom : " + patient[1]);
                docPDF.text(15,50,"Numéro de carte vitale : " + patient[2]);
                console.log("Nom : " + patient[0]);
                console.log("Prénom : " + patient[1]);
                console.log("Numéro de carte vitale : " + patient[2]);
                docPDF.addImage(imageData,'JPEG', 15, 60, 180, ((180*hImageLayer) / wImageLayer));
                docPDF.addPage();
                docPDF.addImage(imageData,'JPEG', 15, 60, 180, ((180*hImageLayer) / wImageLayer));
                docPDF.addImage(canvasData,'PNG', 15, 60, 180, ((180*hCanvasLayer) / wCanvasLayer));
                //docPDF.addImage(canvasData,'PNG', (15-(((wCanvasLayer-wImageLayer)*180)/wImageLayer)), (60-(((wCanvasLayer-wImageLayer)*((180*hCanvasLayer)/wCanvasLayer)))/wImageLayer), 180, ((180*hCanvasLayer)/wCanvasLayer));
                docPDF.save(patient[0]);
              };

              ExportPDF();
          },false)
        },true)
      });

