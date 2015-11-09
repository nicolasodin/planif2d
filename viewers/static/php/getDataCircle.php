<?php
	session_start(); // On démarre la session AVANT toute chose

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	// On lance la requête
	$query = "SELECT * FROM coordonnee_cercle WHERE id = (SELECT MAX(id) FROM coordonnee_cercle)";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

	// On boucle sur le résultat
	while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
		echo "<circleCenterX>" . $row[1] . "</circleCenterX>\n";
		echo "<circleCenterY>" . $row[2] . "</circleCenterY>\n";

	}
	echo "</exemple>\n";
	
	include('deconnexion.php');
?>