<?php
	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	// Il faut récupèrer x2, y2
	$x1 = $_POST['x1'];
	$y1 = $_POST['y1'];
	$x2 = $_POST['x2'];
	$y2 = $_POST['y2'];
// Il faut reprendre l'insertion des données

	// On lance la requête
	$query = "INSERT INTO coordonnee VALUES ('$id','$x1','$y1','$x2','$y2')";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

	echo "</exemple>\n";

	include('deconnexion.php');
?>
