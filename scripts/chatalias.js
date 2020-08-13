Hooks.on("ready", async function()
{
    if(game.user.isGM)
    {
        if(typeof(MODULE_DATA) == "undefined" || !MODULE_DATA)
        {
            folders = game.journal.directory.folders.filter(function(element){return element.data["name"] == "MODULE_DATA" && element.depth === 1});
            if(folders.length === 0)
            {
                MODULE_DATA = await Folder.create({name:"MODULE_DATA", parent:null, color:"", type:"JournalEntry"});
            }
            else
            {
                MODULE_DATA = folders[0];
            }
        }
        if(!MODULE_DATA.CHAT_ALIAS)
        {
            folders = MODULE_DATA.children.filter(function(element){return element.data["name"] == "CHAT_ALIAS"});
            if(folders.length === 0)
            {
                MODULE_DATA.CHAT_ALIAS = await Folder.create({name:"CHAT_ALIAS", parent:MODULE_DATA, color:"", type:"JournalEntry"});
            }
            else
            {
                MODULE_DATA.CHAT_ALIAS = folders[0];
            }
        }
        if(MODULE_DATA.CHAT_ALIAS.entities.filter(function(element){return element.data.permission["default"] === 3 && element.name == "Global"}).length === 0)
        {
            await JournalEntry.create({content:"", name:"Global", folder:MODULE_DATA.CHAT_ALIAS, permission:{default:3}});
        }
        
        game.users.forEach(async function(user)
        {
            if(MODULE_DATA.CHAT_ALIAS.entities.filter(function(element){return element.data.permission[user._id] === 3 && element.name == "User-" + user.name}).length === 0)
            {
                await JournalEntry.create({content:"", name:"User-" + user.name, folder:MODULE_DATA.CHAT_ALIAS, permission:{[user._id]:3}});
            }
        });
    }
    else
    {
        if(typeof(MODULE_DATA) == "undefined" || !MODULE_DATA) MODULE_DATA = game.journal.directory.folders.filter(function(element){return element.data["name"] == "MODULE_DATA" && element.depth === 1})[0];
        MODULE_DATA.CHAT_ALIAS = MODULE_DATA.children.filter(function(element){return element.data["name"] == "CHAT_ALIAS"})[0];
    }
    MODULE_DATA.CHAT_ALIAS.GLOBAL_DATA = MODULE_DATA.CHAT_ALIAS.entities.filter(function(element){return element.data.permission["default"] === 3 && element.name == "Global"})[0];
    MODULE_DATA.CHAT_ALIAS.USER_DATA = MODULE_DATA.CHAT_ALIAS.entities.filter(function(element){return element.data.permission[game.user._id] === 3 && element.name == "User-" + game.user.name})[0];
    MODULE_DATA.CHAT_ALIAS.ParseHTML = function(htmlstr)
    {
        var tmp = document.createElement("div");
        tmp.innerHTML = htmlstr;
        return JSON.parse(tmp.innerText.replace(/\s/g, "").replaceAll("\\", "\\\\"));
    };
    MODULE_DATA.CHAT_ALIAS.GLOBAL_ALIAS = MODULE_DATA.CHAT_ALIAS.ParseHTML(MODULE_DATA.CHAT_ALIAS.GLOBAL_DATA.data.content);
    MODULE_DATA.CHAT_ALIAS.GLOBAL_ALIAS.forEach(function(item, index)
    {
        item["regex"] = new RegExp(item["pattern"], "g");
    });
    MODULE_DATA.CHAT_ALIAS.USER_ALIAS = MODULE_DATA.CHAT_ALIAS.ParseHTML(MODULE_DATA.CHAT_ALIAS.USER_DATA.data.content);
    MODULE_DATA.CHAT_ALIAS.USER_ALIAS.forEach(function(item, index)
    {
        item["regex"] = new RegExp(item["pattern"], "g");
    });
});

Hooks.on("updateJournalEntry", function(entity, d, options, user)
{
    if(entity == MODULE_DATA.CHAT_ALIAS.GLOBAL_DATA)
    {
        MODULE_DATA.CHAT_ALIAS.GLOBAL_ALIAS = MODULE_DATA.CHAT_ALIAS.ParseHTML(MODULE_DATA.CHAT_ALIAS.GLOBAL_DATA.data.content);
        MODULE_DATA.CHAT_ALIAS.GLOBAL_ALIAS.forEach(function(item, index)
        {
            item["regex"] = new RegExp(item["pattern"], "g");
        });
    }
    if(entity == MODULE_DATA.CHAT_ALIAS.USER_DATA)
    {
        MODULE_DATA.CHAT_ALIAS.USER_ALIAS = MODULE_DATA.CHAT_ALIAS.ParseHTML(MODULE_DATA.CHAT_ALIAS.USER_DATA.data.content);
        MODULE_DATA.CHAT_ALIAS.USER_ALIAS.forEach(function(item, index)
        {
            item["regex"] = new RegExp(item["pattern"], "g");
        });
    }
});

Hooks.on("chatMessage", function(chatlog, message, chatdata)
{
    var oldMessage = message;
    MODULE_DATA.CHAT_ALIAS.USER_ALIAS.forEach(function(item, index)
    {
        message = message.replace(item["regex"], item["replacement"]);
    });
    MODULE_DATA.CHAT_ALIAS.GLOBAL_ALIAS.forEach(function(item, index)
    {
        message = message.replace(item["regex"], item["replacement"]);
    });
    if(oldMessage != message)
    {
        chatlog.processMessage(message);
        return false;
    }
});

