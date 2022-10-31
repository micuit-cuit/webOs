//|------------------------------------------|inisialize variables|------------------------------------------|
    let functions = [
            "dir",
            "ls",
            "cd",
            "mkdir",
            "rm",
            "setPerm",
            "start",
            "startDisplay",
            "cat",
            "echo",
            "eval",
            "apt",
            "sudo apt install",
            "sudo apt remove",
            "sudo apt reinstall",
            "apt list",
            "apt list installed",
            "apt list available",
            "apt list all",
            "apt help"
    ];
    const aptListAll = [
        {"name":"jsExecutor"
        ,"version":"1.0.0"
        ,"description":"execute js code"
        ,"author":"micuit-cuit"
        ,"exec":["jsExecutor"]
        ,"start": null
        ,"install": null
        ,"remove": null},
        {"name":"displayOs"
        ,"version":"1.0.0"
        ,"description":"displayOs"
        ,"author":"micuit-cuit"
        ,"exec":["displayOs","getApp","appKill","openApp"]
        ,"start": "startDisplayOs"
        ,"install": "installdisplaySourse"
        ,"remove": "removedisplaySourse"},
        {"name":"terminal",
        "version":"1.0.0",
        "description":"terminal",
        "author":"micuit-cuit",
        "exec":["tabComplete","clearHistory","help","previousCommand","runCommand","nextCommand","clear"],
        "start": null,
        "install": "addTerminalSource",
        "remove": "removeTerminalSource"},
        {"name":"gedit",
        "version":"1.0.0",
        "description":"editor for text files",
        "author":"micuit-cuit",
        "exec":["gedit"],
        "start": null,
        "install": "addGeditSource",
        "remove": "removeGeditSource"},
        {"name":"fileManager",
        "version":"1.0.0",
        "description":"fileManager",
        "author":"micuit-cuit",
        "exec":["fileManager"],
        "start": "fileManagerStart",
        "install": "addFileManagerSource",
        "remove": "removeFileManagerSource"},
        {"name":"visualApt",
        "version":"1.0.0",
        "description":"visualApt",
        "author":"micuit-cuit",
        "exec":["visualApt"],
        "start": null,
        "install": "addVisualAptSource",
        "remove": "removeVisualAptSource"}
    ]
    function startVariables(){
        let previuesTabComplete = "";
        let previuesTabPrompt = "";
        let tabCompleteIndex = 0;
        let previousCommandLength
        globalThis.previuesTabComplete = previuesTabComplete;
        globalThis.previuesTabPrompt = previuesTabPrompt;
        globalThis.tabCompleteIndex = tabCompleteIndex;
        globalThis.previousCommandLength = previousCommandLength;
        
        //add all apt packages to functions
        for (let i = 0; i < aptListAll.length; i++) {
            functions.push("sudo apt install "+aptListAll[i].name);
            functions.push("sudo apt remove "+aptListAll[i].name);
            functions.push("sudo apt reinstall "+aptListAll[i].name);
        }
        //add installed apt packages to functions
        let aptListInstalled = JSON.parse(readInLocalStorage("/var/apt"));
        if (aptListInstalled != null) {
            for (let i = 0; i < aptListInstalled.length; i++) {
                for (let j = 0; j < aptListInstalled[i].exec.length; j++) {
                    functions.push(aptListInstalled[i].exec[j]);
                }
            }
        }
    }
//|------------------------------------------|API|------------------------------------------|
    function readInLocalStorage(key) {
        let result = localStorage.getItem(key);
        return result;  
    }
    function writeInLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        }catch(e){}
    }
    function removeInLocalStorage(key) {
        localStorage.removeItem(key);
    }
    function checkPermissions(path , permInt) {
        let lastSlash = path.lastIndexOf("/");
        path = path.substring(0, lastSlash);
        //check if path is valid and if permissions are ok
        let permJson = readInLocalStorage("/var/security");
        let perm = JSON.parse(permJson);

        if (permInt == null) {
            if (perm.admin.includes(path)) {
                return "admin";
            }
            if (perm.root.includes(path)) {
                return "root";
            }
            if (perm.user.includes(path)) {
                return "user";
            }
        }
        else {
            if (permInt == "admin") {
                if (perm.admin.includes(path)) {
                    return "true";
                }
                else {
                    return "false";
                }
            }
            else if (permInt == "root") {
                if (perm.root.includes(path)) {
                    return "true";
                }
                else {
                    return "false";
                }
            }
            else if (permInt == "user") {
                if (perm.user.includes(path)) {
                    return "true";
                }
                else {
                    return "false";
                }
            }
            else {
                return "false";
            }
        }
    }
    function addPermision(path, perm) {
        let permJson = readInLocalStorage("/var/security");
        let permObj = JSON.parse(permJson);
        if (perm == "admin") {
            permObj.admin.push(path);
        }
        else if (perm == "root") {
            permObj.root.push(path);
        }
        else if (perm == "user") {
            permObj.user.push(path);
        }
        writeInLocalStorage("/var/security", JSON.stringify(permObj));
    }
    function removePermision(path, perm) {
        let permJson = readInLocalStorage("/var/security");
        let permObj = JSON.parse(permJson);
        if (perm == "admin") {
            permObj.admin = permObj.admin.filter(function(value, index, arr){
                return value != path;
            });
        }
        else if (perm == "root") {
            permObj.root = permObj.root.filter(function(value, index, arr){
                return value != path;
            });
        }
        else if (perm == "user") {
            permObj.user = permObj.user.filter(function(value, index, arr){
                return value != path;
            });
        }
        writeInLocalStorage("/var/security", JSON.stringify(permObj));
    }
    function getPermision(path) {
        let permJson = readInLocalStorage("/var/security");
        let permObj = JSON.parse(permJson);
        if (permObj.admin.includes(path)) {
            return "admin";
        }
        else if (permObj.root.includes(path)) {
            return "root";
        }
        else if (permObj.user.includes(path)) {
            return "user";
        }
        else {
            return "none";
        }
    }
