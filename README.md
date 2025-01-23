# SquadJS-BattleMetrics-Ban-Discord-Logger
Banned players via BattleMetrics are detected by SquadJS and logged to Discord.

https://github.com/magicoflolis/SquadJS-BattleMetricsAPI
Firstly, we need to add the BattleMetrics api system to SquadJS. You can do this via the link I added above.

Add these codes into SquadJS/config.json.

{
  ‘plugin": ‘BattleMetricsLogger’,
  ‘enabled": true,
  ‘bmClient": ‘BattleMetrics’,
  ‘logChannelID": ‘channelid’,
  ‘banListName": ‘banlist’,
  ‘checkInterval": 60000
}
