<?php
$servername = "stc905.edu.csesalford.com";
$username = "stc905";
$password = "supersecretpassword";
$dbname = "stc905_fym-timetable";

$name = $_POST["name"];
$data = $_POST["data"];
$mirrorDate = $_POST["mirror"];
$tableName = "timetables";

$sql = "INSERT INTO $tableName (idString,data,mirrorDate) VALUES('$name','$data','$mirrorDate')";
// Create connection
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";

    // use exec() because no results are returned
    $conn->exec($sql);
    $conn = null;
}
catch(PDOException $e)
{
    echo $sql . "<br>" . $e->getMessage();
}
?>