/**
 * Made with love by AntiSquid, Illedan and Wildum.
 * You can help children learn to code while you participate by donating to CoderDojo.
 **/

var myTeam = parseInt(readline());
const myWeapons = [];
var bushAndSpawnPointCount = parseInt(readline()); // usefrul from wood1, represents the number of bushes and the number of places where neutral units can spawn

for (var i = 0; i < bushAndSpawnPointCount; i++) {
    var inputs = readline().split(' ');
    var entityType = inputs[0]; // BUSH, from wood1 it can also be SPAWN
    var x = parseInt(inputs[1]);
    var y = parseInt(inputs[2]);
    var radius = parseInt(inputs[3]);
}
var itemCount = parseInt(readline()); // useful from wood2
for (var i = 0; i < itemCount; i++) {
    var inputs = readline().split(' ');
    // printErr('inputs', inputs);
    var itemName = inputs[0]; // contains keywords such as BRONZE, SILVER and BLADE, BOOTS connected by "_" to help you sort easier
    var itemCost = parseInt(inputs[1]); // BRONZE items have lowest cost, the most expensive items are LEGENDARY
    var damage = parseInt(inputs[2]); // keyword BLADE is present if the most important item stat is damage
    var health = parseInt(inputs[3]);
    var maxHealth = parseInt(inputs[4]);
    var mana = parseInt(inputs[5]);
    var maxMana = parseInt(inputs[6]);
    var moveSpeed = parseInt(inputs[7]); // keyword BOOTS is present if the most important item stat is moveSpeed
    var manaRegeneration = parseInt(inputs[8]);
    var isPotion = parseInt(inputs[9]); // 0 if it's not instantly consumed
    if (itemName.includes('Blade')) {
        myWeapons.push({ itemName, itemCost });
    }
    printErr('itemName', itemName, 'itemCost', itemCost, 'damage', damage, 'health', health);
}

const getFrontXCoord = (acc, curr, myTeam) => {
    return (acc > curr && !myTeam || acc < curr && myTeam) ? acc : curr;
}

const buyWeapon = function(affordableWeapons) {
	// const weapon = weapons.filter(w => w.itemName === weaponName)[0];
	const weapon = affordableWeapons[Math.floor(Math.random() * affordableWeapons.length)]
	printErr('weapon: ', weapon);
// 	gold = gold - weapon.itemCost;
	print(`BUY ${weapon.itemName}`);
// 	console.log('Bought ' + weapon.itemName + ' gold left ' + gold);
};

let shoppingRounds = 2;
const fullHealth = 820;
const homeXCoord = myTeam ? 1800 : 110;
const enemyTowerXCoordBoundary = myTeam ? 701 : 1219;
// let heroXCoord;
// let heroHealth;
let frontXCoord;
let enemyTowerXCoord;
let heroes = {};
let ownUnits = [];
let weakUnits = [];
let enemyXCoords = [];
let enemyHeroesHiding = false;

