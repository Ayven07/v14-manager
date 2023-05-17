const { Client, ButtonBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");
const db = require('croxydb');

const client = new Client({
  partials: [
    Partials.Message, // for message
    Partials.Channel, // for text channel
    Partials.GuildMember, // for guild member
    Partials.Reaction, // for message reaction
    Partials.GuildScheduledEvent, // for guild events
    Partials.User, // for discord user
    Partials.ThreadMember, // for thread member
  ],
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
    GatewayIntentBits.GuildMembers, // for guild members related things
    GatewayIntentBits.GuildBans, // for manage guild bans
    GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
    GatewayIntentBits.GuildIntegrations, // for discord Integrations
    GatewayIntentBits.GuildWebhooks, // for discord webhooks
    GatewayIntentBits.GuildInvites, // for guild invite managing
    GatewayIntentBits.GuildVoiceStates, // for voice related things
    GatewayIntentBits.GuildPresences, // for user presence things
    GatewayIntentBits.GuildMessages, // for guild messages things
    GatewayIntentBits.GuildMessageReactions, // for message reactions things
    GatewayIntentBits.GuildMessageTyping, // for message typing things
    GatewayIntentBits.DirectMessages, // for dm messages
    GatewayIntentBits.DirectMessageReactions, // for dm message reaction
    GatewayIntentBits.DirectMessageTyping, // for dm message typinh
    GatewayIntentBits.MessageContent, // enable if you need message content things
  ],
});

module.exports = client;

require("./events/message.js")
require("./events/ready.js")

client.login(config.token || process.env.TOKEN).catch(e => {
console.log("1")
})







///////////////////////////KOMUTLAR

const soru = require("./ayar.js");

