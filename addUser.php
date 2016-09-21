<?php
/**
 * Created by PhpStorm.
 * User: Saeed Eldah
 * Date: 12/02/14
 * Time: 02:08 م
 */
include_once('Net/SFTP.php');
include_once "Net/SSH2.php";
$username = "ssssssssssss";
$password = "testerspassword";
$node = "ositcom.net";
$SSH = new Net_SSH2("helix.ositcom.net","22");
// Connect to remote device
if (!($SSH->login("root","EMILEelliye@)!!")))
{
    printf("Failed to connect to remote device\n");
    exit(1);
}
// Set timeout
$SSH->setTimeout(5);
// Check /bin/bash file is present (it should be)
//$Result=$SSH->_initShell();
$query = "echo 'EMILEelliye@)!!' | sudo -u ejabberd /usr/sbin/ejabberdctl register ".$username." ".$node." ".$password." 2>&1";
//echo($query."<br>");
$Result=$SSH->exec($query);
$Result=trim($Result,"\n\r");
echo($Result);
/*if($output == 0){
    echo "done";
}
else{
    // Failure, $output has the details
    echo "<pre>";
    foreach($output as $o)
    {
        echo $o."\n";
    }
    echo "</pre>";
}*/