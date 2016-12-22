<?php
$myFile = "tables/" . $_POST["name"];
if($_POST["type"] == "text"){
    $myFile .= ".txt";
}else {
    $myFile .= ".json";
}
if ($fh = fopen($myFile, 'w')) {
    $stringData = $_POST["data"];
    fwrite($fh, $stringData);
    fclose($fh);
    echo("Saved " . $myFile . " successfully");
} else {
    echo("File Saving failed.");
    die("Can not open " . $myFile);
}
?>