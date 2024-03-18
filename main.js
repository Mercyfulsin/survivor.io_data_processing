const fs = require('fs');
const path = require('path');

const rewardcsv = path.resolve(__dirname, './csvs/RewardCsv.json');
const rewardcsv_data = require(rewardcsv);
const itemcsv = path.resolve(__dirname, './csvs/ItemCsv.json');
const itemcsv_data = require(itemcsv);
const languagecsv = path.resolve(__dirname, './csvs/LanguageCsv.json');
const languagecsv_data = require(languagecsv);
const echorankrewardcsv = path.resolve(__dirname, './csvs/EchoRankRewardCsv.json');
const echorankrewardcsv_data = require(echorankrewardcsv);
const echobattlesubsection2csv = path.resolve(__dirname, './csvs/EchoBattleSubsection2Csv.json');
const echobattlesubsection2csv_data = require(echobattlesubsection2csv);
const herowakeskillcsv = path.resolve(__dirname, './csvs/HeroWakeSkillCsv.json');
const herowakeskillcsv_data = require(herowakeskillcsv);
const herowakecsv = path.resolve(__dirname, './csvs/HeroWakeCsv.json');
const herowakecsv_data = require(herowakecsv);
const guildshopcsv = path.resolve(__dirname, './csvs/guildShopCsv.json');
const guildshopcsv_data = require(guildshopcsv);
const guildtaskcsv = path.resolve(__dirname, './csvs/guildTaskCsv.json');
const guildtaskcsv_data = require(guildtaskcsv);
const battlepassrewardcsv = path.resolve(__dirname, './csvs/BattlePassRewardCsv.json');
const battlepassrewardcsv_data = require(battlepassrewardcsv);
const collectioncsv = path.resolve(__dirname, './csvs/CollectionCsv.json');
const collectioncsv_data = require(collectioncsv);


let itemcsv_populated = [];
let rewardcsv_populated = [];
let languagecsv_populated = [];
let echorankrewardcsv_populated = [];
let echobattlesubsection2csv_populated = [];
let herowakeskillcsv_populated = [];
let herowakecsv_populated = [];
let guildtaskcsv_populated = [];
let guildshopcsv_populated = [];
let battlepassrewardcsv_populated = [];
let collectioncsv_populated = [];

const searchValueByKey = (array, key, value) => {
    return array.find(item => item[key] === value);
};

function populateEchoBattleSubsection2Csv() {
    for (let i = 0; i < echobattlesubsection2csv_data.length; i++) {
        let tempJson = {};
        for (const item in echobattlesubsection2csv_data[i].EchoBattleSubsection2Row) {
            tempJson[item] = echobattlesubsection2csv_data[i].EchoBattleSubsection2Row[item];
        }
        echobattlesubsection2csv_populated.push(tempJson);
    }
}

function populateLanguageCsv() {
    for (let i = 0; i < languagecsv_data.length; i++) {
        let tempJson = {};
        for (const item in languagecsv_data[i].LanguageRow) {
            tempJson[item] = languagecsv_data[i].LanguageRow[item];
        }
        languagecsv_populated.push(tempJson);
    }
}

function populateItemCsv() {
    for (let i = 0; i < itemcsv_data.length; i++) {
        let tempJson = {};
        currentItem = itemcsv_data[i].ItemRow;
        for (const item in currentItem) {
            if (item === 'item_name' && currentItem[item] != 0) {
                let val = currentItem[item];
                try {
                    let name = searchValueByKey(languagecsv_populated, 'id', val);
                    tempJson[item] = name.EN;
                } catch (e) {
                    tempJson[item] = currentItem[item];
                }

            } else if (item === 'desc' && currentItem[item] != 0) {
                let val = itemcsv_data[i].ItemRow[item];
                try {
                    let name = searchValueByKey(languagecsv_populated, 'id', val);
                    tempJson[item] = name.EN;
                } catch (e) {
                    tempJson[item] = currentItem[item];
                }
            } else {
                tempJson[item] = currentItem[item];
            }
        }
        itemcsv_populated.push(tempJson);
    }
}

