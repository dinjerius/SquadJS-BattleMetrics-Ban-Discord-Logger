# BattleMetricsLogger - Discord Ban Logger for SquadJS

**BattleMetricsLogger** is a plugin designed for [SquadJS](https://github.com/Thomas-Smyth/SquadJS). It logs bans detected on BattleMetrics to a designated Discord channel in a clean and organized embed format. This plugin helps server admins monitor ban activity with ease.

---

## 🚀 Features

- **New Ban Detection**: Only logs newly added bans.
- **Discord Embed Logs**: Sends ban details to a Discord channel in an elegant embed format:
  - **Banned Player**: Player name with a link to their Steam profile.
  - **Ban Reason**: Reason for the ban.
  - **Notes**: Any additional notes provided.
  - **Ban Duration**: The duration of the ban.
  - **Ban Details**: A link to edit the ban on BattleMetrics.
  - **Issued By**: The name of the admin who issued the ban.
- **Efficient Performance**: Periodically checks for new bans with minimal API usage.

---

## 📋 Requirements

- [SquadJS](https://github.com/Thomas-Smyth/SquadJS)
- [SquadJS-BattleMetricsAPI](https://github.com/magicoflolis/SquadJS-BattleMetricsAPI)

---

## 📂 Installation

### 1. SquadJS Plugin Configuration
Add the following to your `config.json`.

```json
{
  "plugin": "BattleMetricsLogger",
  "enabled": true,
  "bmClient": "BattleMetrics",
  "logChannelID": "DISCORD_CHANNEL_ID",
  "checkInterval": 60000
}
```

🛠️ Usage
Start SquadJS: Once configured, start SquadJS.
Discord Logs: Whenever a new ban is detected, the following message will be sent to the Discord channel:

```
🛑 New Ban Detected
Banned Player: [Player Name (Steam Profile Link)]
Ban Reason: [Reason]
Notes: [Additional Notes]
Ban Duration: [Duration or Permanent]
Ban Details: [BattleMetrics Ban Link]
Issued By: [Admin Name or ID]
```

💻 Development and Contributions
If you'd like to contribute to this project, feel free to fork it and submit a pull request. Before doing so, please ensure:

The code adheres to SquadJS standards.
The BattleMetrics API is used correctly.

🌐 Support
If you have any questions or encounter issues, feel free to open an issue on this repository.
Discord: dinjer

