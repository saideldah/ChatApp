<?php

// activate full error reporting
//error_reporting(E_ALL & E_STRICT);

include 'XMPPHP/XMPP.php';

$conn = new XMPPHP_XMPP('www.ositcom.net', 5222, 'saeed.e@ositcom.net', 'ositcom', 'xmpphp', 'ositcom.net', $printlog=False, $loglevel=XMPPHP_Log::LEVEL_INFO);
//$conn = new XMPPHP_XMPP('talk.google.com', 5222, 'saeed.eldah@gmail.com', 'EmadSamiragoogle', 'xmpphp', 'gmail.com', $printlog=False, $loglevel=XMPPHP_Log::LEVEL_INFO);
$conn->connect();
$payloads=$conn->processUntil(array('message', 'presence', 'end_stream', 'session_start'));
//for($i=0; $i<10;$i++){
    //$conn->message('amer.k@ositcom.net', "looser _|_");
//    echo $conn->roster->getPresence('amer.kawarit@gmail.com')['status']."<br>";
//    echo $conn->roster->getPresence('amer.kawarit@gmail.com')['show']."<br>";
//    echo $conn->roster->getPresence('amer.kawarit@gmail.com')['resource']."<br>";
//}
    $Roster=new Roster();
    echo $Roster->getPresence1('amer.kawarit@gmail.com')['status']."<br>";
    echo $Roster->getPresence1('amer.kawarit@gmail.com')['show']."<br>";
    echo $Roster->getPresence1('amer.kawarit@gmail.com')['resource']."<br>";
//if(!$conn->isDisconnected()) {
//    $stanza="<iq from='saeed.e@ositcom.net'
//    to='amer.k@ositcom.net' type='get' id='e2e1'>
//    <ping xmlns='urn:xmpp:ping'/>
//    </iq>";
    //amer.k@ositcom.net
    //salim.m
    //e.emile
    //rima.t@ositcom.net
//    $stanza="<iq from='saeed.e@ositcom.net'
//    to='amer.k@ositcom.net' type='get' id='e2e1'>
//    <ping xmlns='urn:xmpp:ping'/>
//    </iq>";
//    echo $conn->presence("am online");
//}
//else{
//    echo "not connected";
//}
//while(!$conn->isDisconnected()) {
//    $payloads = $conn->processUntil(array('message', 'presence', 'end_stream', 'session_start'));
//    foreach($payloads as $event) {
//        $pl = $event[1];
//        switch($event[0]) {
//            case 'message':
//                print "---------------------------------------------------------------------------------\n";
//                print "Message from: {$pl['from']}\n";
//               // if($pl['subject']) print "Subject: {$pl['subject']}<br>\n";
//                print $pl['body'] . "<br>\n";
//                print "---------------------------------------------------------------------------------\n";
//                $conn->message($pl['from'], $body="Thanks for sending me \"{$pl['body']}\".", $type=$pl['type']);
//                if($pl['body'] == 'quit') $conn->disconnect();
//                if($pl['body'] == 'break') $conn->send("</end>");
//                break;
//            case 'presence':
//                print "Presence: {$pl['from']} [{$pl['show']}] {$pl['status']}\n<br>";
//                break;
//            case 'session_start':
//                $conn->presence($status="Cheese!");
//                break;
//        }
//    }
//}

$conn->disconnect();
