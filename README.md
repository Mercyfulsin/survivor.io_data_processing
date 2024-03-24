# survivor.io_data_processing
A simple script to process the json files exported from the games data. Helps with making data human readable to allow for creation of data charts and info leaks.

# Currently Supported Csv's
```
ItemCsv
RewardCsv
LanguageCsv
HeroWakeCsv
HeroWakeSkillCsv
guildShopCsv
guildTaskCsv
BattlePassRewardCsv
CollectionCsv
guildBossRankCsv
guildBossCsv
EchoRankRewardCsv
EchoBattleSubsection2Csv
```

# Structure
    .
    ├── csvs                                     # Place all json files in here
    │   ├── dump_List`1 (0x7ffe54be6cf0).json    # Raw named file example
    │   └── LanguageCsv.json                     # Properly named file example
    ├── main.js                                  # Main script file
    └── README.md                                # What you are reading
    