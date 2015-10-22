<?php
	session_start();

	header('Content-Type: text/xml');
	echo "<?xml version=\"1.0\"?>\n";
	echo "<exemple>\n";

	//on connecte a la BDD
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="";

	$nomScene = $_SESSION['nomScene'];

	$dblink=mysql_connect($dbhost,$dbuser,$dbpass);
	mysql_select_db("planif2d",$dblink);

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
	mysql_close($dblink);
?>