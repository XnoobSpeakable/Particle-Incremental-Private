import {
   load,
   loadSettings,
   getUpgradeTimesBought,
   getUpgradeCost,
   player,
   playerSettings,
   UpgradeNames,
   getSaveString,
   InstantAutobuyerName,
} from './player';
import { format, 
   formatb, 
   getEl, 
   D,  
   onBought, 
   onBoughtInc, 
   formatbSpecific,
   formatD } from './util';
import { UpdateCostVal, upgrades, buyUpgrade } from './upgrades';
import { createAchievementHTML } from './achievements';
import { nextFeatureHandler } from './features';
import Decimal from 'break_eternity.js';

// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
declare var window: Window & Record<string, unknown>;

loadSettings();
load();

const themes = [
   {
      textColor: '#EBEBEB',
      bgColor: '#696969',
      buttonColor: '#999999',
      borderColor: '#000000',
      themeName: 'Dark',
   },
   {
      textColor: '#EFEFEF',
      bgColor: '#333333',
      buttonColor: '#ADADAD',
      borderColor: '#000000',
      themeName: 'Darker',
   },
   {
      textColor: '#000000',
      bgColor: '#EEEEEE',
      buttonColor: '#DFDFDF',
      borderColor: '#333333',
      themeName: 'Light',
   },
   {
      textColor: '#000000',
      bgColor: '#EEEEEE',
      buttonColor: '#DFDFDF',
      borderColor: '#F33333',
      themeName: 'Red Borders',
   },
   {
      textColor: '#CCCCCC',
      bgColor: '#000000',
      buttonColor: '#CCCCCC',
      borderColor: '#CCCCCC',
      themeName: 'Black',
   },
   {
      textColor: '#EEEEEE',
      bgColor: '#000000',
      buttonColor: '#EEEEEE',
      borderColor: '#EEEEEE',
      themeName: 'High contrast black',
   },
   {
      textColor: '#000000',
      bgColor: '#FF91AF',
      buttonColor: '#FFA1BF',
      borderColor: '#FFD1FF',
      themeName: 'Pink',
   },
   {
      textColor: '#3DD7DE',
      bgColor: '#191970',
      buttonColor: '#3DD7DE',
      borderColor: '#3DD7DE',
      themeName: 'Blue',
   },
   {
      textColor: '#000000',
      bgColor: '#FFFACD',
      buttonColor: '#FFD700',
      borderColor: '#FFD700',
      themeName: 'Yellow',
   },
   {
      textColor: '#000000',
      bgColor: '#DEB2EF',
      buttonColor: '#8A7AED',
      borderColor: '#6A5ACD',
      themeName: 'Purple',
   },
];

function themeExec(): void {
   const { textColor, bgColor, buttonColor, borderColor, themeName } =
      themes[playerSettings.themeNumber];

   //@ts-expect-error style isn't read only
   getEl('diventirebody').style =
      'color: ' + textColor + "; font-family: 'Arial'";
   document.body.style.backgroundColor = bgColor;
   document.querySelector('html')!.style.backgroundColor = bgColor;

   const className = document.getElementsByClassName(
      'button'
   ) as HTMLCollectionOf<HTMLElement>;
   for (let i = 0; i < className.length; i++) {
      className[i].style.backgroundColor = buttonColor;
   }

   const className2 = document.getElementsByClassName(
      'withtheoutline'
   ) as HTMLCollectionOf<HTMLElement>;
   for (let i = 0; i < className2.length; i++) {
      className2[i].style.border = '0.2em solid ' + borderColor;
   }

   const className3 = document.getElementsByClassName(
      'redb'
   ) as HTMLCollectionOf<HTMLElement>;
   for (let i = 0; i < className3.length; i++) {
      className3[i].style.backgroundColor = buttonColor;
   }

   getEl('whattheme').textContent = 'Theme: ' + themeName;
}

themeExec()

window.theme = function (): void {
   playerSettings.themeNumber = (playerSettings.themeNumber + 1) % themes.length;
   themeExec();
   saveSettings();
};

function prePUD(): void {
   getEl('tabopenfactory').style.display = 'none';
   getEl('tabopenalpha').style.display = 'none';
   getEl('tabopenbeta').style.display = 'none';
   getEl('tabopenreactor').style.display = 'none';
   getEl('tabopengamma').style.display = 'none';
   getEl('tabopendelta').style.display = 'none';
   getEl('tabopenomega').style.display = 'none';
   getEl('tabopenstats').style.display = 'none';
   getEl('tabopenomegaomega').style.display = 'none';
}

