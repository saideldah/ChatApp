<?php
/**
 * Created by PhpStorm.
 * User: Saeed Eldah
 * Date: 12/02/14
 * Time: 02:08 م
 */
require_once 'Config.php';
include_once 'Net/SFTP.php';
include_once 'Net/SSH2.php';
$username = $_POST['FirstName'].$_POST['LastName'];
$username = strtolower($username);
$password = "ositcom";
$node = "ositcom.net";
$con=mysqli_connect(DataBase::Host,DataBase::UserName,DataBase::Password,DataBase::DataBaseName);
// Check connection
if (mysqli_connect_errno()){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,"SELECT count(*) as c FROM guestaccount WHERE JID='".$username."@ositcom.net");

while($row = mysqli_fetch_array($result)){
$Count=$row['c'] ;
}
mysqli_close($con);
if($Count>0){
    //i am here :PPPPPPPPP
    //redirect to chat page
    //header( 'Location: http://www.yoursite.com/ChatForm.php?' ) ;
}else{
    //regester
    $SSH = new Net_SSH2("helix.ositcom.net","22");
    if (!($SSH->login("root","EMILEelliye@)!!"))){
        printf("Failed to connect to remote device\n");
        exit(1);
    }
    $SSH->setTimeout(5);
    $Result=$SSH->exec($query);
    $arr=explode(" ", $Result);
    $done=false;
    for($i=0; $i<count($arr); $i++){
        if($arr[$i]=="successfully"){
            $done = true;
        }
    }
    if($done){
        $result = mysqli_query($con,"INSERT INTO guestaccount (JID,Password) VALUES ('".$username."@ositcom.net','".$password."');");
        //redirect to chat page
    }
    else{
        echo $_POST['FirstName']." already registered";
    }
}