//|------------------------------------------|fillnav|------------------------------------------|
    function start() {
        let localPath = "/";
        globalThis.localPath = localPath;
        if (readInLocalStorage("/var/security") == null ) {
            let obj = {
                "admin": [
                    "/var/security"
                ],
                "root": [
                    "/",
                    "/var/apt",
                    "/var"
                ],
                "user": [
                    "/home",
                    "/var/terminal"
                ]
            };
            writeInLocalStorage("/var/security", JSON.stringify(obj));
        }
        if (readInLocalStorage(localPath) == null) {
            writeInLocalStorage(localPath , "");
        }
        if (readInLocalStorage("/home") == null) {
            writeInLocalStorage("/home" , "");
            addPermision("/home", "root");
        }
        if (readInLocalStorage("/var") == null) {
            writeInLocalStorage("/var", "");
            addPermision("/var", "root");
        }
        if (readInLocalStorage("/home/user") == null) {
            writeInLocalStorage("/home/user", "");
            addPermision("/home/user", "user");
        }
        if (readInLocalStorage("/home/user/document") == null) {
            writeInLocalStorage("/home/user/document", "");
            addPermision("/home/user/document", "user");
        }
        if (readInLocalStorage("/home/user/bureau") == null) {
            writeInLocalStorage("/home/user/bureau", "");
            addPermision("/home/user/bureau", "user");
        }
        if (readInLocalStorage("/home/user/image") == null) {
            writeInLocalStorage("/home/user/image", "");
            addPermision("/home/user/image", "user");
        }
        if (readInLocalStorage("/home/user/music") == null) {
            writeInLocalStorage("/home/user/music", "");
            addPermision("/home/user/music", "user");
        }
        if (readInLocalStorage("/home/user/video") == null) {
            writeInLocalStorage("/home/user/video", "");
            addPermision("/home/user/video", "user");
        }
        if (readInLocalStorage("/home/user/download") == null) {
            writeInLocalStorage("/home/user/download", "");
            addPermision("/home/user/download", "user");
        }
        

        let commandsList = readInLocalStorage("/var/terminal");
    }
    function dir(path) {
        //get all files start with path in localstorage
        let files = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(path)) {
                files.push(key);
            }
        }
        //remove path from files
        for (let i = 0; i < files.length; i++) {
            files[i] = files[i].substring(path.length);
            //if file starts with / remove it
            while (true) {
                if (files[i].startsWith("/")) {
                    files[i] = files[i].substring(1);
                }
                else {
                    break;
                }
            }
        }
        //remove all files that are not in the same folder
        for (let i = 0; i < files.length; i++) {
            let lastSlash = files[i].indexOf("/");
            if (lastSlash != -1) {
                files[i] = files[i].substring(0, lastSlash);
            }

        }
        //remove all double files
        files = files.filter(function(value, index, arr){
            return arr.indexOf(value) == index;
        });
        //test if files are folders
        let outFiles = [];
        for (let i = 0; i < files.length; i++) {
            let pathFile = path + "/" + files[i];
            while (true) {
                if (pathFile.startsWith("/")) {
                    pathFile = pathFile.substring(1);
                }
                else {
                    break;
                }
            }
            if (readInLocalStorage(path + "/" + files[i]) == null||readInLocalStorage(path + "/" + files[i]) == "") {
                outFiles.push({ name:files[i] , type:"folder", path:"/"+pathFile});
            }
            else if (readInLocalStorage(path + "/" + files[i]) != null||readInLocalStorage(path + "/" + files[i]) != "") {
                outFiles.push({ name:files[i] , type:"text", path:"/"+pathFile});
            }
        }
        return outFiles;
    

    }
    function cd(path) {
        if (path.startsWith("/")) {
            localPath = path;
        } else {
            localPath += path;
        }
        return localPath;
    }
    function mkdir(path, perm) {
        //check if path is valid and if permissions are ok
        if (perm == null) {
            perm = "user";
        }
        if (!path.startsWith("/")) {
            path = localPath + path;
        }
        //delet last / if there is one
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        //delet last argument 
        var permInfo = checkPermissions(path , perm);
        //create a key in localstorage
        if (permInfo == 'true'){
            if (path.startsWith("/")) {
                writeInLocalStorage(path, "");
            }
            else {
                writeInLocalStorage(localPath + path, "");
            }
        //edit permissions
            addPermision(path, perm);
            return "created";
        }else{
            return "permission denied";
        }
    }
    function rm(path, perm) {
        //check if path is valid and if permissions are ok
        if (perm == null) {
            perm = "user";
        }
        if (!path.startsWith("/")) {
            path = localPath + path;
        }
        //delet last / if there is one
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        //delet last argument 
        var permInfo = checkPermissions(path , perm);
        //create a key in localstorage
        if (permInfo == 'true'){
            var deleteDir = dir(path); 
            for (let i = 0; i < deleteDir.length; i++) {
                removeInLocalStorage(deleteDir[i]);
                removePermision(deleteDir[i], perm);
            }
            return "deleted";
        }else{
            return "permission denied";
        }
    }
    function setPerm(path, toPerm , perm) {
        if (perm == null) {
            perm = "user";
        }
        if (perm == "admin"){
            if (toPerm == "admin" || toPerm == "root" || toPerm == "user") {
                var permPrevie = getPermision(path); 
                if (permPrevie != "none") {
                    addPermision(path, toPerm);
                    removePermision(path, permPrevie);
                    return "permission changed";
                }else{
                    return "permission not found";
                }
            }else{
                return "invalid permission";
            }
        }else{
            return "permission denied";
    }}
    function cat(path) {
        if (!path.startsWith("/")) {
            path = localPath + path;
        }
        return readInLocalStorage(path);
    }
    function echo(text, path, perm) {
        if (!path.startsWith("/")) {
            path = localPath + path;
        }
        if (perm == null) {
            perm = "user";
        }
        //test if permissions are ok

        var permInfo = checkPermissions(path , perm);
        if (permInfo == 'true'){
            writeInLocalStorage(path, text);
            addPermision(path, perm);
            return "written, "+text;
        }else{
            return "permission denied";
        }
    }
    function ls(path) {
        dir(path);
    }
