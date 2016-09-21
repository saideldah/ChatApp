<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
    <title>osiChat - Chapter 6</title>

    <link rel='stylesheet' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.0/themes/cupertino/jquery-ui.css'>
    <script src='http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js'></script>
    <script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.js'></script>
    <script src='scripts/strophe.js'></script>
    <script src='scripts/flXHR.js'></script>
    <script src='scripts/strophe.flxhr.js'></script>

    <link rel='stylesheet' href='osiChat.css'>
    <script src='osiChat.js'></script>
</head>
<body>
<div id="container">
    <div id="header">
        <img src="top.jpg" alt="osiChat">
    </div>
    <div id='toolbar'>
        <span class='button' id='new-contact'>add contact...</span> ||
        <span class='button' id='new-chat'>chat with...</span> ||
        <span class='button' id='disconnect'>disconnect</span>
    </div>
    <div id='chat-area'>
        <ul></ul>
    </div>

    <div id='roster-area'>
        <ul></ul>
    </div>

    <!-- login dialog -->
    <div id='login_dialog' class='hidden'>
        <label>JID:</label><input type='text' id='jid' required>
        <label>Password:</label><input type='password' id='password' required>
    </div>

    <!-- contact dialog -->
    <div id='contact_dialog' class='hidden'>
        <label>JID:</label><input type='text' id='contact-jid'>
        <label>Name:</label><input type='text' id='contact-name'>
    </div>

    <!-- chat dialog -->
    <div id='chat_dialog' class='hidden'>
        <label>JID:</label><input type='text' id='chat-jid'>
    </div>

    <!-- approval dialog -->
    <div id='approve_dialog' class='hidden'>
        <p><span id='approve-jid'></span> has requested a subscription
            to your presence.  Approve or deny?</p>
    </div>
</div>

<!--end of container div-->
</body>
</html>
