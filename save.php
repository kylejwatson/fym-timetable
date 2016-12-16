<?php
$myFile = "general.json";
$fh = fopen($myFile, 'w') or die("cant open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
fclose($fh);
?>