//|------------------------------------------|apt|------------------------------------------|
    function stratApt() {
        if (readInLocalStorage("/var/apt") == null) {
            writeInLocalStorage("/var/apt" ,"[]");
            writeInLocalStorage("/var/apt" , JSON.stringify(JSON.parse('[{"name":"terminal","version":"1.0.0","description":"terminal","author":"micuit-cuit","exec":["tabComplete","clearHistory","help","previousCommand","runCommand","nextCommand","clear"],"start": null,"install": "installTerminal","remove": "removeTerminal"}]')));
            addPermision("/var/apt", "root");
            installTerminal();
        }
    }
    function apt( command , arg , perm) {
        if (perm == null) {
            perm = "user";
        }
        //test if permissions are ok
        var permInfo = checkPermissions( "/var/apt/" , perm);
        if (command == "list") {
            let aptList = JSON.parse(readInLocalStorage("/var/apt"));
            let aptListName = [];
            let aptListAllName = [];
            for (let i = 0; i < aptList.length; i++) {
                aptListName.push(aptList[i].name);
            }
            for (let i = 0; i < aptListAll.length; i++) {
                aptListAllName.push(aptListAll[i].name);
            }
            if (arg == "installed") {
                return aptListName;
            }else if (arg == "available") {
                return aptListAllName;
            }else if (arg == "all" || arg == null) {
                return aptListName.concat(aptListAllName);
            }else if (arg == "help"){
                return "list available, installed, all, help";
            }else{
                return "invalid argument";
            }
        }else if (command == "help") {
            return "install, remove, list, help";
        }
        if (permInfo == 'true'){
            if (command == "install") {
                let aptList = JSON.parse(readInLocalStorage("/var/apt"));
                let aptListName = [];
                let aptListAllName = [];
                for (let i = 0; i < aptList.length; i++) {
                    aptListName.push(aptList[i].name);
                }
                for (let i = 0; i < aptListAll.length; i++) {
                    aptListAllName.push(aptListAll[i].name);
                }
                if (aptListName.includes(arg)) {
                    return "already installed";
                }
                if (aptListAllName.includes(arg)) {
                    let index = aptListAllName.indexOf(arg);
                    aptList.push(aptListAll[index]);
                    writeInLocalStorage("/var/apt", JSON.stringify(aptList));
                    if (aptListAll[index].install != null) {
                        try{
                            eval(aptListAll[index].install+"()");
                        }catch(e){
                        }
                    }
                    return "installed restart for webOs to work";
                }
                return "not found";
            
            }else if (command == "remove") {
                let aptList = JSON.parse(readInLocalStorage("/var/apt"));
                let aptListName = [];
                for (let i = 0; i < aptList.length; i++) {
                    aptListName.push(aptList[i].name);
                }
                if (aptListName.includes(arg)) {
                    let index = aptListName.indexOf(arg);
                    aptList.splice(index, 1);
                    writeInLocalStorage("/var/apt", JSON.stringify(aptList));
                    //if app is a remove commande
                    if (aptList[index].remove != null) {
                        try {
                            eval(aptList[index].remove+"()");
                        }
                        catch (e) {
                        }
                    }
                    return "removed restart for webOs to work";
                }
                return "not found";
            }else if (command == "reinstall") {
                apt("remove", arg, perm);
                return apt("install", arg, perm);
            }
        }else{
            return "permission denied";
        } 



    }
    function startPactage() {
        //start all pactages installed
        let aptList = JSON.parse(readInLocalStorage("/var/apt"));
        for (let i = 0; i < aptList.length; i++) {
            if (aptList[i].start != null) {
                eval(aptList[i].start+"()");
            }
        }
    }
    function executaPactage( command , arg) {
        //verifi if command is a pactage
        let aptList = JSON.parse(readInLocalStorage("/var/apt"));
        for (let i = 0; i < aptList.length; i++) {
            for (let j = 0; j < aptList[i].command.length; j++) {
                if (aptList[i].command[j] == command) {
                    return eval(aptList[i].name+"."+command+"('"+arg+"')");
                }
            }
        }
    }
//|------------------------------------------|display|------------------------------------------|
    function startDisplay(){
        let body = document.getElementsByTagName("body")[0];
        let div = document.createElement("div");
        div.setAttribute("id", "console");
        body.appendChild(div);
        let console = document.createElement("input");
        console.setAttribute("id", "consoleInput");
        console.setAttribute("type", "text");
        console.setAttribute("autocomplete","off");
        console.setAttribute("onkeydown", "if (event.keyCode == 13) {runCommand();} else if (event.keyCode == 38) {previousCommand();} else if (event.keyCode == 40) {nextCommand();} else if (event.keyCode == 9) {tabComplete();event.preventDefault(); }");
        //if press tab then no tab
        body.appendChild(console);
        if (readInLocalStorage("/var/terminal") == null) {
            writeInLocalStorage("/var/terminal", "[]");
        }
        let infoMessage = document.createElement("p");
        infoMessage.innerHTML = 'to install a graphic interface do {sudo apt install displayOs}<br>use {help} for more info';
        div.appendChild(infoMessage);
        let commandsList = readInLocalStorage("/var/terminal");
        previousCommandLength = JSON.parse(commandsList).length;

    }
