<?php
	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	$x = $_POST['x'];
	$y = $_POST['y'];

	// On lance la requête
	$query = "INSERT INTO coordonnee_cercle VALUES ('$id','$x','$y')";
	$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

	echo "</exemple>\n";

	include('deconnexion.php');
?>
