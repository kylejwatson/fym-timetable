<?php
/**
 * Created by PhpStorm.
 * User: kyle
 * Date: 23/12/16
 * Time: 15:02
 */
$servername = "stc905.edu.csesalford.com";
$username = "stc905";
$password = "supersecretpassword";
$dbname = "stc905_fym-timetable";

$name = $_POST["name"];
$tableName = "timetables";

$sql = "SELECT data FROM $tableName WHERE idString = '$name'";
// Create connection
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // use exec() because no results are returned
    foreach ($conn->query($sql) as $row) {
        echo $row['data'];
    }
}
catch(PDOException $e)
{
    echo $sql . "<br>" . $e->getMessage();
}
?>