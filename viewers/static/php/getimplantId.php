<?php
	session_start(); // On d�marre la session AVANT toute chose

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	$id = $_GET["idImp"];
	include('connexion.php');

	// On lance la requ�te
	// Si le GET est vide, on r�cup�re toutes les donn�es de tous les implants
	// Sinon si on a un GET on r�cup�re les donn�es de l'id d�finit dans le GET
	$query = "SELECT * FROM implant WHERE id=".$id."";
	$result = mysql_query($query, $dblink) or die (mysql_error($dblink));
	
	// On boucle sur le r�sultat
	while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
	    echo "<id>" . $row[0] . "</id>\n";
	    echo "<nom>" . $row[1] . "</nom>\n";
	    echo "<url>" . $row[2] . "</url>\n";
	    echo "<widthPx>" . $row[3] . "</widthPx>\n";
	    echo "<widthCm>" . $row[4] . "</widthCm>\n";
	    echo "<heightPx>" . $row[5] . "</heightPx>\n";
	    echo "<heightCm>" . $row[6] . "</heightCm>\n";
	}
	echo "</exemple>\n";
	
	include('deconnexion.php');
?>