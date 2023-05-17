const client = require("../ayven");
const { Collection } = require("discord.js")
const fs = require("fs")
const config = require("../config");

client.on("ready", () => {
console.log(`${client.user.tag} Bot Online!`)
client.user.setStatus("idle");
client.user.setActivity(config.botdurum)

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir("./commands/", (err, files) => {
if (err) console.error(err);
console.log(`${files.length} Total Command!`);
files.forEach(f => {
let props = require(`../commands/${f}`);
    
console.log(`${props.help.name} Komut Küklendi!`);
    
client.commands.set(props.help.name, props);
props.conf.aliases.forEach(alias => {
client.aliases.set(alias, props.help.name);
});
});
});

});
