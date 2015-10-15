<?php
/**
 * Created by PhpStorm.
 * User: Houssam
 * Date: 14/10/2015
 * Time: 12:18
 */
header('Content-Type: text/xml');
echo "<?xml version=\"1.0\"?>\n";
echo "<exemple>\n";

//on connecte a la BDD
$dbhost="localhost";
$dbuser="root";
$dbpass="";


$x = $_POST['x'];
$y = $_POST['y'];


$dblink=@mysql_connect($dbhost,$dbuser,$dbpass);
mysql_select_db("planif2d",$dblink);

//on lance la requete
$query = "INSERT INTO coordonee VALUES ('$id','$x','$y')";
$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

echo "</exemple>\n";
mysql_close($dblink);



?>
