<?php
/**
 * Created by PhpStorm.
 * User: Houssam
 * Date: 15/10/2015
 * Time: 14:26
 */

	session_start(); // On démarre la session AVANT toute chose

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	//on se connecte à la BDD
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="";

	$dblink=mysql_connect($dbhost,$dbuser,$dbpass);
	mysql_select_db("planif2d",$dblink);

	// On lance la requête
	$query = "SELECT * FROM implant ";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

	// On boucle sur le resultat
	while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
	    echo "<id>" . $row[0] . "</id>\n";
	    echo "<url>" . $row[2] . "</url>\n";
	}
	echo "</exemple>\n";
	mysql_close($dblink);
?>