client.on("interactionCreate", async (i) => {

  const modal = new ModalBuilder()
  .setCustomId('ybasvuru')
  .setTitle('Yetkili Başvuru')
  .setComponents(
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru1")
        .setLabel(`${soru.soru1}`)
        .setStyle(1)
        .setMinLength(5)
        .setMaxLength(20)
        .setPlaceholder(`${soru.cevap1}`)
        .setRequired(true),
      ),
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru2")
        .setLabel(`${soru.soru2}`)
        .setStyle(1)
        .setMinLength(1)
        .setMaxLength(10)
        .setPlaceholder(`${soru.cevap2}`)
        .setRequired(true)
      ),
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru3")
        .setLabel(`${soru.soru3}`)
        .setStyle(1)
        .setMinLength(5)
        .setMaxLength(100)
        .setPlaceholder(`${soru.cevap3}`)
        .setRequired(true)
      ),
      new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru4")
          .setLabel(`${soru.soru4}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap4}`)
          .setRequired(true)
      ),
    new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru5")
          .setLabel(`${soru.soru5}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap5}`)
          .setRequired(true)
      )
  )
  if (i.customId === "basvuru_buton") {
      i.showModal(modal)
  }
  let message ;
  let logKanalı = client.channels.cache.get(config.logKanalı)

  if (i.customId === "ybasvuru") {

      const kabulet = new ButtonBuilder()
      .setCustomId("basvuru_kabul")
      .setLabel("Kabul Et")
      .setStyle(3)
      .setEmoji("✅")

      const reddet = new ButtonBuilder()
      .setCustomId("basvuru_red")
      .setLabel("Reddet")
      .setStyle(1)
      .setEmoji("❌")

      const row4 = new ActionRowBuilder()
      .addComponents(kabulet,reddet)

      
      const soru1 = i.fields.getTextInputValue("soru1");
      const soru2 = i.fields.getTextInputValue("soru2");
      const soru3 = i.fields.getTextInputValue("soru3");
      const soru4 = i.fields.getTextInputValue("soru4");
      const soru5 = i.fields.getTextInputValue("soru5");

      const titan = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: `${i.guild.name} Başvuru Sistemi`})
      .setThumbnail(i.guild.iconURL())
      .setDescription(`
      **${i.user.tag}** - (\`${i.user.id}\`) ** Kullanıcısının Başvuru Formu**
      
      **${soru.soru1}**
      \`${soru1}\`
      **${soru.soru2}**
      \`${soru2}\`
      **${soru.soru3}**
      \`${soru3}\`
      **${soru.soru4}**
      \`${soru4}\`
      **${soru.soru5}**
      \`${soru5}\`
      `)
      .setTimestamp()

      await i.reply({ content: `Başvurun alındı`, ephemeral: true})
      message = await logKanalı.send({ content: `${i.user}`, embeds: [titan], components: [row4]})
      db.set(message.id,i.user.id)
  }

  const basvuruDurum = client.channels.cache.get(config.basvuruDurum)

  if (i.customId === "basvuru_kabul") {

      if (!i.member.roles.cache.has(config.basvuruYt)) return i.reply({ content: `Başvuruyu yanıtlamak için <@&${config.basvuruYt}> rolüne sahip olmalısın`, ephemeral: true})

      const kabulet2 = new ButtonBuilder()
      .setCustomId("basvuru_kabul")
      .setLabel("Kabul Edildi")
      .setStyle(3)
      .setEmoji("✅")
      .setDisabled(true)


      const row5 = new ActionRowBuilder()
      .addComponents(kabulet2)

      i.update({ components: [row5]})
      let kişi = db.get(i.message.id)
      let kullanıcı = i.client.guilds.cache.get(config.guildID).members.cache.get(kişi) 
      kullanıcı.roles.add(config.yetkiRolleri)
      await basvuruDurum.send({ content: `> <@${kişi}>,Başvurunuz kabul edildi  ekimize hoşgeldiniz <a:green:1091729532249186397>  \n> **Sizi onaylayan kişi: **${i.user.toString()}`})
      kullanıcı.user.send(`Yetkili Başvurun Başarıyla **Onaylanmıştır**`).catch(() => {});
      db.delete(i.message.id)
  } 
  if (i.customId === "basvuru_red") {

      let kişi = db.get(i.message.id)
      let kullanıcı = i.client.guilds.cache.get(config.guildID).members.cache.get(kişi)

      const reddet2 = new ButtonBuilder()
      .setCustomId("başvuru_red")
      .setLabel("Reddedildi")
      .setStyle(1)
      .setEmoji("❌")
      .setDisabled(true)

      const row6 = new ActionRowBuilder()
      .addComponents(reddet2)
      await basvuruDurum.send({ content: `> <@${kişi}>, Yetkili başvurun kabul edilmedi <a:red:1086374243404619886> \n> **Sizi onaylamayan kişi: **${i.user.toString()}`})
      i.update({ components: [row6]})
      kullanıcı.user.send(`Yetkili başvurun Kabul edilmedi`).catch(() => {});
      db.delete(i.message.id)
  }
})
//ÖNERİ 
client.on("interactionCreate", async (i) => {

  const modal = new ModalBuilder()
  .setCustomId('yoneri')
  .setTitle('Öneri Sistemi')
  .setComponents(
    new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru6")
          .setLabel(`${soru.soru6}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap6}`)
          .setRequired(true)
      )
  )
  if (i.customId === "oneri") {
      i.showModal(modal)
  }
  let message ;
  let onerikanal = client.channels.cache.get(config.onerikanal)

  if (i.customId === "yoneri") {

      const kabulet1 = new ButtonBuilder()
      .setCustomId("basvuru_kabul1")
      .setLabel("Öneri")
      .setStyle(3)
      .setEmoji("🛡️")

  
      const row4 = new ActionRowBuilder()
      .addComponents(kabulet1)

      
      const soru6 = i.fields.getTextInputValue("soru6");

      const titan = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: `${i.guild.name} Öneri sistemi`})
      .setThumbnail(i.guild.iconURL())
      .setDescription(`
      **${i.user.tag}** - (\`${i.user.id}\`) ** Öneri formu**
      
      **${soru.soru6}**
      \`${soru6}\`
      `)
      .setTimestamp()

      await i.reply({ content: `Öneriniz başarıyla alındı umarım yapılır`, ephemeral: true})
      message = await onerikanal.send({ content: `${i.user}`, embeds: [titan], components: [row4]})
      db.set(message.id,i.user.id)
  }

  const basvuruDurum = client.channels.cache.get(config.basvuruDurum)
})

