# survivor.io_data_processing
A simple script to process the json files exported from the games data. Helps with making data human readable to allow for creation of data charts and info leaks.

# Requirements
Node.js + NPM

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
    │   └── BattlePassRewardCsv.json             # Properly named file example
    ├── readable_csvs                            # Script saves readable files here
    │   └── BattlePassRewardCsv_readable.json    # Readable version
    ├── main.js                                  # Main script file
    └── README.md                                # What you are reading
    
# Instructions
Clone repo and install npm packages then run `main.js`
```
npm i -y
node .
```
## Json Files
Add all the Csv Json files into the `./csvs` folder.
They can be named in any way, the program will rename them.

## Running the app
Make sure to run through each command in order.

### Rename Files
Will go through the `./csvs` folder, opening and using their key as the naming convention.
> ex. LanguageCsv
This is required so the script can import the files properly.

### Sanitize Files
This will rename the extra long detailed names into the name stored within the brackets of the file.
> ex. ObscuredInt < NameId >k__BackingField --> NameId

### Load Files
This will load all the files into memory. Storing individual objects within the files into their respective objects.
While loading, the supported files from your `./csvs` folder will begin replacing referenced items with their values.
> ex. ItemCsv -> {id: 1, itemName: 1234} ==> LanguageCsv -> {id: 1234, name: Coins}

### Write Files
All loaded objects will be printed into `./readable_csvs`.

### Exit
Exits.

