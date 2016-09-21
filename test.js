var Chat = {
    connection: null,

    jid_to_id: function (jid) {
        return Strophe.getBareJidFromJid(jid)
            .replace(/@/g, "-")
            .replace(/\./g, "-");
    },

    on_roster: function (iq) {
        $(iq).find('item').each(function () {
            var jid = $(this).attr('jid');
            var name = $(this).attr('name') || jid;
            var jid_id = Chat.jid_to_id(jid);
            var contact = "<div class='Cont' style='border: 1px solid #1a1d35'>" +
                "<div class='roster-name'>" + name +"</div>"+
                "<div class='roster-jid'>"+jid+"</div>"
                "</div>";
            $('#ContactList').append(contact);
        });
//        Chat.connection.addHandler(Chat.on_presence, null, "presence");
        Chat.connection.send($pres());
    },

    on_message: function (message) {
        var full_jid = $(message).attr('from');
        var jid = Strophe.getBareJidFromJid(full_jid);
        var jid_id = Chat.jid_to_id(jid);

        //this part is for writing event
//        var composing = $(message).find('composing');
//        if (composing.length > 0) {
//            $('#chat-' + jid_id + ' .chat-messages').append(
//                "<div class='chat-event'>" +
//                    Strophe.getNodeFromJid(jid) +
//                    " is typing...</div>");
//
//            Chat.scroll_chat(jid_id);
//        }

        var body = $(message).find("html > body");

        if (body.length === 0) {
            body = $(message).find('body');
            if (body.length > 0) {
                body = body.text();
            } else {
                body = null;
            }
        }else {
            body = body.contents();

            var span = $("<span></span>");
            body.each(function () {
                if (document.importNode) {
                    $(document.importNode(this, true)).appendTo(span);
                } else {
                    // IE workaround
                    span.append(this.xml);
                }
            });
            body = span;
        }

        if (body) {
            $('#ReceiveMessage').append("<br>"+jid+ "<br>"+body+"<br>");
        }
        return true;
    }
}
//end of chat

$(document).ready(function(){
    var SendToJid=null;
    $('#LogIn').click(function(){
        $(document).trigger('connect', {
            jid: $('#UserName').val().toLowerCase(),
            password: $('#Password').val()
        });
    });

    $('.Cont').live('click', function () {
        var jid = $(this).find(".roster-jid").text();
        var name = $(this).find(".roster-name").text();
        var jid_id = Chat.jid_to_id(jid);
        $('#ReceiveMessage').html('Chat with ' + name);
        SendToJid=jid;
    });

    $('#Message').live('keypress', function (ev) {
        if (ev.which === 13) {
            ev.preventDefault();
            var body = $(this).val();
            var message = $msg({to: SendToJid,
                "type": "chat"})
                .c('body').t(body).up()
                .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
            Chat.connection.send(message);
            $('#ReceiveMessage').append("me <br>"+body+"<br>");
            $(this).val('');
        }
    });
});

$(document).bind('connect', function (ev, data) {
    var conn = new Strophe.Connection(
        "http://ositcom.net:5280/http-bind");
    conn.connect(data.jid, data.password, function (status) {
        alert(data.jid+"_"+data.password);
        if (status === Strophe.Status.CONNECTED) {
            $("#ReceiveMessage").append("connected");
            $("#ContactList").append("Loading Contacts<br>");
            $(document).trigger('connected');
        } else if (status === Strophe.Status.DISCONNECTED) {
            $("#ReceiveMessage").append("disconnected");
            $(document).trigger('disconnected');
        }
    });
    Chat.connection = conn;
});

//send iq request to the server to return the user contacts
$(document).bind('connected', function () {
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});

    Chat.connection.sendIQ(iq, Chat.on_roster);

//    Chat.connection.addHandler(Chat.on_roster_changed,
//        "jabber:iq:roster", "iq", "set");
    Chat.connection.addHandler(Chat.on_message,
        null, "message", "chat");
});

$(document).bind('disconnected', function () {
    Chat.connection = null;
    Chat.pending_subscriber = null;
    $('#roster-area ul').empty();
    $('#chat-area ul').empty();
    $('#chat-area div').remove();
    $('#login_dialog').dialog('open');
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        $('#ReceiveMessage').append("<div class='name'>Me</div><div class='SndMsg'>"+$('#TextAreaMsg').val()+"</div>");
        $('#TextAreaMsg').val("");
    }
});
