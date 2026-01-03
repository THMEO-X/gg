require("dotenv").config();

// ================= KEEP ALIVE =================
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Keep_alive running on port ${PORT}`);
});
// ==============================================

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ========= CẤU HÌNH =========
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1336271263479496714";

const ROLE_LIST = {
  role_player: "1336479460563882026",
  gamer: "1336479501139578961",
  support: "1336479554012975238",
  vip: "1375094182183436310",
  lq: "1375094151686914151"
};

const GIF_URL = "https://cdn.discordapp.com/attachments/1170739270093381714/1441759320122327202/images.gif";
// ============================

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot online: ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setTitle("🎭 ROLE MENU")
    .setDescription(
      "Chọn menu bên dưới để **nhận / gỡ role**.\n\n" +
      " Chọn lại để **gỡ role**"
    )
    .setColor(0x00bfff)
    .setImage(GIF_URL)
    .setFooter({ text: "Role Menu" });

  const menu = new StringSelectMenuBuilder()
    .setCustomId("select_role")
    .setPlaceholder("Bấm để nhận role")
    .setMinValues(1)
    .setMaxValues(4)
    .addOptions([
      { label: "Nam", value: "role_player" },
      { label: "Nữ", value: "gamer" },
      { label: "LGBT", value: "support" },
      { label: "Liên Quân", value: "vip" },
      { label: "LỬA MIẾU", value: "lq" }
    ]);

  const row = new ActionRowBuilder().addComponents(menu);

  await channel.send({
    embeds: [embed],
    components: [row]
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "select_role") return;

  const member = interaction.member;
  const selected = interaction.values;

  let added = [];
  let removed = [];

  for (const key in ROLE_LIST) {
    const role = interaction.guild.roles.cache.get(ROLE_LIST[key]);
    if (!role) continue;

    if (selected.includes(key)) {
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role);
        added.push(role.name);
      }
    } else {
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        removed.push(role.name);
      }
    }
  }

  await interaction.reply({
    content:
      ` **Đã cập nhật role**\n` +
      (added.length ? `Đã nhận: **${added.join(", ")}**\n` : "") +
      (removed.length ? `Đã gỡ: **${removed.join(", ")}**` : ""),
    ephemeral: true
  });
});

client.login(TOKEN);