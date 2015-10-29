<?php
/**
 * Created by PhpStorm.
 * User: Karrach
 * Date: 14/10/2015
 * Time: 14:12
 */
	session_start(); // On démarre la session AVANT toute chose

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	// On lance la requête
	$query = "SELECT * FROM coordonee WHERE id = ( SELECT MAX(id) FROM coordonnee)";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

	// On boucle sur le resultat
	while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
		echo "<x>" . $row[1] . "</x>\n";
		echo "<y>" . $row[2] . "</y>\n";
	}
	echo "</exemple>\n";
	
	include('deconnexion.php');
?>