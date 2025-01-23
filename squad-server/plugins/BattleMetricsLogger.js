import BasePlugin from './base-plugin.js';
import pkg from 'discord.js';
const { MessageEmbed } = pkg;

class BattleMetricsLogger extends BasePlugin {
  static get optionsSpecification() {
    return {
      bmClient: {
        required: true,
        description: 'BattleMetrics API client identifier',
        connector: 'BattleMetrics'
      },
      logChannelID: {
        required: true,
        description: 'Discord channel ID where logs will be sent',
        default: ''
      },
      checkInterval: {
        required: false,
        description: 'Interval in milliseconds to check for new bans',
        default: 60000 // 1 min
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);
    this.bmClient = this.options.bmClient; // BattleMetrics API client
    this.discord = connectors.discord; // Discord client
    this.logChannelID = options.logChannelID; // Discord channel ID
    this.checkInterval = this.options.checkInterval;
    this.trackedBanIDs = new Set(); // İzlenen ban ID'lerini tutar
  }

  async mount() {
    console.log("[BattleMetricsLogger] Plugin mounted");

    // Mevcut banları takibe al
    await this.initializeBanTracking();

    // Periyodik olarak yeni banları kontrol et
    this.banCheckInterval = setInterval(() => this.checkNewBans(), this.checkInterval);
  }

  async initializeBanTracking() {
    try {
      const banList = await this.bmClient.getBanList();
      if (banList?.data?.length > 0) {
        banList.data.forEach(ban => this.trackedBanIDs.add(ban.id));
        console.log("[BattleMetricsLogger] Initialized tracked bans:", Array.from(this.trackedBanIDs));
      }
    } catch (error) {
      console.error("[BattleMetricsLogger] Failed to initialize ban tracking:", error);
    }
  }

  async checkNewBans() {
    try {
      // Ban listesini API'den çek
      const banList = await this.bmClient.getBanList();
      if (!banList || !Array.isArray(banList.data)) {
        console.log("[BattleMetricsLogger] No bans found in current check.");
        return;
      }

      // Yeni banları kontrol et
      const newBans = banList.data.filter(ban => !this.trackedBanIDs.has(ban.id));

      if (newBans.length > 0) {
        console.log(`[BattleMetricsLogger] Found ${newBans.length} new bans:`, newBans);

        // Yeni banları Discord'a logla
        const channel = await this.discord.channels.fetch(this.logChannelID);
        if (channel) {
          for (const ban of newBans) {
            const playerName = ban.meta?.player || "Unknown";
            const steamID = ban.attributes?.identifiers?.find(id => id.type === 'steamID')?.identifier || "Unknown";
            const reason = ban.attributes?.reason || "No reason provided";
            const note = ban.attributes?.note?.replace(/<[^>]*>?/gm, '') || "No notes provided";
            const duration = ban.attributes?.expires || "Permanent";
            const banID = ban.id;

            // Kullanıcı adı yerine ID'yi çekmek için bir sorgu
            const issuedByID = ban.relationships?.user?.data?.id || "Unknown";
            const issuedByName = await this.fetchUserName(issuedByID);

            const steamProfileLink = `https://steamcommunity.com/profiles/${steamID}`;
            const battleMetricsLink = `https://www.battlemetrics.com/rcon/bans/edit/${banID}`;

            const embed = {
              color: 0xff0000,
              title: '🛑 Yeni Ban Tespit Edildi',
              fields: [
                { name: 'Banlanan Oyuncu', value: `[${playerName}](${steamProfileLink})`, inline: false },
                { name: 'Ban Sebebi', value: reason, inline: false },
                { name: 'Notlar', value: note, inline: false },
                { name: 'Ban Süresi', value: duration, inline: false },
                { name: 'Ban Detayları', value: `[BattleMetrics Linki](${battleMetricsLink})`, inline: false },
                { name: 'Banlayan Yetkili', value: issuedByName || issuedByID, inline: false }
              ],
              timestamp: new Date(ban.attributes?.timestamp).toISOString(),
              footer: { text: 'BattleMetrics Logger' }
            };

            await channel.send({ embeds: [embed] });
          }
        }

        // Yeni banları takibe ekle
        newBans.forEach(ban => this.trackedBanIDs.add(ban.id));
      } else {
        console.log("[BattleMetricsLogger] No new bans detected.");
      }
    } catch (error) {
      console.error("[BattleMetricsLogger] Failed to check for new bans:", error);
    }
  }

  async fetchUserName(userID) {
    try {
      const user = await this.bmClient.getUser(userID); // Varsayılan bir BattleMetrics API çağrısı
      return user?.attributes?.name || userID;
    } catch (error) {
      console.error(`[BattleMetricsLogger] Failed to fetch user name for ID: ${userID}`, error);
      return userID; // Eğer hata olursa ID'yi döndür
    }
  }

  async unmount() {
    // Zamanlayıcıyı durdur
    if (this.banCheckInterval) {
      clearInterval(this.banCheckInterval);
      console.log("[BattleMetricsLogger] interval cleared");
    }
  }
}

export default BattleMetricsLogger;
