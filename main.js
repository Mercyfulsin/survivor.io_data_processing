const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const translate = require('translate-google');
const { la } = require('translate-google/languages');

let user_csv_collection = [];

// Language
// let translate_language = 'ESP';
let translate_language = 'EN';
// let translate_language = 'FRA';


// Where Modified data lives in memory
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
let guildbossrankcsv_populated = [];
let guildbosscsv_populated = [];
let turbominesbasecsv_populated = [];
let monopolybasecsv_populated = [];
let festivaltaskcsv_populated = [];
let shopcsv_populated = [];
let festivalgiftrewardcsv_populated = [];
let festivalgiftcsv_populated = [];

//#region Tool Functions
const checkSubset = (parentArray, subsetArray) => {
    return subsetArray.every((el) => {
        return parentArray.includes(el)
    })
}

const searchValueByKey = (array, key, value) => {
    return array.find(item => item[key] === value);
}

function writeFile() {
    for (let key in master_object) {
        let data = master_object[key][3];
        if (data.length != 0) {
            const jsonData = JSON.stringify(data, undefined, 4);
            fs.writeFile(`./readable_csvs/${key}_readable_${translate_language}.json`, jsonData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File has been written successfully.');
            });
        }
    }
}

function regexFiles() {
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
                    });
                });
            }
        });
    });
    console.log("Files have been regex'd!");
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
                    try {
                        const jsonData = JSON.parse(data);
                        const firstKey = Object.keys(jsonData[0])[0];
                        const newName = firstKey.substring(0, firstKey.length - 3).concat("Csv");
                        fs.rename(filePath, path.join('./csvs', newName + '.json'), err => {
                            if (err) {
                                console.error('Error renaming file:', err);
                            }
                        });
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                });
            }
        });
    });
    console.log("Files have been renamed!");
}

function loadFiles() {
    fs.readdir('./csvs', (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        files.forEach(file => {
            if (path.extname(file) === '.json') {
                const filePath = path.join('./csvs', file);
                let data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
                try {
                    const jsonData = JSON.parse(data);
                    const firstKey = Object.keys(jsonData[0])[0];
                    const newName = firstKey.substring(0, firstKey.length - 3).concat("Csv");
                    master_object[newName] ? user_csv_collection.push(newName) : "";
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                }
            }
        });
        console.log("\nLoaded Supported File Names!");
        console.log(user_csv_collection);
        populateMaster();
    });
}
//#endregion



//#region Population Functions
function populateMaster() {
    let user_csv_supported = [];
    let len = user_csv_collection.length + 1;
    let trigger = true;
    do {
        user_csv_collection.forEach((file) => {
            let compare = [file];
            let required_csvs = master_object[file][1];
            if (JSON.stringify(compare) == JSON.stringify(required_csvs)) {
                user_csv_supported.push(file);
                const index = user_csv_collection.indexOf(file);
                if (index > -1) {
                    user_csv_collection.splice(index, 1);
                }
            } else {
                if (checkSubset(user_csv_supported, required_csvs)) {
                    user_csv_supported.push(file);
                    const index = user_csv_collection.indexOf(file);
                    if (index > -1) {
                        user_csv_collection.splice(index, 1);
                    }
                };
            }
        });
        len === user_csv_collection.length ? trigger = false : len = user_csv_collection.length;
    } while (trigger);
    console.log('Files that have required Csv\'s');
    console.log(user_csv_supported);

    for (let i = 0; i < user_csv_supported.length; i++) {
        let name = user_csv_supported[i];
        let data = require(master_object[name][0]);
        master_object[name][2](data);
        console.log(`Populated ${name}.`);
    }

}

