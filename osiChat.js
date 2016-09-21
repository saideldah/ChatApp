var Gab = {
    //this variable to save the connection to ejabberd server
    connection: null,

    jid_to_id: function (jid) {

        /** Function: getBareJidFromJid
         *  Get the bare JID from a JID String.
         *
         *  Parameters:
         *    (String) jid - A JID.
         *
         *  Returns:
         *    A String containing the bare JID.
         *    getBareJidFromJid: function (jid)
         */
        return Strophe.getBareJidFromJid(jid)
            .replace(/@/g, "-")
            .replace(/\./g, "-");
    },

    on_roster: function (iq) {
        $(iq).find('item').each(function () {
            var jid = $(this).attr('jid');
            var name = $(this).attr('name') || jid;

            // transform jid into an id
            var jid_id = Gab.jid_to_id(jid);

            var contact = $("<li id='" + jid_id + "'>" +
                            "<div class='roster-contact offline'>" +
                            "<div class='roster-name'>" +
                            name +
                            "</div><div class='roster-jid'>" +
                            jid +
                            "</div></div></li>");

            Gab.insert_contact(contact);
        });

        /** Function: addHandler
         *  Add a stanza handler for the connection.
         *
         *  This function adds a stanza handler to the connection.  The
         *  handler callback will be called for any stanza that matches
         *  the parameters.  Note that if multiple parameters are supplied,
         *  they must all match for the handler to be invoked.
         *
         *  The handler will receive the stanza that triggered it as its argument.
         *  The handler should return true if it is to be invoked again;
         *  returning false will remove the handler after it returns.
         *
         *  As a convenience, the ns parameters applies to the top level element
         *  and also any of its immediate children.  This is primarily to make
         *  matching /iq/query elements easy.
         *
         *  The options argument contains handler matching flags that affect how
         *  matches are determined. Currently the only flag is matchBare (a
         *  boolean). When matchBare is true, the from parameter and the from
         *  attribute on the stanza will be matched as bare JIDs instead of
         *  full JIDs. To use this, pass {matchBare: true} as the value of
         *  options. The default value for matchBare is false.
         *
         *  The return value should be saved if you wish to remove the handler
         *  with deleteHandler().
         *
         * function (handler, ns, name, type, id, from, options)
         *  Parameters:
         *    (Function) handler - The user callback.
         *    (String) ns - The namespace to match.
         *    (String) name - The stanza name to match.
         *    (String) type - The stanza type attribute to match.
         *    (String) id - The stanza id attribute to match.
         *    (String) from - The stanza from attribute to match.
         *    (String) options - The handler options
         *
         *  Returns:
         *    A reference to the handler that can be used to remove it.
         */
        // update the list of contacts accordingly. The following code should be added to the Gabobject:
        // set up presence handler and send initial presence
        //Gab.connection.addHandler(handler, ns, StanzaName);
        Gab.connection.addHandler(Gab.on_presence, null, "presence");
        /** Function: send
         *  Send a stanza.
         *
         *  This function is called to push data onto the send queue to
         *  go out over the wire.  Whenever a request is sent to the BOSH
         *  server, all pending data is sent and the queue is flushed.
         *
         *  Parameters:
         *    (XMLElement |
         *     [XMLElement] |
         *     Strophe.Builder) elem - The stanza to send.
         *     ///
         *     send: function (elem)
         *     ///
         */
        Gab.connection.send($pres());
    },

    pending_subscriber: null,

    /**
     2.2.  Presence Syntax
     Presence stanzas are used qualified by the 'jabber:client' or 'jabber:server' namespace to express an entity's current network
     availability (offline or online, along with various sub-states of the latter and optional user-defined descriptive text),
     and to notify other entities of that availability.
     Presence stanzas are also used to negotiate and manage subscriptions to the presence of other entities.

     2.2.1.  Types of Presence
     The 'type' attribute of a presence stanza is OPTIONAL. A presence stanza that does not possess a 'type'
     attribute is used to signal to the server that the sender is online and available for communication. If included,
     the 'type' attribute specifies a lack of availability, a request to manage a subscription to another entity's presence,
     a request for another entity's current presence, or an error related to a previously-sent presence stanza. If included,
     the 'type' attribute MUST have one of the following values:

     -> unavailable -- Signals that the entity is no longer available for communication.
     -> subscribe -- The sender wishes to subscribe to the recipient's presence.
     -> subscribed -- The sender has allowed the recipient to receive their presence.
     -> unsubscribe -- The sender is unsubscribing from another entity's presence.
     -> unsubscribed -- The subscription request has been denied or a previously-granted subscription has been cancelled.
     -> probe -- A request for an entity's current presence; SHOULD be generated only by a server on behalf of a user.
     -> error -- An error has occurred regarding processing or delivery of a previously-sent presence stanza.

     For detailed information regarding presence semantics and the subscription model used in the context of XMPP-based instant
     messaging and presence applications, refer to Exchanging Presence Information and Managing Subscriptions.

     2.2.2.  Child Elements
     As described under extended namespaces, a presence stanza MAY contain any properly-namespaced child element.
     In accordance with the default namespace declaration, by default a presence stanza is qualified by the
     'jabber:client' or 'jabber:server' namespace, which defines certain allowable children of presence stanzas.
      If the presence stanza is of type "error", it MUST include an <error/> child; for details, see [XMPP‑CORE].
      If the presence stanza possesses no 'type' attribute, it MAY contain any of the following child elements
     (note that the <status/> child MAY be sent in a presence stanza of type "unavailable" or, for historical reasons, "subscribe"):
     <show/>
     <status/>
     <priority/>

     2.2.2.1.  Show
     The OPTIONAL <show/> element contains non-human-readable XML character data
     that specifies the particular availability status of an entity or specific resource.
     A presence stanza MUST NOT contain more than one <show/> element. The <show/> element MUST NOT possess any attributes.
     If provided, the XML character data value MUST be one of the following (additional availability types could be defined through
      a properly-namespaced child element of the presence stanza):

     -> away -- The entity or resource is temporarily away.
     -> chat -- The entity or resource is actively interested in chatting.
     -> dnd -- The entity or resource is busy (dnd = "Do Not Disturb").
     -> xa -- The entity or resource is away for an extended period (xa = "eXtended Away").
     If no <show/> element is provided, the entity is assumed to be online and available.

     2.2.2.2.  Status
     The OPTIONAL <status/> element contains XML character data specifying a natural-language description of availability status.
     It is normally used in conjunction with the show element to provide a detailed description of an availability state
     (e.g., "In a meeting"). The <status/> element MUST NOT possess any attributes, with the exception of the 'xml:lang'
     attribute. Multiple instances of the <status/> element MAY be included but only if each instance possesses an 'xml:lang'
     attribute with a distinct language value.

     2.2.2.3.  Priority
     The OPTIONAL <priority/> element contains non-human-readable XML character data that specifies the priority level
     of the resource. The value MUST be an integer between -128 and +127. A presence stanza MUST NOT contain more than
     one <priority/> element. The <priority/> element MUST NOT possess any attributes. If no priority is provided,
     a server SHOULD consider the priority to be zero. For information regarding the semantics of priority values
     in stanza routing within instant messaging and presence applications, refer to Server Rules for Handling XML Stanzas.
    * */

    /**
    this the the presence handler
    to update the list of contacts accordingly. The following code should be added to the Gabobject
    presence stanza example
         <presence
         type='subscribe'
         from='juliet@example.com/balcony'
         to='romeo@example.net/orchard'
         xml:lang='en'>
             <show>away</show>
             <status>be right back</status>
             <priority>0</priority>
         </presence>
     */

        /**
         * ana lazem 3adel hon
        * */
    on_presence: function (presence) {
        var ptype = $(presence).attr('type');
        var from = $(presence).attr('from');
        var jid_id = Gab.jid_to_id(from);

        if (ptype === 'subscribe') {
            // populate pending_subscriber, the approve-jid span, and
            // open the dialog
            Gab.pending_subscriber = from;
            $('#approve-jid').text(Strophe.getBareJidFromJid(from));
            $('#approve_dialog').dialog('open');
        } else if (ptype !== 'error') {
            var contact = $('#roster-area li#' + jid_id + ' .roster-contact')
                .removeClass("online")
                .removeClass("away")
                .removeClass("offline");
            if (ptype === 'unavailable') {
                contact.addClass("offline");
            } else {
                var show = $(presence).find("show").text();
                if (show === "" || show === "chat") {
                    contact.addClass("online");
                } else {
                    contact.addClass("away");
                }
            }
            var li = contact.parent();
            li.remove();
            Gab.insert_contact(li);
        }

        // reset addressing for user since their presence changed
        var jid_id = Gab.jid_to_id(from);
        $('#chat-' + jid_id).data('jid', Strophe.getBareJidFromJid(from));

        return true;
    },

    on_roster_changed: function (iq) {
        $(iq).find('item').each(function () {
            var sub = $(this).attr('subscription');
            var jid = $(this).attr('jid');
            var name = $(this).attr('name') || jid;
            var jid_id = Gab.jid_to_id(jid);

            if (sub === 'remove') {
                // contact is being removed
                $('#' + jid_id).remove();
            } else {
                // contact is being added or modified
                var contact_html = "<li id='" + jid_id + "'>" +
                    "<div class='" + 
                    ($('#' + jid_id).attr('class') || "roster-contact offline") +
                    "'>" +
                    "<div class='roster-name'>" +
                    name +
                    "</div><div class='roster-jid'>" +
                    jid +
                    "</div></div></li>";
                if ($('#' + jid_id).length > 0) {
                    $('#' + jid_id).replaceWith(contact_html);
                } else {
                    Gab.insert_contact($(contact_html));
                }
            }
        });
        return true;
    },

    on_message: function (message) {
        var full_jid = $(message).attr('from');
        var jid = Strophe.getBareJidFromJid(full_jid);
        var jid_id = Gab.jid_to_id(jid);

        if ($('#chat-' + jid_id).length === 0) {
            $('#chat-area').tabs('add', '#chat-' + jid_id, jid);
            $('#chat-' + jid_id).append(
                "<div class='chat-messages'></div>" +
                "<input type='text' class='chat-input'>");
        }
        
        $('#chat-' + jid_id).data('jid', full_jid);

        $('#chat-area').tabs('select', '#chat-' + jid_id);
        $('#chat-' + jid_id + ' input').focus();

        var composing = $(message).find('composing');
        if (composing.length > 0) {
            $('#chat-' + jid_id + ' .chat-messages').append(
                "<div class='chat-event'>" +
                Strophe.getNodeFromJid(jid) +
                " is typing...</div>");

            Gab.scroll_chat(jid_id);
        }

        var body = $(message).find("html > body");

        if (body.length === 0) {
            body = $(message).find('body');
            if (body.length > 0) {
                body = body.text()
            } else {
                body = null;
            }
        } else {
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
            // remove notifications since user is now active
            $('#chat-' + jid_id + ' .chat-event').remove();

            // add the new message
            $('#chat-' + jid_id + ' .chat-messages').append(
                "<div class='chat-message'>" +
                "&lt;<span class='chat-name'>" +
                Strophe.getNodeFromJid(jid) +
                "</span>&gt;<span class='chat-text'>" +
                "</span></div>");

            $('#chat-' + jid_id + ' .chat-message:last .chat-text')
                .append(body);

            Gab.scroll_chat(jid_id);
        }

        return true;
    },

    scroll_chat: function (jid_id) {
        var div = $('#chat-' + jid_id + ' .chat-messages').get(0);
        div.scrollTop = div.scrollHeight;
    },


    //ana lazm 3adel hoooon
    presence_value: function (elem) {
        if (elem.hasClass('online')) {
            return 2;
        } else if (elem.hasClass('away')) {
            return 1;
        }

        return 0;
    },
    insert_contact: function (elem) {
        /**
         * element = ("<li id='" + jid_id + "'>" +
             "<div class='roster-contact offline'>" +
             "<div class='roster-name'>" +
             name +
             "</div><div class='roster-jid'>" +
             jid +
             "</div></div></li>")
         * **/
        var jid = elem.find('.roster-jid').text();
        //set the cantact presence
        var pres = Gab.presence_value(elem.find('.roster-contact'));
        //li inside the roster area only
        var contacts = $('#roster-area li');

        /**
         * contacts.length
         * The length property contains the number of elements in the jQuery object
         * */


        /**
         * the following code is for arranging the contacts
         * online
         * away
         * offline
         * */
         if (contacts.length > 0) {
            var inserted = false;
            contacts.each(function () {
                var cmp_pres = Gab.presence_value($(this).find('.roster-contact'));
                var cmp_jid = $(this).find('.roster-jid').text();

                if (pres > cmp_pres) {
                    $(this).before(elem);
                    inserted = true;
                    return false;
                } else if (pres === cmp_pres) {
                    if (jid < cmp_jid) {
                        $(this).before(elem);
                        inserted = true;
                        return false;
                    }
                }
            });

            if (!inserted) {
                $('#roster-area ul').append(elem);
            }
        } else {
            $('#roster-area ul').append(elem);
        }
    }
};
//end of gap
$(document).ready(function () {
    $('#login_dialog').dialog({
        autoOpen: true,
        draggable: false,
        modal: true,
        title: 'Connect to XMPP',
        buttons: {
            "Connect": function () {
                $(document).trigger('connect', {
                    jid: $('#jid').val().toLowerCase(),
                    password: $('#password').val()
                });
                $('#password').val('');
                $(this).dialog('close');
            }
        }
    });

    // this dialog is for add new contact
    $('#contact_dialog').dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        title: 'Add a Contact',
        buttons: {
            "Add": function () {
                $(document).trigger('contact_added', {
                    jid: $('#contact-jid').val().toLowerCase(),
                    name: $('#contact-name').val()
                });

                $('#contact-jid').val('');
                $('#contact-name').val('');
                
                $(this).dialog('close');
            }
        }
    });

    $('#new-contact').click(function (ev) {
        $('#contact_dialog').dialog('open');
    });

    $('#approve_dialog').dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        title: 'Subscription Request',
        buttons: {
            // send to the subscriber "the user deny your request"
            "Deny": function () {
                Gab.connection.send($pres({
                    to: Gab.pending_subscriber,
                    "type": "unsubscribed"}));
                Gab.pending_subscriber = null;

                $(this).dialog('close');
            },

            "Approve": function () {
                Gab.connection.send($pres({
                    to: Gab.pending_subscriber,
                    "type": "subscribed"}));

                Gab.connection.send($pres({
                    to: Gab.pending_subscriber,
                    "type": "subscribe"}));
                
                Gab.pending_subscriber = null;

                $(this).dialog('close');
            }
        }
    });

    $('#chat-area').tabs().find('.ui-tabs-nav').sortable({axis: 'x'});

    $('.roster-contact').live('click', function () {
        var jid = $(this).find(".roster-jid").text();
        var name = $(this).find(".roster-name").text();
        var jid_id = Gab.jid_to_id(jid);

        if ($('#chat-' + jid_id).length === 0) {
            $('#chat-area').tabs('add', '#chat-' + jid_id, name);
            $('#chat-' + jid_id).append(
                "<div class='chat-messages'></div>" +
                "<input type='text' class='chat-input'>");
            $('#chat-' + jid_id).data('jid', jid);
        }
        $('#chat-area').tabs('select', '#chat-' + jid_id);

        $('#chat-' + jid_id + ' input').focus();
    });

    $('.chat-input').live('keypress', function (ev) {
        var jid = $(this).parent().data('jid');

        if (ev.which === 13) {
            ev.preventDefault();

            var body = $(this).val();

            var message = $msg({to: jid,
                                "type": "chat"})
                .c('body').t(body).up()
                .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
            Gab.connection.send(message);

            $(this).parent().find('.chat-messages').append(
                "<div class='chat-message'>&lt;" +
                "<span class='chat-name me'>" + 
                Strophe.getNodeFromJid(Gab.connection.jid) +
                "</span>&gt;<span class='chat-text'>" +
                body +
                "</span></div>");
            Gab.scroll_chat(Gab.jid_to_id(jid));

            $(this).val('');
            $(this).parent().data('composing', false);
        } else {
            var composing = $(this).parent().data('composing');
            if (!composing) {
                var notify = $msg({to: jid, "type": "chat"})
                    .c('composing', {xmlns: "http://jabber.org/protocol/chatstates"});
                Gab.connection.send(notify);

                $(this).parent().data('composing', true);
            }
        }
    });

    $('#disconnect').click(function () {
        Gab.connection.disconnect();
        Gab.connection = null;
    });

    $('#chat_dialog').dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        title: 'Start a Chat',
        buttons: {
            "Start": function () {
                var jid = $('#chat-jid').val().toLowerCase();
                var jid_id = Gab.jid_to_id(jid);
                $('#chat-area').tabs('add', '#chat-' + jid_id, jid);
                $('#chat-' + jid_id).append(
                    "<div class='chat-messages'></div>" +
                    "<input type='text' class='chat-input'>");
            
                $('#chat-' + jid_id).data('jid', jid);
            
                $('#chat-area').tabs('select', '#chat-' + jid_id);
                $('#chat-' + jid_id + 'input').focus();
                $('#chat-jid').val('');
                $(this).dialog('close');
            }
        }
    });

    $('#new-chat').click(function () {
        $('#chat_dialog').dialog('open');
    });
});
//end of document ready
/**
connect: function (	jid,
                     pass,
                     callback,
                     wait,
                     hold,
                     route	)
 Parameters
 (String) jid	The user’s JID.  This may be a bare JID, or a full JID.  If a node is not supplied, SASL ANONYMOUS authentication will be attempted.
 (String) pass	The user’s password.
 (Function) callback	The connect callback function.
 (Integer) wait	The optional HTTPBIND wait value.  This is the time the server will wait before returning an empty result for a request.  The default setting of 60 seconds is recommended.
 (Integer) hold	The optional HTTPBIND hold value.  This is the number of connections the server will hold at one time.  This should almost always be set to 1 (the default).
 (String) route	The optional route value.
 * */
