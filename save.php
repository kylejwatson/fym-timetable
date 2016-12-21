<?php
$myfile = fopen("temppassfile.txt", "r") or die("Unable to open file!");
$password = fgets($myfile);
fclose($myfile);
/*$myFile = $_POST["name"] . ".json";

if($fh = fopen($myFile, 'w')){
    $stringData = $_POST["data"];
    fwrite($fh, $stringData);
    fclose($fh);
    echo("Saved " . $myFile . " successfully");
}else{
    echo("File Saving failed.");
    die("Can not open " . $myFile);
}*/
$servername = "stc905.edu.csesalford.com";
$username = "stc905";
$dbname = "stc905_fym-timetable";
$tablename = str_replace('.', '_', $_POST["name"]);
$tablename = str_replace('-', '_', $tablename);
echo $tablename;

$sql = "CREATE TABLE $tablename (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    reg_date TIMESTAMP
    )";
// Create connection
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";

    // use exec() because no results are returned
    $conn->exec($sql);
    echo "Table $tablename created successfully";
    $conn = null;
}
catch(PDOException $e)
{
    echo $sql . "<br>" . $e->getMessage();
}

?>