function populateGuildBossRankCsv(guildbossrankcsv_data) {
    for (let i = 0; i < guildbossrankcsv_data.length; i++) {
        let tempJson = {};
        currentItem = guildbossrankcsv_data[i].guildBossRankRow;
        for (const item in currentItem) {
            switch (item) {
                case 'RankReward':
                    let singleReward = [];
                    let allReward = [];
                    for (let x = 0; x < currentItem[item].length; x++) {
                        let currReward = currentItem[item][x]['System.Int32[]'];
                        let reward = searchValueByKey(rewardcsv_populated, 'id', currReward[2]);
                        singleReward = reward.reward.slice();
                        singleReward.unshift(`Rank ${currReward[0]}`, `Clan EXP: ${currReward[3]}`);
                        allReward.push(singleReward);
                    }
                    tempJson[item] = allReward;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        guildbossrankcsv_populated.push(tempJson);
    }
}

function populateGuildBossCsv(guildbosscsv_data) {
    for (let i = 0; i < guildbosscsv_data.length; i++) {
        let tempJson = {};
        currentItem = guildbosscsv_data[i].guildBossRow;
        for (const item in currentItem) {
            switch (item) {
                case 'MissionReward':
                    let missionReward = [];
                    for (let x = 0; x < currentItem[item].length; x++) {
                        let reward = searchValueByKey(rewardcsv_populated, 'id', currentItem[item][x]);
                        missionReward.push(reward.reward.slice());
                    }
                    tempJson[item] = missionReward;
                    break;
                case 'BossReward':
                    let singleReward = [];
                    let bossReward = [];
                    for (let x = 0; x < currentItem[item].length; x++) {
                        let currReward = currentItem[item][x]['System.Int32[]'];
                        let reward = searchValueByKey(rewardcsv_populated, 'id', currReward[1]);
                        singleReward = reward.reward.slice();
                        singleReward.unshift(`Medals ${currReward[0]}`);
                        bossReward.push(singleReward);
                    }
                    tempJson[item] = bossReward;
                    break;
                case 'AnticheatBossHp':
                case 'SpecialLimit':
                case 'AntiCheat1':
                case 'AntiCheat2':
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        guildbosscsv_populated.push(tempJson);
    }
}

function populateEchoBattleSubsection2Csv(echobattlesubsection2csv_data) {
    for (let i = 0; i < echobattlesubsection2csv_data.length; i++) {
        let tempJson = {};
        for (const item in echobattlesubsection2csv_data[i].EchoBattleSubsection2Row) {
            tempJson[item] = echobattlesubsection2csv_data[i].EchoBattleSubsection2Row[item];
        }
        echobattlesubsection2csv_populated.push(tempJson);
    }
}

function populateLanguageCsv(languagecsv_data) {
    for (let i = 0; i < languagecsv_data.length; i++) {
        let tempJson = {};
        for (const item in languagecsv_data[i].LanguageRow) {
            tempJson[item] = languagecsv_data[i].LanguageRow[item];
        }
        languagecsv_populated.push(tempJson);
    }
}

function populateItemCsv(itemcsv_data) {
    for (let i = 0; i < itemcsv_data.length; i++) {
        let tempJson = {};
        currentItem = itemcsv_data[i].ItemRow;
        for (const item in currentItem) {
            if (item === 'item_name' && currentItem[item] != 0) {
                let val = currentItem[item];
                try {
                    let name = searchValueByKey(languagecsv_populated, 'id', val);
                    tempJson[item] = name[translate_language];
                } catch (e) {
                    tempJson[item] = currentItem[item];
                }

            } else if (item === 'desc' && currentItem[item] != 0) {
                let val = itemcsv_data[i].ItemRow[item];
                try {
                    let name = searchValueByKey(languagecsv_populated, 'id', val);
                    tempJson[item] = name[translate_language];
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

function populateRewardCsv(rewardcsv_data) {
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
                    let iconId = searchValueByKey(itemcsv_populated, 'id', itemId).iconId;
                    let string = [`${itemQty}x ${itemName}`, `${itemQty}x :${iconId}:`];
                    tempArray.push(string);
                }
                tempJson[item] = tempArray;
            } else if (item === 'desc') {
                // let val = currentItem[item];
                // translate(val, { from: 'zh-cn', to: 'en' }).then(res => {
                //     console.log(res);
                //     tempJson[item] = res;
                // }).catch(err => {
                //     console.error(err)
                // });
                tempJson[item] = currentItem[item];
            } else {
                tempJson[item] = currentItem[item];
            }
        }
        rewardcsv_populated.push(tempJson);
    }
}

function populateEchoRankRewardCsv(echorankrewardcsv_data) {
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

function populateHeroWakeSkillCsv(herowakeskillcsv_data) {
    for (let i = 0; i < herowakeskillcsv_data.length; i++) {
        let tempJson = {};
        currentItem = herowakeskillcsv_data[i].HeroWakeSkillRow;
        for (const item in currentItem) {
            switch (item) {
                case 'NameId':
                case 'DescId':
                    let val = currentItem[item];
                    let name = searchValueByKey(languagecsv_populated, 'id', parseInt(val));
                    tempJson[item] = name[translate_language];
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        herowakeskillcsv_populated.push(tempJson);
    }
}

function populateHeroWakeCsv(herowakecsv_data) {
    for (let i = 0; i < herowakecsv_data.length; i++) {
        let tempJson = {};
        currentItem = herowakecsv_data[i].HeroWakeRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'wakeDesc':
                    let name = searchValueByKey(languagecsv_populated, 'id', parseInt(val));
                    tempJson[item] = name[translate_language];
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

function populateGuildTaskCsv(guildtaskcsv_data) {
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
                    tempJson[item] = language[translate_language];
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        guildtaskcsv_populated.push(tempJson);
    }
}

function populateGuildShopCsv(guildshopcsv_data) {
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

function populateBattlePassRewardCsv(battlepassrewardcsv_data) {
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

function populateCollectionCsv(collectioncsv_data) {
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
                        string ? tempArray.push(string[translate_language]) : tempArray.push(val[z]);
                    }
                    tempJson[item] = tempArray
                    break;
                case 'name':
                case 'desc':
                    let name = searchValueByKey(languagecsv_populated, 'id', parseInt(val));
                    name ? tempJson[item] = name[translate_language] : tempJson[item] = val;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        collectioncsv_populated.push(tempJson);
    }
}

function populateFestivalTaskCsv(festivaltaskcsv_data) {
    const grouped = festivaltaskcsv_data.reduce((acc, { FestivalTaskRow }) => {
        const { ConnectActivityId, Describe, Need, Reward } = FestivalTaskRow;
        const taskIcon = searchValueByKey(itemcsv_populated, 'id', parseInt(Reward[0]["System.Int32[]"][0])).iconId;
        const taskQty = Reward[0]["System.Int32[]"][1];
        const describeText = searchValueByKey(languagecsv_populated, 'id', parseInt(Describe))[translate_language];
        if (!acc[ConnectActivityId]) {
            acc[ConnectActivityId] = {};
        }

        if (!acc[ConnectActivityId][describeText]) {
            acc[ConnectActivityId][describeText] = [];
        }

        // acc[ConnectActivityId][describeText].push({ Need, Reward });
        acc[ConnectActivityId][describeText].push(`${Need}x  -- ${taskQty}x :${taskIcon}:`);
        return acc;
    }, {});
    festivaltaskcsv_populated.push(grouped);
    // let currentEvent = 0;
    // let currentDescribe = '';
    // let currentJson = {};
    // let taskReward;
    // let rewardIcon;
    // for (let i = 0; i < festivaltaskcsv_data.length; i++) {
    //     currentItem = festivaltaskcsv_data[i].FestivalTaskRow;
    //     console.log(i);
    //     if(!taskReward){
    //         taskReward = searchValueByKey(itemcsv_populated, 'id', parseInt(currentItem.Reward[0]["System.Int32[]"][0])).item_name;
    //         rewardIcon = searchValueByKey(itemcsv_populated, 'id', parseInt(currentItem.Reward[0]["System.Int32[]"][0])).iconId;
    //     } 
    //     console.log("here");
    //     const describeText = searchValueByKey(languagecsv_populated, 'id', parseInt(currentItem.Describe))[translate_language];
    //     const connectactivityid = currentItem.ConnectActivityId;
    //     const describe = currentItem.Describe;
    //     const need = currentItem.Need;
    //     const qty = currentItem.Reward[0]["System.Int32[]"][1];
    //     console.log("there");
    //     if (currentEvent != connectactivityid){
    //         console.log("not same");
    //         currentEvent = connectactivityid;
    //         currentDescribe = currentItem.Describe;
    //         currentJson[currentEvent].'id' = []; 
    //         console.log(currentEvent, currentDescribe);
    //         currentJson[currentEvent][`${describeText}`] = [`${need}x  -- ${qty}x :${taskIcon}:`];
    //         console.log('fail');
    //         uniqueEvent[currentEvent] = currentJson;
    //     } else if (currentDescribe != describe) {
    //         console.log("not same describe");
    //         currentJson[currentEvent][describeText] = [`${need}x  -- ${qty}x :${taskIcon}:`];
    //     } else {
    //         console.log("same describe");
    //         currentJson[currentEvent][describeText].push(`${need}x  -- ${qty}x :${taskIcon}:`);
    //     }
    // }
    // festivaltaskcsv_populated.push(currentJson);
    // console.log(currentJson);
}

function populateShopCsv(shopcsv_data) {
    for (let i = 0; i < shopcsv_data.length; i++) {
        let tempJson = {};
        currentItem = shopcsv_data[i].ShopRow;
        for (const item in currentItem) {
            tempJson[item] = currentItem[item];
        }
        shopcsv_populated.push(tempJson);
    }
}

function populateFestivalGiftRewardCsv(festivalgiftrewardcsv_data) {
    for (let i = 0; i < festivalgiftrewardcsv_data.length; i++) {
        let tempJson = {};
        currentItem = festivalgiftrewardcsv_data[i].FestivalGiftRewardRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'ShopId':
                    let price = searchValueByKey(itemcsv_populated, 'ID', parseInt(val));
                    price ? tempJson[item] = price.price : tempJson[item] = val;
                    break;
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
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        festivalgiftrewardcsv_populated.push(tempJson);
    }

}

function populateFestivalGiftCsv(festivalgiftcsv_data) {
    for (let i = 0; i < festivalgiftcsv_data.length; i++) {
        let tempJson = {};
        currentItem = festivalgiftcsv_data[i].FestivalGiftRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'GiftRewardId':
                case 'GiftRewardId_CN':
                    let tempArray = [];
                    for (let z = 0; z < val.length; z++) {
                        let reward = searchValueByKey(festivalgiftrewardcsv_populated, 'ID', parseInt(val[z]));
                        tempArray.push(reward);
                    }
                    tempJson[item] = tempArray;
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        festivalgiftcsv_populated.push(tempJson);
    }

}

// Base Csv's
function populateTurbominesBaseCsv(turbominesbasecsv_data) {
    for (let i = 0; i < turbominesbasecsv_data.length; i++) {
        let tempJson = {};
        currentItem = turbominesbasecsv_data[i].TurbominesBaseRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'BigReward':
                    let tempArray = [];
                    tempJson['IconList'] = [];
                    tempJson['embedReady'] = [];
                    for (let z = 0; z < val.length; z++) {
                        let name = searchValueByKey(rewardcsv_populated, 'id', parseInt(val[z]["System.Int32[]"][1]));
                        let qty = val[z]["System.Int32[]"][0];
                        let string = `${qty}x ${name.reward}`;
                        tempArray.push(string);
                        tempJson['IconList'].push(name.reward[0][1]);
                        tempJson['embedReady'].push(`${qty}x ${name.reward[0][1]}`);
                    }
                    tempJson[item] = tempArray;
                    break;
                case 'LotteryItem':
                case 'PointItem':
                    let name = searchValueByKey(itemcsv_populated, 'id', parseInt(val));
                    tempJson[item] = [name.item_name, name.iconId];
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        turbominesbasecsv_populated.push(tempJson);
    }
}

function populateMonopolyBaseCsv(monopolybasecsv_data) {
    for (let i = 0; i < monopolybasecsv_data.length; i++) {
        let tempJson = {};
        currentItem = monopolybasecsv_data[i].MonopolyBaseRow;
        for (const item in currentItem) {
            let val = currentItem[item];
            switch (item) {
                case 'BigReward':
                    let tempArray = [];
                    tempJson['IconList'] = [];
                    tempJson['embedReady'] = [];
                    for (let z = 0; z < val.length; z++) {
                        let name = searchValueByKey(rewardcsv_populated, 'id', parseInt(val[z]["System.Int32[]"][1]));
                        let qty = val[z]["System.Int32[]"][0];
                        let string = `${qty}x ${name.reward}`;
                        tempArray.push(string);
                        tempJson['IconList'].push(name.reward[0][1]);
                        tempJson['embedReady'].push(`${qty}x ${name.reward[0][1]}`);
                    }
                    tempJson[item] = tempArray;

                    break;
                case 'DiceItem':
                case 'MagicDicItem':
                case 'StarItem':
                    let name = searchValueByKey(itemcsv_populated, 'id', parseInt(val));
                    tempJson[item] = [name.item_name, name.iconId];
                    break;
                default:
                    tempJson[item] = currentItem[item];
            }
        }
        monopolybasecsv_populated.push(tempJson);
    }
}
//#endregion

// Main Object
const master_object = {
    'ItemCsv': [path.resolve(__dirname, './csvs/ItemCsv.json'), ['LanguageCsv'], populateItemCsv, itemcsv_populated],
    'RewardCsv': [path.resolve(__dirname, './csvs/RewardCsv.json'), ['LanguageCsv', 'ItemCsv'], populateRewardCsv, rewardcsv_populated],
    'LanguageCsv': [path.resolve(__dirname, './csvs/LanguageCsv.json'), ['LanguageCsv'], populateLanguageCsv, languagecsv_populated],
    'HeroWakeCsv': [path.resolve(__dirname, './csvs/HeroWakeCsv.json'), ['LanguageCsv', 'HeroWakeSkillCsv', 'ItemCsv'], populateHeroWakeCsv, herowakecsv_populated],
    'HeroWakeSkillCsv': [path.resolve(__dirname, './csvs/HeroWakeSkillCsv.json'), ['LanguageCsv'], populateHeroWakeSkillCsv, herowakeskillcsv_populated],
    'guildShopCsv': [path.resolve(__dirname, './csvs/guildShopCsv.json'), ['ItemCsv'], populateGuildShopCsv, guildshopcsv_populated],
    'guildTaskCsv': [path.resolve(__dirname, './csvs/guildTaskCsv.json'), ['ItemCsv', 'LanguageCsv'], populateGuildTaskCsv, guildtaskcsv_populated],
    'BattlePassRewardCsv': [path.resolve(__dirname, './csvs/BattlePassRewardCsv.json'), ['ItemCsv'], populateBattlePassRewardCsv, battlepassrewardcsv_populated],
    'CollectionCsv': [path.resolve(__dirname, './csvs/CollectionCsv.json'), ['LanguageCsv'], populateCollectionCsv, collectioncsv_populated],
    'guildBossRankCsv': [path.resolve(__dirname, './csvs/guildBossRankCsv.json'), ['RewardCsv'], populateGuildBossRankCsv, guildbossrankcsv_populated],
    'guildBossCsv': [path.resolve(__dirname, './csvs/guildBossCsv.json'), ['RewardCsv'], populateGuildBossCsv, guildbosscsv_populated],
    'EchoRankRewardCsv': [path.resolve(__dirname, './csvs/EchoRankRewardCsv.json'), ['EchoBattleSubsection2Csv'], populateEchoRankRewardCsv, echorankrewardcsv_populated],
    'EchoBattleSubsection2Csv': [path.resolve(__dirname, './csvs/EchoBattleSubsection2Csv.json'), ['EchoBattleSubsection2Csv'], populateEchoBattleSubsection2Csv, echobattlesubsection2csv_populated],
    'TurbominesBaseCsv': [path.resolve(__dirname, './csvs/TurbominesBaseCsv.json'), ['ItemCsv', 'RewardCsv'], populateTurbominesBaseCsv, turbominesbasecsv_populated],
    'MonopolyBaseCsv': [path.resolve(__dirname, './csvs/MonopolyBaseCsv.json'), ['ItemCsv', 'RewardCsv'], populateMonopolyBaseCsv, monopolybasecsv_populated],
    'FestivalTaskCsv': [path.resolve(__dirname, './csvs/FestivalTaskCsv.json'), ['ItemCsv', 'RewardCsv'], populateFestivalTaskCsv, festivaltaskcsv_populated],
    'ShopCsv': [path.resolve(__dirname, './csvs/ShopCsv.json'), ['ShopCsv'], populateShopCsv, shopcsv_populated],
    'FestivalGiftRewardCsv': [path.resolve(__dirname, './csvs/FestivalGiftRewardCsv.json'), ['ItemCsv', 'ShopCsv'], populateFestivalGiftRewardCsv, festivalgiftrewardcsv_populated],
    'FestivalGiftCsv': [path.resolve(__dirname, './csvs/FestivalGiftCsv.json'), ['FestivalGiftRewardCsv'], populateFestivalGiftCsv, festivalgiftcsv_populated]
};

// Menu options
const menuOptions = [
    {
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: ['Rename Files', 'Sanitize File Content', 'Load Files', 'Write Files', 'Exit']
    }
];

// Start the application
function start() {
    inquirer.prompt(menuOptions)
        .then(answers => {
            switch (answers.action) {
                case 'Rename Files':
                    renameFiles();
                    start();
                    break;
                case 'Sanitize File Content':
                    regexFiles();
                    start();
                    break;
                case 'Load Files':
                    loadFiles();
                    start();
                    break;
                case 'Write Files':
                    writeFile();
                    start();
                    break;
                case 'Exit':
                    console.log("Exiting");
                    return;
                default:
                    console.log('Invalid action');
            }
        });
}

start();