function passiveUnlockDisplay(): void {
   if (player.num.gte(1e5)) {
      getEl('tabopenfactory').style.display = 'inline';
   }
   if (player.num.gte(1e9)) {
      getEl('tabopenalpha').style.display = 'inline';
      getEl('tabopenomega').style.display = 'inline';
   }
   if (player.alphaNum.gte(1e9)) {
      getEl('tabopenbeta').style.display = 'inline';
   }
   if (player.betaNum.gte(300)) {
      getEl('tabopenreactor').style.display = 'inline';
   }
   if (playerSettings.useExperimental) { //TODO: remove exprimental when you want
      getEl('tabopengamma').style.display = 'inline';
      getEl('tabopendelta').style.display = 'inline';
      getEl('tabopenomegaomega').style.display = 'inline';
      getEl('tabopenstats').style.display = 'inline';
      getEl('tabopenachievements').style.display = 'inline';
   }

}

function devToolsVisibilityUpdate() {
   if(playerSettings.devToggled) {
      getEl('tabopendev').style.display = 'inline';
   }
   else {
      getEl('tabopendev').style.display = 'none';
   }
   getEl('devtoggle').textContent = playerSettings.devToggled.toString();
}

const autosaveElement = getEl('autosaving');
const delayArray = [600, 300, 150, 100, 50, 20, 10, undefined];

function autoSaveSet(): void {
   const delay = delayArray[playerSettings.autoSaveMode];
   playerSettings.autoSaveSet = playerSettings.autoSaveDelay = delay ?? 1e308;
   autosaveElement.textContent = delay
      ? 'On, delay: ' + format(delay / 10) + 's'
      : 'Off';
}

window.autosavesettings = function (): void {
   playerSettings.autoSaveMode = (playerSettings.autoSaveMode + 1) % delayArray.length;
   autoSaveSet();
   saveSettings();
};

function pcaTestSingle() {
   if (getUpgradeTimesBought('unlockpca').eq(1)) {
      getEl('untilpca').textContent =
         format(player.chunkAutobuyerTimeLeft) + ' left until next autobuy';
      getEl('divtogglepca').style.display = 'inline-block';

      if (player.pcaToggle) {
         getEl('divtogglepca').textContent = 'On';
      } else {
         getEl('divtogglepca').textContent = 'Off';
      }
   }
}

function baTestSingle() {
   if (getUpgradeTimesBought('bangautobuyerunlock').eq(1)) {
      getEl('untilba').textContent =
         format(player.bangAutobuyerTimeLeft) + ' left until next autobuy';
      getEl('divtoggleba').style.display = 'inline-block';

      if (player.bangAutobuyerToggle) {
         getEl('divtoggleba').textContent = 'On';
      } else {
         getEl('divtoggleba').textContent = 'Off';
      }
   }
}

function fgbTestSingle() {
   if (getUpgradeTimesBought('gen').eq(0)) {
      getEl('divgencost').textContent = 'Cost: Free';
   } else {
      UpdateCostVal('divgencost', getUpgradeCost('gen'));
   }
}

let nuclearParticles = getUpgradeTimesBought('nuclearbuy')
if(getUpgradeTimesBought('unlocknpboost').eq(1)) {
   nuclearParticles = onBought(
      ['nuclearbuy', '*', [D(1), '+', ['upgradenpboost', '+', D(1), '/', D(10)]]]
   )
}
let nuclearAlphaParticles = getUpgradeTimesBought('nuclearalphabuy')
if(getUpgradeTimesBought('unlocknapboost').eq(1)) {
   nuclearAlphaParticles = onBought(
      ['nuclearalphabuy', '*', [D(1), '+', ['upgradenapboost', '+', D(1), '/', D(10)]]]
   )
}

function amountUpdate() {
   if(getUpgradeTimesBought('unlocknpboost').eq(1)) {
      getEl('divnp').textContent =
      'Nuclear Particles: ' + formatD(nuclearParticles, 1);
   }
   else {
      getEl('divnp').textContent =
      'Nuclear Particles: ' + formatb(getUpgradeTimesBought('nuclearbuy'));
   }
   if(getUpgradeTimesBought('unlocknapboost').eq(1)) {
      getEl('divnap').textContent =
      'Nuclear Alpha Particles: ' + formatD(nuclearAlphaParticles, 1);
   }
   else {
      getEl('divnap').textContent =
      'Nuclear Alpha Particles: ' + formatb(getUpgradeTimesBought('nuclearalphabuy'));
   }
   
   getEl('chunkamount').textContent =
      'Particle Chunks: ' + formatb(player.pChunks);
   getEl('groupamount').textContent =
      'Particle Chunks: ' + formatb(player.aGroups);
   
   getEl('omegabasecost').textContent =
      'Cost: ' + formatb(player.omegaBaseCost);
   getEl('divobase').textContent = 'You have ' + formatb(player.omegaBase);
   getEl('omegaalphacost').textContent =
      'Cost: ' + formatb(player.omegaAlphaCost);
   getEl('divoalpha').textContent = 'You have ' + formatb(player.omegaAlpha);
}

