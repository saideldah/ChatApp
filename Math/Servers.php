<?php include('Header.php');
require_once("UserValidator.php");
require_once("AdminValidator.php");
require_once("server.php");
    $user = UserValidator::Initiate();
    if (!$user)
    {
        $Admin = AdminValidator::Initiate();
        if (!$Admin)
        {
            header("location:Login.php");
        }
        else
        {
            $servers = server::getUserServers($Admin->GetUserID());
            $ttype="admin";
        }
    }
    elseif ($user->GetRole()=="server")
    {
        $servers = server::getUserServers($user->GetUserID());
        $ttype="server";

    }
?>
    <script type="text/javascript">
        function la(edit)
        {
            var id = "#"+edit;
            $(id).fadeIn();
        }
        function serverDown(name)
        {
            var id = "#"+name;
            $(id).fadeIn();
        }
        </script>

<table width="70%"  border="0" align="center" cellpadding="1" cellspacing="1" bgcolor="#CCCCCC">
    <tr>
            <td>
                <table width="100%" border="0" cellpadding="1" cellspacing="1" bgcolor="#FFFFFF">
                    <tr>
                        <h2>
                            <?php echo ('Servers');?>
                        </h2>
                    </tr>
                    <thead>

                        <th><h4>Name</h4></th>
                        <th><h4>state</h4></th>
                        <th colspan="5" style="text-align: center"><h4>Manage</h4></th>

                    </thead>
                    <?php

                    foreach ($servers as $server) {
                        echo("
                    <tr width=\"100%\">
                       ");
                        $host = $server->GetUserName().":".$server->GetPassword()."@".$server->GetDomain();
                        $data = @file_get_contents("http://$host:8086");
                        if ($data==null){
                            echo("<td>  <a href='#' onclick=\"serverDown('");echo($server->GetName()); echo("')\" title='more info about the server'>");echo($server->GetName());echo("</a></td>
                        <td>");
                            echo("Down");
                            if ($ttype=='server')
                            {
                                echo("<td width=\"5%\"><a href=\"#\" onclick=\"serverDown('");echo($server->GetName()); echo("')\" ><input type='button'  class='button-small' value='Edit'></a></td>");
                                echo("<td width=\"5%\"><a href=\"ServerStartup.php?index=".$server->GetServerID()."\"><img src=\"images/start.png\" style='width: 40px; height: 40px' title='Start Server' alt='Start Server'> </a></td>");
                            }
                            echo("
                        <td width=\"5%\"><a href=\"#\"  onclick=\"serverDown('");echo($server->GetName()); echo("')\" ><img src=\"images/setting.png\" style='width: 50px; height: 50px' title='Settings' alt='Setting'> </a></td>
                        <td width=\"5%\"><ahref=\"#\"  onclick=\"serverDown('");echo($server->GetName()); echo("')\"><img src=\"images/dashboard.png\" style='width: 50px; height: 50px' title='Dashboards' alt='Dashboard'></a></td>");
                        if ($ttype=='server')
                        {
                        echo("<td width=\"5%\"><a href=deleteServer.php?index=");echo($server->GetServerID()); echo(" onclick=\" return confirm('Really delete?')\";><img src=\"images/delete.png\" style='width: 50px; height: 50px' title='Delete Server' alt='Delete Server'></a></td>");
                        }
                            echo("
                          <div id=\"");echo($server->GetName()); echo("\" class='error' style=\"display: none\">the Server \"");echo($server->GetName());echo("\" is down</div>");
                        }else
                        {
                            echo("<td>  <a href=info.php?index=");echo($server->GetServerID()); echo(" title='more info about the server'>");echo($server->GetName());echo("</a></td>
                        <td>");
                            echo("Active");
                            if ($ttype=='server')
                            {
                            echo("<td width=\"5%\"><a href=\"#\" onclick=\"la('");echo($server->GetServerID()); echo("')\" ><input type='button' class='button-small' value='Edit'></a></td>");
                                echo("<td><a href=\"ServerShutdown.php?index=".$server->GetServerID()."\"><img src=\"images/stop.png\" style='width: 45px; height: 45px' title='Shutdown Server' alt='Shutdown Server'></a></td>");
                            }
                            echo("
                        <td width=\"5%\"><a href=ManageServer.php?index=");echo($server->GetServerID()); echo("><img src=\"images/setting.png\" style='width: 50px; height: 50px' title='Settings'> </a></td>
                        <td width=\"5%\"><a href=under.php?index=");echo($server->GetServerID()); echo("><img src=\"images/dashboard.png\" style='width: 50px; height: 50px' title='Dashboards'></a></td>");
                        if ($ttype=='server')
                        {
                        echo("<td width=\"5%\"><a href=deleteServer.php?index=");echo($server->GetServerID()); echo(" onclick=\" return confirm('Really delete?')\";><img src=\"images/delete.png\" style='width: 50px; height: 50px' title='Delete Server' alt='Delete Server'></a></td>");
                        }
                            echo("
                                 </td>


                    </tr>
                    <tr width=\"100%\"><td width=\"50%\"> <div id=\"");echo($server->GetServerID()); echo("\" style=\"display: none\">New Name: <input type=\"text\"> <input type=\"submit\" value=\"Change\"><td></td><td></td><td></td><td></td><td></td> </td></div></tr>
                  ");
                        }

                    }

                    ?>
                </table>
            </td>
    </tr>
</table>

<?php
    if ($ttype=='server')
    {
    echo("
    <table width=\"70%\"  border=\"0\" align=\"center\" cellpadding=\"1\" cellspacing=\"1\" bgcolor=\"#CCCCCC\">
        <tr>
            <td>
                <table width=\"100%\" border=\"0\" cellpadding=\"1\" cellspacing=\"1\" bgcolor=\"#FFFFFF\">
                    <tr>
                        <h2>
                            Add Server
                        </h2>
                    </tr>
                    <form action=\"addServer.php\" method=\"post\">
                        <tr><td>Server Name:</td><td><input type=\"text\" name=\"name\"></td></tr>
                        <tr><td>Server Domain:</td><td> http://<input type=\"text\" name=\"domain\"></td></tr>
                        <tr><td>Server Login UserName:</td><td><input type=\"text\" name=\"login\"></td></tr>
                        <tr><td>Server Login Password:</td><td><input type=\"text\" name=\"pass\"></td></tr>
                        <tr>
                            <td>
                                Wowza Installation Path:
                            </td>
                            <td>
                                <input type=\"text\" style=\"width: 500px\" name=\"path\"/><br>
                                <div style=\" border: 1px solid;
                                margin: 10px 10px;
                                padding:5px 5px 5px 5px;
                                width: 500px;
                                color: #00529B;
                                background-color: #BDE5F8;\">
                                eg: /usr/local/WowzaMediaServer<br> or: C:/Program Files (x86)/Wowza Media Systems/WowzaMediaServer
                            </div>
                            </td>
                        </tr>
                        <tr><td><input type=\"submit\" class=\"button\" value=\"Add\"></td></tr>
                    </form>
                </table>
            </td>
        </tr>
    </table>
    ");
    }?>


<?php include('footer.php');?>