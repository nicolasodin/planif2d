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

include('connexion.php');

$x = $_POST['x'];
$y = $_POST['y'];

//on lance la requete
$query = "INSERT INTO coordonnee VALUES ('$id','$x','$y')";
$result = mysql_query($query,$dblink) or die (mysql_error($dblink));

echo "</exemple>\n";

include('deconnexion.php');
?>