function loadMisc(): void {
   for (const upgradeName of UpgradeNames) {
      const upgrade = upgrades[upgradeName];
      if (typeof upgrade.costRounding === 'undefined') {
         UpdateCostVal(
           upgrade.costDiv,
           getUpgradeCost(upgradeName),
           upgrade.currency
         );
       }
       else {
         UpdateCostVal(
           upgrade.costDiv,
           getUpgradeCost(upgradeName),
           upgrade.currency,
           upgrade.costRounding
         );
       }
   }

   themeExec();

   prePUD();
   passiveUnlockDisplay();

   autoSaveSet();

   devToolsVisibilityUpdate();

   pcaTestSingle();
   baTestSingle();
   fgbTestSingle();

   amountUpdate();
}

function makeElementMap(...names: string[]): { [k: string]: HTMLElement } {
   const entries = names.map(function (x) {
      return [x, getEl(x)] as const;
   });
   return Object.fromEntries(entries);
}

const tabElements = makeElementMap(
   'Base',
   'Factory',
   'Alpha',
   'Beta',
   'Reactor',
   'Gamma',
   'Delta',
   'Omega',
   'OmegaOmega',
   'Achievements',
   'Stats',
   'Settings',
   'Tutorial',
   'Dev'
);
const tabOmegaElements = makeElementMap(
   'oBase',
   'oAlpha',
   'oBeta',
   'oGamma',
   'oDelta'
);

function hideElements(elements: {
   [x: string]: { style: { display: string } };
}) {
   for (const name in elements) {
      elements[name].style.display = 'none';
   }
}

window.openTab = function (tab: string): void {
   if (tab in tabOmegaElements) {
      hideElements(tabOmegaElements);
   } else {
      hideElements(tabElements);
   }
   getEl(tab).style.display = 'block';
};

loadMisc();

window.saveExport = function (): void {
   // eslint-disable-next-line @typescript-eslint/no-floating-promises
   navigator.clipboard.writeText(save());
};

window.saveImport = function (): void {
   getEl('importareaid').style.display = 'block';
   getEl('saveimportconfirm').style.display = 'block';
};

window.saveImportConfirm = function (): void {
   const saveEl = getEl('importareaid');

   if (!(saveEl instanceof HTMLTextAreaElement)) {
      throw new Error('wrong element type');
   }
   const savefile = saveEl.value; // really should check for an empty value here
   localStorage.setItem(window.location.pathname, savefile);
   window.location.reload();
};

/* (these are completely abandoned)
window.setting1e4 = function (): void { 
   playerSettings.eSetting = 4;
   loadMisc();
   saveSettings();
};

window.setting1e6 = function (): void {
   playerSettings.eSetting = 6;
   loadMisc();
   saveSettings();
};
*/

window.experimentalToggle = function () {
   playerSettings.useExperimental = !playerSettings.useExperimental;

   if(playerSettings.useExperimental) {
      getEl('tabopengamma').style.display = 'inline';
      getEl('tabopendelta').style.display = 'inline';
      getEl('tabopenomegaomega').style.display = 'inline';
      getEl('tabopenachievements').style.display = 'inline';
   }
   else {
      getEl('tabopengamma').style.display = 'none';
      getEl('tabopendelta').style.display = 'none';
      getEl('tabopenomegaomega').style.display = 'none';
      getEl('tabopenachievements').style.display = 'none';
   }
   getEl('experimentoggle').textContent = playerSettings.useExperimental.toString();
   saveSettings();
}

window.devToggle = function () {
   playerSettings.devToggled = !playerSettings.devToggled;

   if(playerSettings.devToggled) {
      getEl('tabopendev').style.display = 'inline';
   }
   else {
      getEl('tabopendev').style.display = 'none';
   }
   getEl('devtoggle').textContent = playerSettings.devToggled.toString();
   saveSettings();
}

createAchievementHTML();

//early var init
let machineProd = 10
let clickerParticleMult = player.clickerParticles.div(100).plus(1).times(machineProd);

const reactor = {
   isActive: false,
   fuelTime: D(300),
   boost: D(1),
   fuelMult: D(1),
}

