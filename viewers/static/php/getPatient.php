<?php
	session_start();

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	include('connexion.php');

	$nomScene = $_SESSION['nomScene'];

	$query="SELECT * FROM patients";
	$result=mysql_query($query,$dblink) or die (mysql_error($dblink));
	while ($row = mysql_fetch_array($result, MYSQL_NUM))
	{
	    echo "<Nom>" . $row[0] . "</Nom>\n";
	    echo "<Prenom>" . $row[1] . "</Prenom>\n";
	    echo "<NVitale>" . $row[2] . "</NVitale>\n";
	    echo "<ID>" . $row[3] . "</ID>\n";
	}
	echo "</exemple>\n";
	
	include('deconnexion.php');
?>