//|------------------------------------------|terminal|------------------------------------------|
    function previousCommand() {
        let commandsList = readInLocalStorage("/var/terminal");
        commandsList = JSON.parse(commandsList);
        if (commandsList.length > 0) {
            previousCommandLength--;
            previousCommandLength = (previousCommandLength < 0) ? 0 : previousCommandLength;
            let lastCommand = commandsList[previousCommandLength];
            lastCommand = (lastCommand == undefined) ? "" : lastCommand;
            document.getElementById("consoleInput").value = lastCommand;
        }
    }
    function runCommand() {
        let commandIMP = document.getElementById("consoleInput").value;
        let command=commandIMP;
        let div = document.getElementById("console");
        let p = document.createElement("p");
        p.innerHTML = command;
        div.appendChild(p);
        let p2 = document.createElement("p");
        document.getElementById("consoleInput").value = "";
        if (command == "clear") {
            div.innerHTML = "";
        }else{
            if (command.startsWith("sudo ")) {
                command = command.replace("sudo", "");
                command = command+" root";
                command = command.trim();
            }
            let commandArgs = command.split(" ");
            let commandName = commandArgs[0];
            commandArgs.shift();
            for (let i = 0; i < commandArgs.length; i++) {
                commandArgs[i] = "'"+commandArgs[i]+"'";
            }
            let commandArgsString = commandArgs.join(', ');
            let commandString = commandName + "(" + commandArgsString + ")";
            try {
                let result = eval(commandString);
                p2.innerHTML = result;
            }catch (e) {
                try {
                    executaPactage(commandName, commandArgsString);
                }
                catch (e) {
                    p2.innerHTML = "command not found";
                }
            }
            div.appendChild(p2);

        }
        let commandsList = readInLocalStorage("/var/terminal");
        commandsList = JSON.parse(commandsList);
        commandsList.push(commandIMP);
        if (commandsList.length > 50) {
            commandsList.shift(1);
        }
        if (div.getElementsByTagName("p").length > 40) {
            div.removeChild(div.getElementsByTagName("p")[0]);
            div.removeChild(div.getElementsByTagName("p")[0]);
        }
        writeInLocalStorage("/var/terminal", JSON.stringify(commandsList));

    }
    function nextCommand() {
        let commandsList = readInLocalStorage("/var/terminal");
        commandsList = JSON.parse(commandsList);
        if (commandsList.length > 0) {
            previousCommandLength++;
            let lastCommand = commandsList[previousCommandLength];
            lastCommand = (lastCommand == undefined) ? "" : lastCommand;
            previousCommandLength = (previousCommandLength > commandsList.length) ? commandsList.length : previousCommandLength;
            document.getElementById("consoleInput").value = lastCommand;
        }
    }
//|------------------------------------------|terminalFunction|------------------------------------------|
    function tabComplete() {
        let consoleInput = document.getElementById("consoleInput").value;
        if (consoleInput != previuesTabComplete && consoleInput != previuesTabPrompt) {
            tabCompleteIndex = 0;
            previuesTabComplete = consoleInput;
        }
        let tabCompleteFunctions = [];
        for (let i = 0; i < functions.length; i++) {
            if (functions[i].startsWith(previuesTabComplete)) {
                tabCompleteFunctions.push(functions[i]);
            }
        }
        if (tabCompleteFunctions.length > 0) {
            document.getElementById("consoleInput").value = tabCompleteFunctions[tabCompleteIndex];
            tabCompleteIndex++;
            tabCompleteIndex = (tabCompleteIndex >= tabCompleteFunctions.length) ? 0 : tabCompleteIndex;
            previuesTabPrompt = document.getElementById("consoleInput").value;
        }
    }
    function clearHistory() {
        writeInLocalStorage("/var/terminal", "[]");
        return "History cleared";
    }
    function help() {
        let p = document.createElement("p");
        p.innerHTML = "Commands: "+functions.join(", ")+"<br> compatible: <br>.      tabComplete<br>.      previousCommand<br>.      nextCommand<br>.      History<br>.      clear<br>les donées sont stockées dans le local storage du navigateur et le code est du front-end donc il est possible de le modifier";
        document.getElementById("console").appendChild(p);
        return "";
    }
    function installTerminal() {
        mkdir("/var/apt/terminal", "root");
        writeInLocalStorage("/var/apt/terminal/data.json", JSON.stringify({"icon":"https://s2.qwant.com/thumbr/0x380/f/0/d313fde8a2c5075cf36bf7945c729a88a54bf5e07beab57aa6ad2a4d716984/Apps-Terminal-Pc-104-icon.png?u=https%3A%2F%2Ficons.iconarchive.com%2Ficons%2Falecive%2Fflatwoken%2F512%2FApps-Terminal-Pc-104-icon.png&q=0&b=1&p=0&a=0","name":"Terminal","html":"/var/apt/termilnal/index.html","version":"1.0.0"}));
        writeInLocalStorage("/var/apt/terminal/html.html", '<div id="console" class="console"></div><input id="consoleInput" autocomplete="off" class="consoleInput" type="text" onkeydown="if (event.keyCode == 13) {runCommand();}else if (event.keyCode == 38) {previousCommand();}else if (event.keyCode == 40) {nextCommand();}else if (event.keyCode == 9) {tabComplete();event.preventDefault();}">' );
        setPermission("/var/apt/terminal/html.html", "root");
        setPermission("/var/apt/terminal/data.json", "root");
    }
    function removeTerminal() {
        remove("/var/apt/terminal", "root");
    }
    function kill(root) {
        if (root == "root") {
            document.getElementById("body").innerHTML = "";
        }
    }
        
//|------------------------------------------|pactage|------------------------------------------|
//|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|jsExecutor|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|
    function jsExecutor(args) {
        try {
            let result = eval(args);
            return result;
        }
        catch (e) {
            return "jsExecutor error: "+e;
        }
    }