function reactorHandler() {
   reactor.fuelTime = onBought(
      [D(300), '*', [D(1.25), '^', 'reactoruptime'], '/', [D(2), '^', 'reactorupmult']]
   )

   if(player.hyperfuel.lte(0)) {
      player.hyperfuel = D(0);

      if(player.superfuel.lte(0)) {
         player.superfuel = D(0);

         if(player.fuel.lte(0)) {
            player.fuel = D(0);

            reactor.isActive = false;
         }
         else {
            reactor.fuelMult = D(1);
            reactor.isActive = true;
            player.fuel = player.fuel.minus(
               D(1).div(reactor.fuelTime)
            )
         }
      }
      else {
         reactor.fuelMult = D(3);
         reactor.isActive = true;
         player.superfuel = player.superfuel.minus(
            D(1).div(reactor.fuelTime)
         )
      }
   }
   else {
      reactor.fuelMult = D(6561);
      reactor.isActive = true;
      player.hyperfuel = player.hyperfuel.minus(
         D(1).div(reactor.fuelTime)
      )
   }

   if(reactor.isActive) {
      reactor.boost = onBoughtInc(
         [[D(1.25), '^', 'reactorupmult'], '*', reactor.fuelMult]
      )
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      getEl('divreactorstatus').textContent = `Reactor status: Running (${formatD(player.fuel, 2)} Fuel)`
   }
   else {
      reactor.boost = D(1)
      getEl('divreactorstatus').textContent = "Reactor status: Out of fuel"
   }
   getEl('divreactorfuelusage').textContent = `When active, your reactor is using up 1 fuel every ${formatb(reactor.fuelTime.div(10))} seconds`
}

let totalBoostFromNP = nuclearParticles.times(reactor.boost)

window.mbman = function (): void {
   const gain: Decimal = onBoughtInc(
      'mbup',
      '*',
      'mbmult'
   ).times(clickerParticleMult).times(totalBoostFromNP.plus(1));

   player.num = player.num.plus(gain);
   getEl('counter').textContent = formatb(player.num) + ' particles';
};

window.gbboost = function (): void {
   player.genBoostTimeLeft = player.genBoostTimeLeftCon;
};

function makechunk(): void {
   if (player.num.gte(1e9)) {
      player.num = player.num.minus(1e9);
      player.pChunks = player.pChunks.plus(1);
      getEl('chunkamount').textContent =
         'Particle Chunks: ' + formatb(player.pChunks);
   }
}
window.makechunk = makechunk;

function bang(): void {
   if (player.pChunks.gte(2)) {
      if (
         getUpgradeTimesBought('alphaacc').gt(0) &&
         !(player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime)
      ) {
         player.pChunks = player.pChunks.minus(2);
         player.bangTimeLeft = player.bangTime;
         getEl('chunkamount').textContent =
            'Particle Chunks: ' + formatb(player.pChunks);
         getEl('boostersmaintext').style.display = 'block';
      }
   }
}
window.bang = bang;

window.togglepca = function (): void {
   if (getUpgradeTimesBought('unlockpca').eq(1)) {
      player.pcaToggle = !player.pcaToggle;
      getEl('divtogglepca').style.display = 'inline-block';

      if (player.pcaToggle) {
         getEl('divtogglepca').textContent = 'On';
      } else {
         getEl('divtogglepca').textContent = 'Off';
      }
   }
};

window.buyomegabase = function (): void {
   if (player.num.gte(player.omegaBaseCost)) {
      player.num = player.num.minus(player.omegaBaseCost);
      player.omegaBase = player.omegaBase.plus(1);
      player.omegaBaseCost = player.omegaBaseCost.times(10);
      getEl('omegabasecost').textContent =
         'Cost: ' + formatb(player.omegaBaseCost);
      getEl('divobase').textContent = 'You have ' + formatb(player.omegaBase);
   }
};

window.buyomegaalpha = function (): void {
   if (player.alphaNum.gte(player.omegaAlphaCost)) {
      player.alphaNum = player.alphaNum.minus(player.omegaAlphaCost);
      player.omegaAlpha = player.omegaAlpha.plus(1);
      player.omegaAlphaCost = player.omegaAlphaCost.times(100);
      getEl('omegaalphacost').textContent =
         'Cost: ' + formatb(player.omegaAlphaCost);
      getEl('divoalpha').textContent = 'You have ' + formatb(player.omegaAlpha);
   }
};

window.buyomegabeta = function (): void {
   /* TODO: implement this */
};
window.buyomegagamma = function (): void {
   /* TODO: implement this */
};
window.buyomegadelta = function (): void {
   /* TODO: implement this */
};