while (true) {
    var gold = parseInt(readline());
    var enemyGold = parseInt(readline());
    var roundType = parseInt(readline()); // a positive value will show the number of heroes that await a command
    printErr('roundType', roundType);
    var entityCount = parseInt(readline());
    let totalXCoords = 0;
    let noOfUnits = 0;
    frontXCoord = homeXCoord;
    weakUnits = [];
    heroes = {};
    for (var i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        var unitId = parseInt(inputs[0]);
        var team = parseInt(inputs[1]);
        var unitType = inputs[2]; // UNIT, HERO, TOWER, can also be GROOT from wood1
        var x = parseInt(inputs[3]);
        var y = parseInt(inputs[4]);
        var attackRange = parseInt(inputs[5]);
        var health = parseInt(inputs[6]);
        var maxHealth = parseInt(inputs[7]);
        var shield = parseInt(inputs[8]); // useful in bronze
        var attackDamage = parseInt(inputs[9]);
        var movementSpeed = parseInt(inputs[10]);
        var stunDuration = parseInt(inputs[11]); // useful in bronze
        var goldValue = parseInt(inputs[12]);
        var countDown1 = parseInt(inputs[13]); // all countDown and mana variables are useful starting in bronze
        var countDown2 = parseInt(inputs[14]);
        var countDown3 = parseInt(inputs[15]);
        var mana = parseInt(inputs[16]);
        var maxMana = parseInt(inputs[17]);
        var manaRegeneration = parseInt(inputs[18]);
        var heroType = inputs[19]; // DEADPOOL, VALKYRIE, DOCTOR_STRANGE, HULK, IRONMAN
        var isVisible = parseInt(inputs[20]); // 0 if it isn't
        var itemsOwned = parseInt(inputs[21]); // useful from wood1

        printErr('unitId', unitId, 'health', health, unitType, team, x, 'x', y, 'attackRange', attackRange, 'itemsOwned', itemsOwned, 'goldValue', goldValue);

        if (team === myTeam) {
            if (unitType === 'UNIT') {
                frontXCoord = getFrontXCoord(frontXCoord, x, myTeam);
                if(health < 100) { weakUnits.push(unitId) }
            }
            if (unitType === 'HERO') {
                if (!heroes[unitId]) { heroes[unitId] = {} }
                heroes[unitId]['heroXCoord'] = x;
                heroes[unitId]['heroYCoord'] = y;
                heroes[unitId]['heroHomeYCoord'] = 300 + unitId * 50;
                heroes[unitId]['heroHealth'] = health;
                heroes[unitId]['heroMaxHealth'] = maxHealth;
                heroes[unitId]['heroName'] = heroType;
            }
        } else {
            if (unitType === 'TOWER') {
                enemyTowerXCoord = x;   
            }
            else if (unitType === 'HERO') {
                enemyXCoords[unitId%2] = x;   
            } 
        }   
    }

    // const meanXCoord = totalXCoords / noOfUnits;
    const enemyHeroesHiding = myTeam ? Math.max(...enemyXCoords) < enemyTowerXCoordBoundary : Math.min(...enemyXCoords) > enemyTowerXCoordBoundary;
    // const distanceFromTowerBattle = myTeam ? : ;
    const safeDistanceBehindLine = frontXCoord - 20 + (myTeam * 40);
    const safeAttackingPosition = myTeam ? Math.max(enemyTowerXCoordBoundary, safeDistanceBehindLine) : Math.min(enemyTowerXCoordBoundary, safeDistanceBehindLine) ;
    const fallbackXCoord = myTeam ? 800 : 1120 ;

    const items = ['larger_potion'];
    const randomItem = items[Math.floor(Math.random()*items.length)];

    const goShopping = () => {
        shoppingRounds--;
        printErr('gold', gold);
        const affordableWeapons = myWeapons.filter(weapon => {
            return weapon.itemCost <= gold
        });
        printErr('affordableWeapons', JSON.stringify(affordableWeapons));
        if (affordableWeapons.length > 0) {
            buyWeapon(affordableWeapons);
            buyWeapon(affordableWeapons);
        } else {
            print('WAIT');
        }
    }

    const attackEnemy = () => {
        print('ATTACK_NEAREST UNIT');
    };
     
    play = () => {
        printErr('heroes', JSON.stringify(heroes));
        printErr('items', items);

        if (shoppingRounds > 0) {
            goShopping();
        }
        
        Object.keys(heroes).forEach((hero) => {
            const { heroXCoord, heroHealth, heroYCoord, heroName, heroMaxHealth } = heroes[hero];
            const heroDead = heroHealth === 0;

            printErr(`*****HERO ${hero} ${JSON.stringify(heroes[hero])}`);
            
            const heroBeyondLine = myTeam ? heroXCoord < frontXCoord : heroXCoord > frontXCoord ;
            const heroTooCloseToTower = myTeam ? heroXCoord < enemyTowerXCoordBoundary : heroXCoord > enemyTowerXCoordBoundary;
            const heroDying = heroHealth < heroMaxHealth * 0.4;
            const heroUnhealthy = heroHealth < heroMaxHealth * 0.7;

            printErr(hero, JSON.stringify(heroes[hero]));
            printErr(heroName, ': heroDying', heroDying, 'heroUnhealthy', heroUnhealthy, 'heroXCoord', heroXCoord, 'homeXCoord', homeXCoord);

            if (heroDying && (heroXCoord !== homeXCoord)) {
                print(`MOVE ${homeXCoord} ${heroYCoord};${heroName} ${heroUnhealthy} ${heroXCoord !== homeXCoord}`);
            } else if (heroUnhealthy && gold >= 70) {
                print(`BUY ${randomItem}`);
            } else if (heroBeyondLine) {
                print(`MOVE ${safeAttackingPosition} ${heroYCoord}`);
            } else if (heroTooCloseToTower) {
                printErr('unit too close', heroName);
                printErr(`MOVE ${fallbackXCoord} ${heroYCoord}`);
                print(`MOVE ${fallbackXCoord} ${heroYCoord}`);
            // } else if (weakUnits.length > 0) {
            //     print(`ATTACK ${weakUnits.shift()}`);
            } else {
                attackEnemy();
            }
        });
    }

    switch(roundType) {
        case (-2):
            print('IRONMAN');
            break;
        case (-1):
            print('VALKYRIE');
            break;
        default:
            play();
            break;
    }
}