$(document).bind('connect', function (ev, data) {
    var conn = new Strophe.Connection(
	"http://ositcom.net:5280/http-bind");
    conn.connect(data.jid, data.password, function (status) {
        if (status === Strophe.Status.CONNECTED) {
            $(document).trigger('connected');
        } else if (status === Strophe.Status.DISCONNECTED) {
            $(document).trigger('disconnected');
        }
    });
    Gab.connection = conn;
});
// send iq request to the server to return the user contacts
$(document).bind('connected', function () {
    /**
     * function $iq(attrs)
     * Create a Strophe.Builder with an <iq/> element as the root.
         Parameters
         (Object) attrs	The <iq/> element attributes in object notation.
         Returns
         A new Strophe.Builder object.
     *******************************************************
     *
     * c: function (name, attrs, text)
     * Add a child to the current element and make it the new current element.
         This function moves the current element pointer to the child, unless text is provided.
          If you need to add another child, it is necessary to use up() to go back to the parent in the tree.
         Parameters
         (String) name	The name of the child.
         (Object) attrs	The attributes of the child in object notation.
         (String) text	The text to add to the child.
         Returns
         The Strophe.Builder object.
     *
     * */
    //compose iq stanza
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    //return the iq stanza and put it in the function Gab.on_roster
    /*
    The following stanza requests Elizabeth’s roster from her server:
        <iq from=’elizabeth@longbourn.lit/library’
        type=’get’
        id=’roster1’>
            <query xmlns=’jabber:iq:roster’/>
        </iq>
    Her server will reply with something similar to the following:
        <iq to=’elizabeth@longbourn.lit/library’
        type=’result’
        id=’roster1’>
            <query xmlns=’jabber:iq:roster’>
                <item jid=’darcy@pemberley.lit’ name=’Mr. Darcy’ subscription=’both’/>
                <item jid=’jane@longbourn.lit’ name=’Jane’ subscription=’both’/>
            </query>
        </iq>
    */
    /**
    *
    * The sendIQ()function wraps all these requirements and the associated behavior in an easy-to-use
     interface. Instead of creating a unique idvalue, setting up success and error handlers, and then
     sending out the <iq>stanza, sendIQ()accepts an <iq>stanza,
      ensures it has a unique id, automatically sets up handlers with the success and error callbacks you provide,
     and ensures the handlers
     are properly cleaned up after your callbacks are executed.
     ///Connection.sendIQ(iq_stanza, success_callback, error_callback);///
     The success and error callbacks are both optional. The success callback fires if an IQ-result is received,
     and the error callback fires on an IQ-error. Both callbacks are passed a single parameter — the
     response stanza.
     In addition, sendIQ()accepts a timeout value as an optional fourth parameter. If a response to the
     IQ-get or IQ-set stanza is not received within the timeout period, the error callback is automatically
     triggered. This timeout can be very useful for making your code robust in the presence of network
     or service errors that cause responses to be delayed or unsent.
     sendIQ()makes dealing with IQ stanzas extremely easy, and you see a lot more of it in later
     chapters.

     *************
     * sendIQ: function(	elem,
         callback,
         errback,
         timeout	)

     Helper function to send IQ stanzas.
     Parameters
     (XMLElement) elem	The stanza to send.
     (Function) callback	The callback function for a successful request.
     (Function) errback	The callback function for a failed or timed out request.  On timeout, the stanza will be null.
     (Integer) timeout	The time specified in milliseconds for a timeout to occur.
     Returns
     The id used to send the IQ.
     */

    Gab.connection.sendIQ(iq, Gab.on_roster);
    /** Function: addHandler
     *  Add a stanza handler for the connection.
     *
     *  This function adds a stanza handler to the connection.  The
     *  handler callback will be called for any stanza that matches
     *  the parameters.  Note that if multiple parameters are supplied,
     *  they must all match for the handler to be invoked.
     *
     *  The handler will receive the stanza that triggered it as its argument.
     *  The handler should return true if it is to be invoked again;
     *  returning false will remove the handler after it returns.
     *
     *  As a convenience, the ns parameters applies to the top level element
     *  and also any of its immediate children.  This is primarily to make
     *  matching /iq/query elements easy.
     *
     *  The options argument contains handler matching flags that affect how
     *  matches are determined. Currently the only flag is matchBare (a
     *  boolean). When matchBare is true, the from parameter and the from
     *  attribute on the stanza will be matched as bare JIDs instead of
     *  full JIDs. To use this, pass {matchBare: true} as the value of
     *  options. The default value for matchBare is false.
     *
     *  The return value should be saved if you wish to remove the handler
     *  with deleteHandler().
     *
     * function (handler, ns, name, type, id, from, options)
     *  Parameters:
     *    (Function) handler - The user callback.
     *    (String) ns - The namespace to match.
     *    (String) name - The stanza name to match.
     *    (String) type - The stanza type attribute to match.
     *    (String) id - The stanza id attribute to match.
     *    (String) from - The stanza from attribute to match.
     *    (String) options - The handler options
     *
     *  Returns:
     *    A reference to the handler that can be used to remove it.
     */
    //  handler - ns - name - type
    Gab.connection.addHandler(Gab.on_roster_changed, "jabber:iq:roster", "iq", "set");

    Gab.connection.addHandler(Gab.on_message, null, "message", "chat");
});
$(document).bind('disconnected', function () {
    Gab.connection = null;
    Gab.pending_subscriber = null;

    $('#roster-area ul').empty();
    $('#chat-area ul').empty();
    $('#chat-area div').remove();

    $('#login_dialog').dialog('open');
});
//send a new contact to the xmpp server
//this is yhe iq stanza example
/*
 <iq from=’jane@longbourn.lit/sitting_room’
     type=’set’
     id=’add1’>
     <query xmlns=’jabber:iq:roster’>
     <item jid=’bingley@netherfield.lit’ name=’Mr. Bingley’/>
     </query>
 </iq>
 */
$(document).bind('contact_added', function (ev, data) {
    var iq = $iq({type: "set"}).c("query", {xmlns: "jabber:iq:roster"})
        .c("item", data);
    Gab.connection.sendIQ(iq);
    
    var subscribe = $pres({to: data.jid, "type": "subscribe"});
    Gab.connection.send(subscribe);
});