window.toggleba = function (): void {
   if (getUpgradeTimesBought('bangautobuyerunlock').eq(1)) {
      player.bangAutobuyerToggle = !player.bangAutobuyerToggle;
      getEl('divtoggleba').style.display = 'inline-block';

      if (player.bangAutobuyerToggle) {
         getEl('divtoggleba').textContent = 'On';
      } else {
         getEl('divtoggleba').textContent = 'Off';
      }
   }
};

function makegroup(): void {
   if (player.alphaNum.gte(1e9)) {
      player.alphaNum = player.alphaNum.minus(1e9);
      player.aGroups = player.aGroups.plus(1);
      getEl('groupamount').textContent =
         'Alpha Groups: ' + formatb(player.aGroups);
   }
}
window.makegroup = makegroup;

function merge(): void {
   if (player.aGroups.gte(2)) {
      if (
         getUpgradeTimesBought('betaacc').gt(0) &&
         !(player.mergeTimeLeft >= 0 && player.mergeTimeLeft <= player.mergeTime)
      ) {
         player.aGroups = player.aGroups.minus(2);
         player.mergeTimeLeft = player.mergeTime;
         getEl('groupamount').textContent =
            'Alpha Groups: ' + formatb(player.aGroups);      
      }
   }
}
window.merge = merge;

window.instantAutobuyerToggle = function(autobuyerVar: InstantAutobuyerName, autobuyerDiv: string): void {
   player.instantAutobuyers[autobuyerVar] = !player.instantAutobuyers[autobuyerVar]
   getEl(autobuyerDiv).textContent = player.instantAutobuyers[autobuyerVar] ? "On" : "Off" 
}

type fuels = 'player.fuel'|'player.superfuel'|'player.hyperfuel'

window.buyFuel = function(fuelType: fuels) {
   if(fuelType === 'player.fuel') {
      if(player.num.gte('1e27') && player.alphaNum.gte('1e10') && player.betaNum.gte('50')) {
         player.num = player.num.minus('1e27')
         player.alphaNum = player.alphaNum.minus('1e10')
         player.betaNum = player.betaNum.minus('50')
         player.fuel = player.fuel.plus('1')
      }
   }
   else {
      //do this later TODO:
   }
}

