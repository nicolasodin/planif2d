<?php
	session_start(); // On démarre la session AVANT toute chose

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	$query = "SELECT * FROM implant";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));
	
	// On boucle sur le résultat
	while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
	    echo "<id>" . $row[0] . "</id>\n";
	    echo "<nom>" . $row[1] . "</nom>\n";
	    echo "<url>" . $row[2] . "</url>\n";
	    echo "<widthPx>" . $row[3] . "</widthPx>\n";
	    echo "<widthCm>" . $row[4] . "</widthCm>\n";
	    echo "<heightPx>" . $row[5] . "</heightPx>\n";
	    echo "<heightCm>" . $row[6] . "</heightCm>\n";
	    echo "<distOffsetX>" . $row[15] . "</distOffsetX>\n";
	}
	echo "</exemple>\n";
	
	include('deconnexion.php');
?>