<?php
	// On se connecte à la BDD
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="";

	$dblink=mysql_connect($dbhost,$dbuser,$dbpass);
	mysql_select_db("planif2d",$dblink);
?>