//|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|displayOs|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|
    function displayOs() {
        return "OS: webOS, version: 1.0.0 , display: "+window.screen.width+"x"+window.screen.height+", pactage display: displayOs, pactage version: 1.0.0";
    }
    function setAppOpen(app,set,id) {
        //if app is in appOpen then set appOpen[app] to set else add app to appOpen and set appOpen[app] to set
        if ((appOpen.name == app)==false) {
            appOpen.push({name: app, open: set, id: id});
        }
        for (let i = 0; i < appOpen.length; i++) {
            if (appOpen[i].name == app) {
                appOpen[i].open = set;
                appOpen[i].id = id;
            }
        }
    }
    function getApp(imput,type,oput) {
        if (type == "id") {
            for (let i = 0; i < appOpen.length; i++) {
                if (appOpen[i].id == imput) {
                    if (oput == "name") {
                        return appOpen[i].name;
                    }
                    else if (oput == "open") {
                        return appOpen[i].open;
                    }
                    else if (oput == "id") {
                        return appOpen[i].id;
                    }
                }
            }
            return "id not found";
        }else if (type == "name") {
            for (let i = 0; i < appOpen.length; i++) {
                if (appOpen[i].name == imput) {
                    if (oput == "name") {
                        return appOpen[i].name;
                    }
                    else if (oput == "open") {
                        return appOpen[i].open;
                    }
                    else if (oput == "id") {
                        return appOpen[i].id;
                    }
                }
            }
            return "name not found";
        }else if (type == "open") {
            for (let i = 0; i < appOpen.length; i++) {
                if (appOpen[i].open == imput) {
                    if (oput == "name") {
                        return appOpen[i].name;
                    }
                    else if (oput == "open") {
                        return appOpen[i].open;
                    }
                    else if (oput == "id") {
                        return appOpen[i].id;
                    }
                }
            }
            if (type == "open" && oput == "open") {
                return false;
            }
            return "open not found";
        }
        return "type not found";
    }
    function appKill(id) {
        //get div app by id
        let div = document.getElementById(id);
        //remove div app
        div.parentNode.removeChild(div);
        //set appOpen to false
        setAppOpen(getApp(id,"id","name"),false,id);
    }
    function openApp(appName, htmlPath) {
        //if htmlPath is url then get html from url
        //if htmlPath is path then get html from path
        if (htmlPath.startsWith("http")) {
            //get html from url
            fetch(htmlPath)
                .then(response => response.text())
                .then(data => {
                    asinDisplayApp(data)
                });
        }else if (htmlPath.startsWith("/")) {
            //get html from path
            html = readInLocalStorage(htmlPath);
            asinDisplayApp(html)

        }else {
            asinDisplayApp(htmlPath)
        }
        //if one app is already open then display error message and kill it
        function asinDisplayApp(html){
            if (getApp(true,"open","open") == true) {
                appKill(getApp(true,"open","id"));
            }
            let appContainer = document.getElementById("appContainer");
            let appIsOpen = getApp(appName,"name","open");
            if (appIsOpen == "name not found") {
                setAppOpen(appName,false,"");
                appIsOpen = false;
            }
            if (appIsOpen == false) {
                let appContainer = document.getElementById("appConteneur");
                let app = document.createElement("div");
                //creat a random id of 10 char
                let id = "";
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (let i = 0; i < 10; i++) {
                    id += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                app.id = id;
                setAppOpen(appName,true,id);
                app.className = "app";
                app.innerHTML = '<div class="appBar"><p class="appTitle">'+appName+'</p><div class="killAppDiv" onclick="appKill(\''+id+'\')"><p class="appClose" ><i class="fa-solid fa-xmark"></i></p></div></div>';
                app.innerHTML += '<div class="appContent">'+html+'</div>';
                appContainer.appendChild(app);
                //execute start function
                //get exec in localStorage
                let exec = JSON.parse(readInLocalStorage("/var/apt/"+appName+"/data.json")).onStartup;
                if (exec != "" || exec != undefined) {
                    try {
                        eval(exec);
                    }
                    catch (e) {
                    }
                }
            }else{
                //killappName            
                appKill(getApp(appName,"name","id"));
            }
        }
    }
    function startDisplayOs() {
        let appOpen = []; 
        globalThis.appOpen = appOpen;
        //get html file in /displayOs.html and display it
        fetch("/displayOs.html", { method: "GET" }).then(function (response) {
            return response.text();
        }).then(function (text) {
            document.getElementsByTagName("body")[0].innerHTML = text;
            //get css file in /displayOs.css and display it
            fetch("/displayOs.css", { method: "GET" }).then(function (response) {
                return response.text();
            }).then(function (text) {
                let style = document.createElement("style");
                style.innerHTML = text;
                document.getElementsByTagName("head")[0].appendChild(style);
                //for all package in a key /var/apt get /var/apt/data.json and display it
                let packages = JSON.parse(readInLocalStorage("/var/apt"));
                for (let i = 0; i < packages.length; i++) {
                    let package = packages[i];
                    let data = JSON.parse(readInLocalStorage("/var/apt/"+package.name+"/data.json"));
                    //if data is not null
                    if (data != null) {
                        //get html
                        let html = readInLocalStorage("/var/apt/"+package.name+"/html.html");
                        //creat a div in the appBar
                        let appBar = document.getElementById("appBarSelector");
                        let div = document.createElement("div");
                        div.className = "appBarIcon";
                        div.innerHTML = '<img src="'+data.icon+'" alt="'+package.name+'">';
                        div.innerHTML += '<p>'+package.name+'</p>';
                        div.setAttribute("onclick","openApp('"+package.name+"','"+html+"')");

                        //if click on div then open app
                        appBar.appendChild(div);
                    }
                }
            });
        });
    }
    function openAppFloatConteneur(appName, htmlPath) {
        //if htmlPath is url then get html from url
        //if htmlPath is path then get html from path
        if (htmlPath.startsWith("http")) {
            //get html from url
            fetch(htmlPath)
                .then(response => response.text())
                .then(data => {
                    sinDisplayAppFloat(data)
                });
        }else if (htmlPath.startsWith("/")) {
            //get html from path
            html = readInLocalStorage(htmlPath);
            sinDisplayAppFloat(html)
        }else {
            sinDisplayAppFloat(htmlPath)
        }
        function sinDisplayAppFloat(html){
            let appConteneur = document.getElementById("appFloatConteneur");
            appConteneur.style.display = "block";
            let div = document.createElement("div");
            div.className = "appFloatConteneurInterface";
            div.innerHTML = '<div class="appBar"><p class="appTitle">'+appName+'</p><div class="killAppDiv" onclick="appKillFloatConteneur()"><p class="appClose" ><i class="fa-solid fa-xmark"></i></p></div></div>';
            div.innerHTML += '<div class="appContent">'+html+'</div>';
            appConteneur.appendChild(div);
            //execute start function
            //get exec in localStorage
            let exec = JSON.parse(readInLocalStorage("/var/apt/"+appName+"/data.json")).onStartup;
            if (exec != "" || exec != undefined) {
                try {
                    eval(exec);
                }
                catch (e) {
                }
            }
        }
    }
    function appKillFloatConteneur() {
        let appConteneur = document.getElementById("appFloatConteneur");
        appConteneur.style.display = "none";
        appConteneur.innerHTML = "";
    }
    function installdisplaySourse() {
        apt("install","terminal","root");
        //install visualApt
        apt("install","visualApt","root");
        //install terminal
    }
    function removeDisplaySourse() {
        //remove visualApt
        apt("remove","visualApt","root");
        //remove terminal
        apt("remove","terminal","root");
    }
//|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|gedit|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|
    function addGeditSource(){
        //add gedit source to /var/apt
        let geditData = {
            "name":"gedit",
            "version":"0.0.1",
            "description":"text editor",
            "author":"micuit-cuit",
            "icon":"https://s2.qwant.com/thumbr/0x380/5/3/7f1ee3a70e1ee3ab76b5cc6aeafe4bb9e71bae7c20a3804a839d2f0602f248/gedit-icon-1.png?u=http%3A%2F%2Fgetdrawings.com%2Ffree-icon-bw%2Fgedit-icon-1.png&q=0&b=1&p=0&a=0",
            "onStartup":"onStartupGedit()"
        }
        let geditHtml = `https://webos-app.000webhostapp.com/gedit.html`;
        writeInLocalStorage("/var/apt/gedit/data.json",JSON.stringify(geditData),"root");
        writeInLocalStorage("/var/apt/gedit/html.html",geditHtml,"root");
    }
    function removeGeditSource(){
        //remove gedit source from /var/apt
        removeInLocalStorage("/var/apt/gedit/data.json","root");
        removeInLocalStorage("/var/apt/gedit/html.html","root");
    }
    function onStartupGedit(){
        var textArea = document.getElementById("textArea");
        textArea.focus();
        textArea.select();
    }
    function openFill(open=null){
        let path
        if (open == null) {
            openAppFloatConteneur("fileManager","https://webos-app.000webhostapp.com/fileManager.html");
            appKillFloatConteneur();
            
        }else{
            path = open;
        }
        
        if (path == null) {
            return;
        }
        let perm = checkPermissions(path);
        if (perm == "user") {
            let file = readInLocalStorage(path);
            if (file == null) {
                alert("File not found");
                return;
            }
            textArea.value = file;
        }
        else {
            alert("You don't have permission to open this file, permission: " + perm);
        }
    }
    document.addEventListener("keydown", function(e){
        if (e.ctrlKey && e.key == "s") {
            saveFile();
        }
        else if (e.ctrlKey && e.key == "o") {
            openFill();
        }
    });
    function saveFile(){
        var textArea = document.getElementById("textArea");
        var text = textArea.value;
        //appel getFileWithfileManager and attend path
        var fileName = getFileWithfileManager();
        //écoute le bouton save du fileManager
        let saveButton = document.getElementById("saveF");
        console.log("en attente du click");
        saveButton.addEventListener("click", function(){
            console.log("save");
            let path = document.getElementById("path").value;
            let name = document.getElementById("name").value;
            let fileName = path + "/" + name;
            console.log(fileName);

            if (fileName == null) {
                return;
            }
            console.log(fileName);
            writeInLocalStorage(fileName, text);
            setPermissions(fileName, "user");
            appKillFloatConteneur();
        });
    }
    function gedit(path){
        //open gedit
        openApp("gedit","https://webos-app.000webhostapp.com/gedit.html");
        //time to open gedit of 50ms
        setTimeout(function(){
            openFill(path);
        }
        ,50);
    }
//|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|fileManager|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|
    function fileManagerStart(){
        let displayRechercheBar = 0;
        globalThis.displayRechercheBar = displayRechercheBar;
        let outFillRecherche;
        globalThis.outFillRecherche = outFillRecherche;
        let pathHistory = "";
        globalThis.pathHistory = pathHistory;


    }
    function addFileManagerSource(){
        //add fileManager source to /var/apt
        let fileManagerData = {
            "name":"fileManager",
            "version":"0.0.1",
            "description":"file manager",
            "author":"micuit-cuit",
            "icon":"./fillmanager.png",
            "onStartup":"displayFiles('/home/user')"
        }
        let fileManagerHtml = `https://webos-app.000webhostapp.com/fileManager.html`;
        writeInLocalStorage("/var/apt/fileManager/data.json",JSON.stringify(fileManagerData),"root");
        writeInLocalStorage("/var/apt/fileManager/html.html",fileManagerHtml,"root");
    }
    function removeFileManagerSource(){
        //remove fileManager source from /var/apt
        removeInLocalStorage("/var/apt/fileManager/data.json","root");
        removeInLocalStorage("/var/apt/fileManager/html.html","root");
    }
    function displayFiles(path){
        globalThis.pathFile = path;
        document.getElementById("rechercheDisplay").innerHTML = path;
        //if pathHistory not contain path set pathHistory to path else delet class next-active to next button
        if (!pathHistory.startsWith(path)) {
            pathHistory = path;
        }
        else if (pathHistory != path) {
            document.getElementById("next").setAttribute("class","next");
        }
        if (pathHistory == path) {
            document.getElementById("next").setAttribute("class","next next-noActive");
        }
        //context menu
        let fillMContent = document.getElementById("fillMContent");
        if ("contextMenu" == "contextMenu") {
            document.onclick = hideMenu;
            document.getElementById("fillMContent").oncontextmenu = rightClick;
      
            function hideMenu() {
                document.getElementById("menu").style.display = "none"
                var menu = document.getElementById("menu")
                var divs = menu.getElementsByClassName("restore");
                let restore = [];
                for (var i = 0; i < divs.length; i++) {
                    let div = divs[i];
                    let onclick = div.getAttribute("onclick");
                    let id = div.getAttribute("id");
                    id = id.replace("2","");
                    let obj = {
                        "id":id,
                        "onclick":onclick
                    }
                    restore.push(obj);
                    console.log(obj);
                }
                console.log(restore);
                //get all div with no class restore
                var divs = menu.getElementsByClassName("select");
                for (var i = 0; i < restore.length; i++) {
                    for (var j = 0; j < divs.length; j++) {
                        let div = divs[j];
                        let id = div.getAttribute("id");
                        if (id == restore[i].id) {
                            div.setAttribute("onclick",restore[i].onclick);
                        }
                    }
                }

            }
      
            function rightClick(e) {
                e.preventDefault();
                if (document.getElementById("menu").style.display == "block"){
                    hideMenu();
                }else {
                    let fillMContent  = document.getElementById("fillMContent")
                    var menu = document.getElementById("menu")
                    menu.style.display = 'block';
                    //verif if menu is out of document.getElementById("fillMContent")
                    if (e.clientX + menu.offsetWidth > fillMContent.offsetWidth) {
                        menu.style.left = fillMContent.offsetWidth - menu.offsetWidth + "px";
                    }
                    else {
                        menu.style.left = e.clientX + "px";
                    }
                    if (e.clientY + menu.offsetHeight > fillMContent.offsetHeight) {
                        menu.style.top = fillMContent.offsetHeight - menu.offsetHeight + "px";
                    }
                    else {
                        menu.style.top = e.clientY + "px";
                    }
                    //if context menu open of a file set pathFile for all onclick
                    if (e.target.getAttribute("class") == "file") {
                        pathFile = e.target.getAttribute("ondoubleclick");
                        pathFile = pathFile.replace("displayFiles('","");
                        pathFile = pathFile.replace("')","");
                        console.log(pathFile);
                        selectFile(e.target);
                        for (let i = 0; i < document.getElementsByClassName("menuFill").length; i++) {
                            let onclick = document.getElementsByClassName("menuFill")[i].getAttribute("onclick");
                            onclick = onclick.replace("pathFile","'" + pathFile + "'");
                            document.getElementsByClassName("menuFill")[i].setAttribute("onclick",onclick);
                        }
                    }else {
                        for (let i = 0; i < document.getElementsByClassName("menuFill").length; i++) {
                            document.getElementsByClassName("menuFill")[i].setAttribute("onclick","");
                        }
                    }
                }
            }
        }

        //remove all files in fileManager
        let patchListForIndex = [
            ["/home/user","Home"],
            ["/home/user/bureau","Bureau"],
            ["/home/user/download","Download"],
            ["/home/user/document","Document"],
            ["/home/user/image","Images"],
            ["/home/user/music","Music"],
            ["/home/user/video","Video"],
            ["/","/"]
        ]
        let fillMLeftBar = document.getElementById("fillMLeftBar");
        //for all div in fillMLeftBar remove class 
        for (let i = 0; i < fillMLeftBar.children.length; i++) {
            fillMLeftBar.children[i].classList.remove("active");
        }
        for (let i = 0; i < patchListForIndex.length; i++) {
            if (patchListForIndex[i][0] == path) {
                document.getElementById(patchListForIndex[i][1]).setAttribute("class","active");
            }
        }
        let fileManager = document.getElementById("fillMContent");
        fileManager.innerHTML = "";
        let files = dir(path);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.name != "") {
                let div = document.createElement("div");
                div.className = "file";
                if (file.type == "folder") {
                    div.innerHTML = '<i class="fa-solid fa-folder"></i>';
                }
                else {
                    div.innerHTML = '<i class="fa-solid fa-file-text"></i>';
                }
                div.innerHTML += '<p>'+file.name+'</p>';
                div.setAttribute("onclick","fileSelected(this)");
                if (file.type == "folder") {
                    div.setAttribute("ondblclick","displayFiles('"+file.path+"')");
                }else{
                    div.setAttribute("ondblclick","gedit('"+file.path+"')");
                }
                fileManager.appendChild(div);
            }
        }
    
    }
    function previueFolder(){
        let path = globalThis.pathFile;
        let pathList = path.split("/");
        let newPath = "";
        for (let i = 0; i < pathList.length - 1; i++) {
            newPath += pathList[i] + "/";
        }
        newPath = newPath.substring(0,newPath.length - 1);
        if (newPath == "") {
            newPath = "/";
        }
        displayFiles(newPath);
    }
    function nextFolder(){
        let path = globalThis.pathFile;
        //if next button have class next-noActive return
        if (document.getElementById("next").classList.contains("next-noActive")) {
            return;
        }
        //get path + (pathHistory-path).firstAfterSlash
        let pathList = path.split("/");
        let pathHistoryList = pathHistory.split("/");
        let newPath = "";
        for (let i = 0; i < pathList.length; i++) {
            newPath += pathList[i] + "/";
        }

        if (path == "/") {
            newPath += pathHistoryList[1].split("/")[0] ;
        }
        else{
            newPath += pathHistoryList[pathList.length].split("/")[0];
        }
        newPath = newPath.replace("//","/");
        displayFiles(newPath);
    }
    function newFolder(){
        let path = globalThis.pathFile;
        let name = prompt("Enter the name of the folder");
        if (name == null) {
            return;
        }
        writeInLocalStorage(path +"/"+ name,"","user");
        addPermision(path +"/"+ name,"user");
        displayFiles(path);
    }
    function fileSelected(file){
        if (file.classList.contains("fileSelected")) {
            file.classList.remove("fileSelected");
        }
        else{
            file.classList.add("fileSelected");
        }
    }
    function folowPathExist(path){
        //get all path in localStorage
        let pathList = localStorage.key(localStorage.length - 1);
        pathList = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(path)) {
                pathList.push(key);
            }
        }
        for (let i = 0; i < pathList.length; i++) {
            if (pathList[i] == path) {
                return true;
            }
        }
        return false;
    }
    function displayPatchBar(){
        //inser HTml     <input type="search" name="rechercheTextImput" id="rechercheTextImput" class="rechercheTextImput recherche" onformchange="patchRecherche(event)"> <--->
        let rechercheDisplay = document.getElementById("rechercheDisplay");
        rechercheDisplay.classList.remove("recherche");
        if (displayRechercheBar == 0) {
            rechercheDisplay.innerHTML = '<input type="text" autocomplete="off" name="rechercheTextImput" id="rechercheTextImput" style="background: rgb(52 52 52);" class="rechercheTextImput" onformchange="patchRecherche()" > '
            let rechercheTextImput = document.getElementById("rechercheTextImput");
            rechercheTextImput.value = globalThis.pathFile;
            rechercheTextImput.focus();
            rechercheTextImput.classList.add("recherche");

            displayColorPatchBar();
            //if focus out hide the bar
            rechercheTextImput.addEventListener("focusout",function(){
                patchRecherche();
            });
            //if caracter change in the bar
            rechercheTextImput.addEventListener("input",function(){
                //verify if the path exist and if it is a folder. is it true set color to green else red
                displayColorPatchBar();
            });
            rechercheTextImput.addEventListener("keydown",function(event){
                if (event.key == "Enter") {
                    patchRecherche();
                }
            });
            displayRechercheBar = 1;
        }
    }
    function displayColorPatchBar(){
        let path = rechercheTextImput.value;
        if (folowPathExist(path) == true) {
            rechercheTextImput.style.color = "green";
            rechercheTextImput.style.textShadow = "0px 0px 5px green";
            outFillRecherche = true;
        }
        else{
            rechercheTextImput.style.color = "red";
            rechercheTextImput.style.textShadow = "0px 0px 5px red";
            outFillRecherche = false;
        }
    }
    function patchRecherche(){
        if (outFillRecherche == true) {
            let rechercheTextImput = document.getElementById("rechercheTextImput");
            let path = rechercheTextImput.value;
            displayFiles(path);
            rechercheDisplay.classList.add("recherche");

            displayRechercheBar=0;
        }
    }
    function contexeMenuFile(){
        alert("contexeMenuFile");
    }
    function getFileWithfileManager(path="/home/user"){
        //get html of fileManager
        let html = localStorage.getItem('/var/apt/fileManager/html.html');
        //fetch html
        fetch(html)
        .then(response => response.text())
        .then(data => {
            html = data;
            let outHtml = '<div class="outHtml" id="outHtml"><div class="outHtmlTop" id="outHtmlTop"><input type="text" id="save"><button id="saveF" class="saveF">save</button></div><div class="html"><div class="html2">'+html+'</div></div></div>';
            if (path != "/home/user") {
                setTimeout(function(){
                    displayFiles(path);
                },10);
            }
            openAppFloatConteneur("fileManager",outHtml);
            //add event to save button or press enter
        });
    }