function fgbTestConst(): void {
   if (getUpgradeTimesBought('gen').gt(0)) {
      getEl('boostsection').style.display = 'flex';
      getEl('bigboosttext').style.display = 'block';
      getEl('veryouterboost').style.display = 'block';

      if(getUpgradeTimesBought('unlocknpboost').eq(1)) {
         nuclearParticles = onBought(
            ['nuclearbuy', '*', [D(1), '+', ['upgradenpboost', '+', D(1), '/', D(10)]]]
         )
         getEl('npboostshow').style.display = 'block';
         getEl('npboostunlockbutton').style.display = 'none'
         getEl('divnpboostcost').style.display = 'none'
      }
      else {
         nuclearParticles = getUpgradeTimesBought('nuclearbuy')
         getEl('npboostshow').style.display = 'none';
      }
      if(getUpgradeTimesBought('unlocknapboost').eq(1)) {
         nuclearAlphaParticles = onBought(
            ['nuclearalphabuy', '*', [D(1), '+', ['upgradenapboost', '+', D(1), '/', D(10)]]]
         )
         getEl('napboostshow').style.display = 'block';
         getEl('napboostunlockbutton').style.display = 'none'
         getEl('divnapboostcost').style.display = 'none'
      }
      else {
         nuclearAlphaParticles = getUpgradeTimesBought('nuclearalphabuy')
         getEl('napboostshow').style.display = 'none';
      }

      if (getUpgradeTimesBought('gen').eq(0)) {
         getEl('divgencost').textContent = 'Cost: Free';
      } else {
         UpdateCostVal('divgencost', getUpgradeCost('gen'));
      }

      reactorHandler();

      totalBoostFromNP = nuclearParticles.times(reactor.boost)

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      getEl('nptext').textContent = `Nuclear particles add a +${formatD(reactor.boost, 2)}x multiplier to generators, generator boost, and manual boost`


      const boostsacmult: Decimal = D(1.5).pow(getUpgradeTimesBought('boostsacrifice'))

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      getEl('boostsactext').textContent = `Reset your Booster Particles, but increase Booster Particle and Alpha Particle gain. Currently ${formatD(boostsacmult, 1)}x.`


      if (player.genBoostTimeLeft.greaterThan(0)) {
         player.genBoostMult = getUpgradeTimesBought('genboostupmult').times(1.5).plus(2);
      } else {
         player.genBoostMult = D(1);
      }

      if (getUpgradeTimesBought('unlockgenboost').eq(1)) {
         getEl('gbshow').style.display = 'block';
         getEl('divgenunlockcost').style.display = 'none';
         getEl('gbunlockbutton').style.display = 'none';
      }

      if (getUpgradeTimesBought('unlockabgb').eq(1)) {
         getEl('abgbshow').style.display = 'block';
         getEl('divabgbcost').style.display = 'none';
         getEl('abgbunlockbutton').style.display = 'none';
      }

      player.bangTime = Math.ceil(
         300 / Math.pow(2, getUpgradeTimesBought('bangspeed').toNumber())
      );
      
      const alphaGain: Decimal = onBought(
         'alphaacc', ['perbang', '+', D(1)], [nuclearAlphaParticles, '+', D(1)], [D(2), '^', 'alphamachinedouble']
      ).times(boostsacmult);

      player.mergeTime = Math.ceil(
         300 / Math.pow(2, getUpgradeTimesBought('mergespeed').toNumber())
      );

      const betaGain: Decimal = onBought(
         'betaacc', ['permerge', '+', D(1)]
      );

      if (player.bangTimeLeft === 0) {
         player.alphaNum = player.alphaNum.plus(alphaGain);
         getEl('bangtimeleft').textContent = '';
      }

      if (player.mergeTimeLeft === 0) {
         player.betaNum = player.betaNum.plus(betaGain);
         getEl('mergetimeleft').textContent = '';
      }

      if (getUpgradeTimesBought('machine').gte(1)) {
         machineProd = (9/Math.log10(player.machineWear)) + 1
         player.machineWear += 1
      }

      clickerParticleMult = player.clickerParticles.div(50).plus(1);

      let abgbBoost: Decimal = D(1)

      if(getUpgradeTimesBought('unlockabgb').gt(0)) {
         abgbBoost  = onBoughtInc(
            player.alphaNum.cbrt(), '/', D(100), '*', 'abgbefficiency', '+', D(1)
         )
      }

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      getEl('abgbtext').textContent = `Your alpha-based generator boost is multiplying your generators by ${formatb(abgbBoost)}x (cbrt(alpha)/100*${getUpgradeTimesBought("abgbefficiency").plus(1)})`

      const gain: Decimal = onBought(        
            ['biggerbatches', '+', D(1)], '*', 'gen', '*', ['speed', '/', D(10), '+', D(0.1)], '*', player.genBoostMult, '*', [[totalBoostFromNP, '+', D(1)], '^', D(2)], '*', 
            [D(3), '^', 'threeboost'], '*', [D(1), '+', [[player.boosterParticles, '+', D(1)], '/', D(100), '*', [['boosteruppercent', '+', D(1)], '/', D(100)]]], '*', abgbBoost, '*', boostsacmult
      );
      
      getEl('particlesperclick').textContent =
         'You are getting ' +
                  formatb ( onBought( ['mbup', '+', D(1)], '*', ['mbmult', '+', D(1)], '*',[totalBoostFromNP, '+', D(1)]).times(clickerParticleMult)
         ) +
         ' particles per click';

      getEl('alphapb').textContent =
         'You are getting ' + formatb(alphaGain) + ' Alpha/bang';
      getEl('bangtimeconst').textContent =
         'Currently, bangs take ' + format(player.bangTime / 10) + ' seconds.';
      player.bangTimeLeft -= 1;

      if (player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime) {
         getEl('bangtimeleft').textContent =
            'Bang time left: ' + format(player.bangTimeLeft / 10);
         getEl('bangbutton').style.display = 'none';
      } else {
         getEl('bangbutton').style.display = 'block';
      }

      getEl('betapb').textContent =
         'You are getting ' + formatb(betaGain) + ' Beta/merge';
      getEl('mergetimeconst').textContent =
         'Currently, merges take ' + format(player.mergeTime / 10) + ' seconds.';
      player.mergeTimeLeft -= 1;

      if (player.mergeTimeLeft >= 0 && player.mergeTimeLeft <= player.mergeTime) {
         getEl('mergetimeleft').textContent =
            'Merge time left: ' + format(player.mergeTimeLeft / 10);
         getEl('mergebutton').style.display = 'none';
      } else {
         getEl('mergebutton').style.display = 'block';
      }

      if (player.genBoostTimeLeft.gt(0)) {
         player.genBoostTimeLeft = player.genBoostTimeLeft.minus(1);
      }
      getEl('divgbtl').textContent =
         'Boost Time Left: ' + formatb(player.genBoostTimeLeft.div(10));

      const bpGain: Decimal = (player.alphaNum.times(
         getUpgradeTimesBought('boosterup').plus(1)
      )).times(D(2)).div(10);
      player.boosterParticles = player.boosterParticles.plus(bpGain);
      const percentBoostDisplay: Decimal = 
         player.boosterParticles.times(
            getUpgradeTimesBought('boosteruppercent').plus(1).div(100)
         );
      
      if(percentBoostDisplay.lt(100)) {
         getEl('boostersmaintext').textContent =
            `You are currently getting ${formatb(bpGain.times(10).div(player.alphaNum))} booster particles per alpha particle per second,
               resulting in a +${formatbSpecific(percentBoostDisplay)}% boost to base particle production`;
      }
      else {
         getEl('boostersmaintext').textContent =
            `You are currently getting ${formatb(bpGain.times(10).div(player.alphaNum))} booster particles per alpha particle per second,
               resulting in a ${formatbSpecific(percentBoostDisplay.div(100).plus(1))}x boost to base particle production`;

      }

      getEl('bpamount').textContent =
         'You have ' + formatb(player.boosterParticles) + ' booster particles';
      
      const clickerParticleGain: Decimal = onBought(
         [['machine', '*', [D(1.5), '^', 'speedparticle']], '/', D(10)]
      ).times(machineProd)
      player.clickerParticles = player.clickerParticles.plus(clickerParticleGain);

      nextFeatureHandler();

      getEl('omegabasecost').textContent =
         'Cost: ' + formatb(player.omegaBaseCost);
      getEl('divobase').textContent = 'You have ' + formatD(player.omegaBase, 1);
      getEl('omegaalphacost').textContent =
         'Cost: ' + formatb(player.omegaAlphaCost);
      getEl('divoalpha').textContent = 'You have ' + formatD(player.omegaAlpha, 1);

      player.num = player.num.plus(gain);

      getEl('particlespersecond').textContent =
         'You are getting ' + formatb(gain.times(10)) + ' particles/s';
      
      if (player.num.gte(1e8)) {
         getEl('nuclearreach').style.display = 'none';
         getEl('nuclearshow').style.display = 'block';
      }

      if (player.alphaNum.gte(1e6)) {
         getEl('nuclearalphareach').style.display = 'none';
         getEl('nuclearalphashow').style.display = 'block';
      }

      if (player.num.gte(1e9)) {
         getEl('bangshow').style.display = 'block';
      }

      if (player.alphaNum.gte(1e9)) {
         getEl('mergeshow').style.display = 'block';

         getEl("oAlphauupre").style.display = 'none';
         getEl("oAlphauupost").style.display = 'block';
      }

      if (player.boosterParticles.gte(1e5) || getUpgradeTimesBought('boostsacrifice').gt(0)) {
         getEl('bpsacshow').style.display = 'block';
      }

      const freeNuclearParticles = nuclearParticles.minus(getUpgradeTimesBought('nuclearbuy'))
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      getEl('npboosttext').textContent = `Your Nuclear Particles Boost is giving you ${formatD(freeNuclearParticles, 1)} free Nuclear Particles`
      const freeNuclearAlphaParticles = nuclearAlphaParticles.minus(getUpgradeTimesBought('nuclearalphabuy'))
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      getEl('napboosttext').textContent = `Your Nuclear Alpha Particles Boost is giving you ${formatD(freeNuclearAlphaParticles, 1)} free Nuclear Alpha Particles`

      getEl('counter').textContent = formatb(player.num) + ' particles';
      getEl('clickercounter').textContent = `You have ${formatb(player.clickerParticles)} Clicker Particles (${formatb(clickerParticleGain.times(10))}/s), which are making Manual Boost ${formatbSpecific(clickerParticleMult)}x stronger.`
      getEl('alphacounter').textContent =
         formatb(player.alphaNum) + ' Alpha particles';
         getEl('betacounter').textContent =
         formatb(player.betaNum) + ' Beta particles';

      if (getUpgradeTimesBought('alphaacc').eq(0)) {
         getEl('bangwarn').style.display = 'block'
      }
      else {
         getEl('bangwarn').style.display = 'none'
      }
   }
}

