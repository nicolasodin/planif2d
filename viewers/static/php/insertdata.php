<?php
	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	// Il faut récupèrer x2, y2
	$x = $_POST['x'];
	$y = $_POST['y'];

// Il faut reprendre l'insertion des données

	// On lance la requête
	$query = "INSERT INTO coordonnee VALUES ('$id','$x','$y')";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

	echo "</exemple>\n";

	include('deconnexion.php');
?>