//|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|visualApt|PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP|
    function visualApt(){
    }
    function addVisualAptSource(){
        let source = {
            "name":"visualApt",
            "version":"1.0.0",
            "author":"micuit-cuit",
            "description":"visualApt is a visual interface for apt",
            "icon":"https://webos-app.000webhostapp.com/visualApt.svg",
            "onStartup":"visualAptStart()"
        }
        writeInLocalStorage("/var/apt/visualApt/data.json",JSON.stringify(source),"root");
        writeInLocalStorage("/var/apt/visualApt/html.html","https://webos-app.000webhostapp.com/visualApt.html","root");
    }
    function removeVisualAptSource(){
        localStorage.removeItem("/var/apt/visualApt/data.json");
        localStorage.removeItem("/var/apt/visualApt/html.html");
        let Permissions = JSON.parse(localStorage.getItem("Permissions"));
        delete Permissions["/var/apt/visualApt/data.json"];
        delete Permissions["/var/apt/visualApt/html.html"];
        localStorage.setItem("Permissions",JSON.stringify(Permissions));
    }
    function visualAptStart(recherche=""){
        //delete all app in the appConteneur
        let appConteneur = document.getElementById("content");
        appConteneur.innerHTML = "";

        //get a list of all app
        let appList = aptListAll;
        //get all app installed
        let appInstalled = JSON.parse( localStorage.getItem("/var/apt"));
        let appInstalledName = [];
        for (let i = 0; i < appInstalled.length; i++) {
            appInstalledName.push(appInstalled[i].name);
        }
        //for all app set a display in visualApt
        let outHtml = "";
        for (let i = 0; i < appList.length; i++) {
            //if app coresponde to the recherche
            if (appList[i].name.includes(recherche) == true || recherche == "") {
                let app = appList[i];
                //if app as a source in /var/apt/{app}/data.json
                let appData;
                if (localStorage.getItem("/var/apt/"+app.name+"/data.json") != null) {
                    //get source
                    appData = JSON.parse(localStorage.getItem("/var/apt/"+app.name+"/data.json"));
                }
                else{
                    //set source
                    appData = {
                        "name":app.name,
                        "version":app.version,
                        "author":app.author,
                        "description":app.description,
                        "icon":"https://webos-app.000webhostapp.com/visualApt.svg"}
                }
                let install = "";
                if (appInstalledName.includes(app.name)) {
                    install = '<div class="remove" id="remove" onclick="visualAptUpdatePactage(\''+app.name+'\',\'remove\')"><i class="fa-solid fa-trash-can"></i></div>';
                }else{
                    install = '<div class="install" id="install" onclick="visualAptUpdatePactage(\''+app.name+'\',\'install\')"><i class="fa-solid fa-download"></i></div>';
                }
                outHtml += '<div class="appInt" id="'+app.name+'"><div class="appIcon"><img src="'+appData.icon+'" alt=""></div><div class="appText"><div class="appName">'+appData.name+'</div><div class="appDescription">'+appData.description+'</div></div>'+install+'</div>';
            }
        }
        document.getElementById("content").innerHTML = outHtml;
    }
    function visualAptUpdatePactage(name,update){
        if (update == "install") {
            apt("install",name,"root");
        }
        else if (update == "remove") {
            apt("remove",name,"root");
        }
        visualAptStart();
    }
//|------------------------------------------|startScript|------------------------------------------|
    startVariables();
    startDisplay();
    start();
    stratApt();
    startPactage();

// TODO: faire que la fonction se block jusqua l"appui sur save dans fill manadger