//şikayet
client.on("interactionCreate", async (i) => {

  const modal = new ModalBuilder()
  .setCustomId('ysikayet')
  .setTitle('Şikayet Sistemi')
  .setComponents(
    new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru7")
          .setLabel(`${soru.soru7}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap7}`)
          .setRequired(true)
      )
  )
  if (i.customId === "sikayet") {
      i.showModal(modal)
  }
  let message ;
  let sikayetkanal = client.channels.cache.get(config.sikayetkanal)

  if (i.customId === "ysikayet") {

      const kabulet2 = new ButtonBuilder()
      .setCustomId("basvuru_kabul2")
      .setLabel("Şikayet")
      .setStyle(3)
      .setEmoji("⚒️")

  
      const row4 = new ActionRowBuilder()
      .addComponents(kabulet2)

      
      const soru7 = i.fields.getTextInputValue("soru7");

      const titan = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: `${i.guild.name} Şikayet sistemi`})
      .setThumbnail(i.guild.iconURL())
      .setDescription(`
      **${i.user.tag}** - (\`${i.user.id}\`) ** Şikayet formu**
      
      **${soru.soru7}**
      \`${soru7}\`
      `)
      .setTimestamp()

      await i.reply({ content: `Şikayetiniz başarıyla alındı umarım düzeltilir`, ephemeral: true})
      message = await sikayetkanal.send({ content: `${i.user}`, embeds: [titan], components: [row4]})
      db.set(message.id,i.user.id)
  }

  const basvuruDurum = client.channels.cache.get(config.basvuruDurum)
})
// yayın
client.on("interactionCreate", async (i) => {

  const modal = new ModalBuilder()
  .setCustomId('yayinci')
  .setTitle('Yayıncı başvuru')
  .setComponents(
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru9")
        .setLabel(`${soru.soru9}`)
        .setStyle(1)
        .setMinLength(5)
        .setMaxLength(20)
        .setPlaceholder(`${soru.cevap9}`)
        .setRequired(true),
      ),
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru8")
        .setLabel(`${soru.soru8}`)
        .setStyle(1)
        .setMinLength(1)
        .setMaxLength(10)
        .setPlaceholder(`${soru.cevap8}`)
        .setRequired(true)
      ),
    new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru2")
          .setLabel(`${soru.soru2}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap2}`)
          .setRequired(true)
      )
  )
  if (i.customId === "yayin") {
      i.showModal(modal)
  }
  let message ;
  let yayınlog = client.channels.cache.get(config.yayınlog)

  if (i.customId === "yayinci") {

      const kabulet8 = new ButtonBuilder()
      .setCustomId("basvuru_kabul8")
      .setLabel("Kabul Et")
      .setStyle(3)
      .setEmoji("✅")

      const reddet8 = new ButtonBuilder()
      .setCustomId("basvuru_red8")
      .setLabel("Reddet")
      .setStyle(1)
      .setEmoji("❌")

      const row4 = new ActionRowBuilder()
      .addComponents(kabulet8,reddet8)

      
      const soru9 = i.fields.getTextInputValue("soru9");
      const soru8 = i.fields.getTextInputValue("soru8");
      const soru2 = i.fields.getTextInputValue("soru2");

      const titan = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: `${i.guild.name} Yayıncı Sistemi`})
      .setThumbnail(i.guild.iconURL())
      .setDescription(`
      **${i.user.tag}** - (\`${i.user.id}\`) ** Yayıncı Form**
      
      **${soru.soru9}**
      \`${soru9}\`
      **${soru.soru8}**
      \`${soru8}\`
      **${soru.soru2}**
      \`${soru2}\`
      `)
      .setTimestamp()

      await i.reply({ content: `Yayıncı başvuru formunuz alındı`, ephemeral: true})
      message = await yayınlog.send({ content: `${i.user}`, embeds: [titan], components: [row4]})
      db.set(message.id,i.user.id)
  }

  const basvuruDurum = client.channels.cache.get(config.basvuruDurum)

  if (i.customId === "basvuru_kabul8") {

      if (!i.member.roles.cache.has(config.basvuruYt)) return i.reply({ content: `Başvuruyu yanıtlamak için <@&${config.basvuruYt}> rolüne sahip olmalısın`, ephemeral: true})

      const kabulet8 = new ButtonBuilder()
      .setCustomId("basvuru_kabul8")
      .setLabel("Kabul Edildi")
      .setStyle(3)
      .setEmoji("✅")
      .setDisabled(true)


      const row5 = new ActionRowBuilder()
      .addComponents(kabulet8)

      i.update({ components: [row5]})
      let kişi = db.get(i.message.id)
      let kullanıcı = i.client.guilds.cache.get(config.guildID).members.cache.get(kişi) 
      kullanıcı.roles.add(config.yayınrol)
      await basvuruDurum.send({ content: `> <@${kişi}>,Yayıncı olarak aramıza kabul edildiniz <a:green:1091729532249186397> \n> **Sizi onaylayan kişi: **${i.user.toString()}`})
      kullanıcı.user.send(`Yayıncı başvurun kabul edildi **Onaylanmıştır**`).catch(() => {});
      db.delete(i.message.id)
  } 
  if (i.customId === "basvuru_red8") {

      let kişi = db.get(i.message.id)
      let kullanıcı = i.client.guilds.cache.get(config.guildID).members.cache.get(kişi)

      const reddet8 = new ButtonBuilder()
      .setCustomId("başvuru_red8")
      .setLabel("Reddedildi")
      .setStyle(1)
      .setEmoji("❌")
      .setDisabled(true)

      const row6 = new ActionRowBuilder()
      .addComponents(reddet8)
      await basvuruDurum.send({ content: `> <@${kişi}>, Yayıncı başvurunuz kabul edilmedi <a:red:1086374243404619886> \n> **Sizi onaylamayan kişi: **${i.user.toString()}`})
      i.update({ components: [row6]})
      kullanıcı.user.send(`Yayıncı başvurun kabul edilmedi`).catch(() => {});
      db.delete(i.message.id)
  }
})
//Sorun çözme
client.on("interactionCreate", async (i) => {

  const modal = new ModalBuilder()
  .setCustomId('soruncu')
  .setTitle('Sorununuz nedir ?')
  .setComponents(
    new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru10")
          .setLabel(`${soru.soru10}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap10}`)
          .setRequired(true)
      )
  )
  if (i.customId === "sorun") {
      i.showModal(modal)
  }
  let message ;
  let sorunlog = client.channels.cache.get(config.sorunlog)

  if (i.customId === "soruncu") {

      const kabulet9 = new ButtonBuilder()
      .setCustomId("basvuru_kabul9")
      .setLabel("Çözmeye git")
      .setStyle(3)
      .setEmoji("📞")

      const row4 = new ActionRowBuilder()
      .addComponents(kabulet9)

      
      const soru10 = i.fields.getTextInputValue("soru10");

      const titan = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: `${i.guild.name} Sorun çözme`})
      .setThumbnail(i.guild.iconURL())
      .setDescription(`
      **${i.user.tag}** - (\`${i.user.id}\`) ** Sorun çözme yetkili çağır**
      
      **${soru.soru10}**
      \`${soru10}\`
      `)
      .setTimestamp()

      await i.reply({ content: `Sorun çözme yetkilimiz geliyor beklemede kalın`, ephemeral: true})
      message = await sorunlog.send({ content: `${i.user}`, embeds: [titan], components: [row4]})
      db.set(message.id,i.user.id)
  }

  const essek = client.channels.cache.get(config.sorunlog)

  if (i.customId === "basvuru_kabul9") {

      if (!i.member.roles.cache.has(config.sorunYt)) return i.reply({ content: `Sorunları çözmek için <@&${config.sorunYt}> rolüne sahip olmalısın`, ephemeral: true})

      const kabulet9 = new ButtonBuilder()
      .setCustomId("basvuru_kabul9")
      .setLabel("Çözmeye gidiyorum")
      .setStyle(3)
      .setEmoji("✅")
      .setDisabled(true)


      const row5 = new ActionRowBuilder()
      .addComponents(kabulet9)

      i.update({ components: [row5]})
      let kişi = db.get(i.message.id)
      let kullanıcı = i.client.guilds.cache.get(config.guildID).members.cache.get(kişi) 
      kullanıcı.roles.add(config.yayınrol)
      await essek.send({ content: `<@${kişi}>`})
      kullanıcı.user.send(`Sorununu çözmeye geliyoruz`).catch(() => {});
      db.delete(i.message.id)
  } 
})
const { joinVoiceChannel } = require('@discordjs/voice')
client.on('ready', () => {
  let channel = client.channels.cache.get(config.botses) 
  

      const VoiceConnection = joinVoiceChannel({
          channelId: channel.id, 
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator 
  });
})