function populateRewardCsv() {
    for (let i = 0; i < rewardcsv_data.length; i++) {
        let tempJson = {};
        currentItem = rewardcsv_data[i].RewardRow;
        for (const item in currentItem) {
            if (item === 'reward_old' && currentItem[item].length != 0) {
                let tempArray = [];
                for (let i = 0; i < currentItem[item].length; i++) {
                    let itemId = currentItem[item][i]["System.Int32[]"][0];
                    let itemQty = currentItem[item][i]["System.Int32[]"][1];
                    let itemName = searchValueByKey(itemcsv_populated, 'id', itemId).item_name;
                    let string = `${itemQty}x ${itemName}`;
                    tempArray.push(string);
                }
                tempJson[item] = tempArray;
            } else if (item === 'reward' && currentItem[item].length != 0) {
                let tempArray = [];
                for (let i = 0; i < currentItem[item].length; i++) {
                    let itemId = currentItem[item][i]["System.Int32[]"][0];
                    let itemQty = currentItem[item][i]["System.Int32[]"][1];
                    let itemName = searchValueByKey(itemcsv_populated, 'id', itemId).item_name;
                    let string = `${itemQty}x ${itemName}`;
                    tempArray.push(string);
                }
                tempJson[item] = tempArray;
            } else {
                tempJson[item] = currentItem[item];
            }
        }
        rewardcsv_populated.push(tempJson);
    }
}