function pcaTestConst(): void {
   if (getUpgradeTimesBought('unlockpca').eq(1)) {
      getEl('pcashow').style.display = 'block';
      getEl('divunlockpca').style.display = 'none';
      getEl('divunlockpcabutton').style.display = 'none';

      if (player.pcaToggle === true) {
         if (player.chunkAutobuyerTimeLeft === 0) {
            player.chunkAutobuyerTimeLeft = player.pcaTime;
            makechunk();
         }

         player.chunkAutobuyerTimeLeft -= 1;
         getEl('untilpca').textContent =
            format(player.chunkAutobuyerTimeLeft / 10) + ' left until next autobuy';
      }
   }
}

function baTestConst(): void {
   if (getUpgradeTimesBought('bangautobuyerunlock').eq(1)) {
      getEl('bashow').style.display = 'block';
      getEl('divbau').style.display = 'none';
      getEl('divbauextra').style.display = 'none';
      getEl('baunlockbutton').style.display = 'none';

      if (player.bangAutobuyerToggle === true) {
         if (player.bangAutobuyerTimeLeft === 0) {
            player.bangAutobuyerTimeLeft = player.bangAutobuyerTime;
            bang();
         }

         player.bangAutobuyerTimeLeft -= 1;
         getEl('untilba').textContent =
            format(player.bangAutobuyerTimeLeft) + ' left until next autobuy';
      }
   }
}

