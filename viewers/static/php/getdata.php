<?php
	session_start(); // On démarre la session AVANT toute chose

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	// On lance la requête
	$query = "SELECT * FROM coordonnee WHERE id = (SELECT MAX(id) FROM coordonnee)";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

	// On boucle sur le résultat
	while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
		echo "<x1>" . $row[1] . "</x1>\n";
		echo "<y1>" . $row[2] . "</y1>\n";
		echo "<x2>" . $row[3] . "</x2>\n";
		echo "<y2>" . $row[4] . "</y2>\n";
		echo "<circleCenterX>" . $row[5] . "</circleCenterX>";
		echo "<circleCenterY>" . $row[6] . "</circleCenterY>";

	}
	echo "</exemple>\n";
	
	include('deconnexion.php');
?>