function populateEchoRankRewardCsv() {
    const oldRank = { "1": "Novice", "2": "Elite", "3": "Ace" };
    for (let i = 0; i < echorankrewardcsv_data.length; i++) {
        let tempJson = {};
        currentItem = echorankrewardcsv_data[i].EchoRankRewardRow;
        for (const item in currentItem) {
            switch (item) {
                case 'SubsectionID':
                    let newSection = searchValueByKey(echobattlesubsection2csv_populated, "ID", currentItem.SubsectionID);
                    let oldSection = oldRank[currentItem.SubsectionID];
                    tempJson[item] = currentItem.Tag < 18 ? oldSection : newSection.atlasId;
                    break;
                case 'Rewardid1':
                case 'Rewardid2':
                case 'Rewardid3':
                    let reward = searchValueByKey(rewardcsv_populated, 'id', currentItem[item]);
                    let final = reward ? reward : { "reward": 0 };
                    tempJson[item] = final.reward;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        echorankrewardcsv_populated.push(tempJson);
    }
}

function populateHeroWakeSkillCsv() {
    for (let i = 0; i < herowakeskillcsv_data.length; i++) {
        let tempJson = {};
        currentItem = herowakeskillcsv_data[i].HeroWakeSkillRow;
        for (const item in currentItem) {
            switch (item) {
                case 'NameId':
                case 'DescId':
                    let val = currentItem[item];
                    let name = searchValueByKey(languagecsv_populated, 'id', parseInt(val));
                    tempJson[item] = name.EN;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        herowakeskillcsv_populated.push(tempJson);
    }
}

function populateHeroWakeCsv() {
    for (let i = 0; i < herowakecsv_data.length; i++) {
        let tempJson = {};
        currentItem = herowakecsv_data[i].HeroWakeRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'wakeDesc':
                    let name = searchValueByKey(languagecsv_populated, 'id', parseInt(val));
                    tempJson[item] = name.EN;
                    break;
                case 'wakeItem':
                case 'wakeItemAll':
                    let tempArray = [];
                    for (let z = 0; z < val.length; z++) {
                        let name = searchValueByKey(itemcsv_populated, 'id', parseInt(val[z]['CodeStage.AntiCheat.ObscuredTypes.ObscuredInt[]'][0]));
                        let qty = val[z]['CodeStage.AntiCheat.ObscuredTypes.ObscuredInt[]'][0][1];
                        let string = `${qty}x ${name.item_name}`;
                        tempArray.push(string);
                    }
                    tempJson[item] = tempArray;
                    break;
                case 'wakeSkill':
                    let tempArray2 = [];
                    for (let z = 0; z < val.length; z++) {
                        let name2 = searchValueByKey(herowakeskillcsv_populated, 'ID', val[z]);
                        let string2 = `${name2.NameId}`;
                        tempArray2.push(string2);
                    }
                    tempJson[item] = tempArray2;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        herowakecsv_populated.push(tempJson);
    }
}

function populateGuildTaskCsv() {
    for (let i = 0; i < guildtaskcsv_data.length; i++) {
        let tempJson = {};
        currentItem = guildtaskcsv_data[i].guildTaskRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'Reward':
                case 'OtherReward':
                    let tempArray = [];
                    for (let z = 0; z < val.length; z++) {
                        let name = searchValueByKey(itemcsv_populated, 'id', parseInt(val[z]["System.Int32[]"][0]));
                        let qty = val[z]["System.Int32[]"][1];
                        let string = `${qty}x ${name.item_name}`;
                        tempArray.push(string);
                    }
                    tempJson[item] = tempArray;
                    break;
                case 'Price':
                    let tempArray2 = [];
                    for (let z = 0; z < val.length; z++) {
                        let name2 = searchValueByKey(itemcsv_populated, 'id', parseInt(val[z]["System.Int32[]"][0]));
                        let qty2 = val[z]["System.Int32[]"][1];
                        let string2 = `${qty2}x ${name2.item_name}`;
                        tempArray2.push(string2);
                    }
                    tempJson[item] = tempArray2;
                    break;
                case 'languageId':
                    let language = searchValueByKey(languagecsv_populated, 'id', parseInt(val));
                    tempJson[item] = language.EN;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        guildtaskcsv_populated.push(tempJson);
    }
}

function populateGuildShopCsv() {
    for (let i = 0; i < guildshopcsv_data.length; i++) {
        let tempJson = {};
        currentItem = guildshopcsv_data[i].guildShopRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'Reward':
                    let tempArray = [];
                    for (let z = 0; z < val.length; z++) {
                        let name = searchValueByKey(itemcsv_populated, 'id', parseInt(val[z]["System.Int32[]"][0]));
                        let qty = val[z]["System.Int32[]"][1];
                        let string = `${qty}x ${name.item_name}`;
                        tempArray.push(string);
                    }
                    tempJson[item] = tempArray;
                    break;
                case 'Price':
                    let tempArray2 = [];
                    for (let z = 0; z < val.length; z++) {
                        let name2 = searchValueByKey(itemcsv_populated, 'id', parseInt(val[0]));
                        let qty2 = val[1];
                        let string2 = `${qty2}x ${name2.item_name}`;
                        tempArray2.push(string2);
                    }
                    tempJson[item] = tempArray2;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        guildshopcsv_populated.push(tempJson);
    }
}

function populateBattlePassRewardCsv() {
    for (let i = 0; i < battlepassrewardcsv_data.length; i++) {
        let tempJson = {};
        currentItem = battlepassrewardcsv_data[i].BattlePassRewardRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'RewardFree':
                case 'RewardLower':
                case 'RewardNormal':
                    let tempArray = [];
                    for (let z = 0; z < val.length; z++) {
                        let name = searchValueByKey(itemcsv_populated, 'id', parseInt(val[z]["System.Int32[]"][0]));
                        let qty = val[z]["System.Int32[]"][1];
                        let string = `${qty}x ${name.item_name}`;
                        tempArray.push(string);
                    }
                    tempJson[item] = tempArray;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        battlepassrewardcsv_populated.push(tempJson);
    }
}

function populateCollectionCsv() {
    for (let i = 0; i < collectioncsv_data.length; i++) {
        let tempJson = {};
        currentItem = collectioncsv_data[i].CollectionRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'starId':
                    let tempArray = [];
                    for (let z = 0; z < val.length; z++) {
                        let string = searchValueByKey(languagecsv_populated, 'id', parseInt(val[z]));
                        tempArray.push(string.EN);
                    }
                    tempJson[item] = tempArray;
                    break;
                case 'name':
                case 'desc':
                    let name = searchValueByKey(languagecsv_populated, 'id', parseInt(val));
                    tempJson[item] = name.EN;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        collectioncsv_populated.push(tempJson);
    }
}

function writeFile(arr) {
    const jsonData = JSON.stringify(arr);

    fs.writeFile('output.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File has been written successfully.');
    });
}

function renameFiles() {
    fs.readdir('./csvs', (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        files.forEach(file => {
            if (path.extname(file) === '.json') {
                const filePath = path.join('./csvs', file);

                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }
                    const regex = /".*? <(.*?)>.*?":/g; // Regex pattern to match text inside <>
                    const replacedData = data.replace(regex, (match, captureGroup) => `"${captureGroup}":`);
                    // Write replaced data back to the file
                    fs.writeFile(filePath, replacedData, 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                            return;
                        }
                        console.log('Successfully replaced and saved data to file.');
                    });
                    try {
                        const jsonData = JSON.parse(data);
                        const firstKey = Object.keys(jsonData[0])[0];
                        const newName = firstKey.substring(0, firstKey.length - 3).concat("Csv");
                        console.log('Renaming', file, ':', newName);
                        fs.rename(filePath, path.join('./csvs', newName + '.json'), err => {
                            if (err) {
                                console.error('Error renaming file:', err);
                            } else {
                                console.log(`Renamed ${file} to ${newName}.json`);
                            }
                        });
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                });
            }
        });
    });
}


// Perform actions
renameFiles();
populateEchoBattleSubsection2Csv();
populateLanguageCsv();
populateItemCsv();
populateRewardCsv();
populateEchoRankRewardCsv();
populateHeroWakeSkillCsv();
populateHeroWakeCsv();
populateGuildTaskCsv();
populateGuildShopCsv();
populateBattlePassRewardCsv();
populateCollectionCsv();

// writeFile(collectioncsv_populated);