function instantAutobuyers() {
   if(getUpgradeTimesBought('GnBBAunlock').eq(1)) {
      if(player.instantAutobuyers.genAutobuyerToggle === true) {
         buyUpgrade('gen');
      }
      if(player.instantAutobuyers.bbAutobuyerToggle === true) {
         buyUpgrade('biggerbatches');
      }
      getEl('divGnBBA').style.display = 'none'
   }
   if(getUpgradeTimesBought('GBUAunlock').eq(1)) {
      if(player.instantAutobuyers.genBoostTimeAutobuyerToggle === true) {
         buyUpgrade('genboostuptime')
      }
      if(player.instantAutobuyers.genBoostMultAutobuyerToggle === true) {
         buyUpgrade('genboostupmult')
      }
      getEl('divGBUA').style.display = 'none'
   }
   if(getUpgradeTimesBought('MBUAunlock').eq(1)) {
      if(player.instantAutobuyers.manBoost1perClickAutobuyerToggle === true) {
         buyUpgrade('mbup')
      }
      if(player.instantAutobuyers.manBoost1xperClickAutobuyerToggle === true) {
         buyUpgrade('mbmult')
      }
      getEl('divMBUA').style.display = 'none'
   }
   if(getUpgradeTimesBought('NPAunlock').eq(1)) {
      if(player.instantAutobuyers.nuclearParticlesAutobuyerToggle === true) {
         buyUpgrade('nuclearbuy')
      }
      if(player.instantAutobuyers.nuclearAlphaParticlesAutobuyerToggle === true) {
         buyUpgrade('nuclearalphabuy')
      }
      getEl('divNPA').style.display = 'none'
   }
   if(getUpgradeTimesBought('AAccAunlock').eq(1)) {
      if(player.instantAutobuyers.AlphaAccAutobuyerToggle === true) {
         buyUpgrade('alphaacc')
      }
      getEl('divAAccA').style.display = 'none'
   }
   if(getUpgradeTimesBought('SAunlock').eq(1)) {
      if(player.instantAutobuyers.SpeedAutobuyerToggle === true) {
         buyUpgrade('speed')
      }
      getEl('divSA').style.display = 'none'
   }
}

function savinginloop(): void {
   playerSettings.autoSaveDelay -= 1;

   if (playerSettings.autoSaveDelay === 0) {
      playerSettings.autoSaveDelay = playerSettings.autoSaveSet;
      save();
   }
}

//game loop
setInterval(() => {
   passiveUnlockDisplay();
   pcaTestConst();
   baTestConst();
   fgbTestConst();
   instantAutobuyers();
   getEl('stat').textContent = getSaveString()
      .replace(/","/g, '",\n"')
      .replace(/},"/g, '",\n"');
   savinginloop();
}, 100);

function saveReplace(_key: string, value: unknown): unknown {
   if (value instanceof Decimal) {
      return 'D#' + value.toString();
   }
   return value;
}

function saveSettings(): void {
   const settingfile = JSON.stringify(playerSettings);
   localStorage.setItem(window.location.pathname + "settings", settingfile);
}
window.saveSettings = saveSettings;

function save(): string {
   const savefile = JSON.stringify(player, saveReplace);
   localStorage.setItem(window.location.pathname, savefile);
   saveSettings();
   return savefile;
}
window.save = save;

window.reset = function (): void {
   saveSettings();
   localStorage.removeItem(window.location.pathname);

   //make backup save
   const savefile = JSON.stringify(player, saveReplace);
   localStorage.setItem(window.location.pathname + "backupsave", savefile);

   window.location.reload();
};
