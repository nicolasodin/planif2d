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

//on connecte a la BDD
$dbhost="localhost";
$dbuser="root";
$dbpass="";



$dblink=mysql_connect($dbhost,$dbuser,$dbpass);
mysql_select_db("planif2d",$dblink);

//on lance la requete

$query = "SELECT * FROM coordonee WHERE id = ( SELECT MAX(id) FROM coordonee )";
$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

//On boucle sur le resultat
while ($row = mysql_fetch_array($result, MYSQL_NUM))
{
    echo "<x>" . $row[1] . "</x>\n";
    echo "<y>" . $row[2] . "</y>\n";
}
echo "</exemple>\n";
mysql_close($dblink);

?>