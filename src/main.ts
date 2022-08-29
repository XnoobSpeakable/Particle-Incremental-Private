import {
   load,
   getUpgradeTimesBought,
   getUpgradeCost,
   player,
   UpgradeName,
   UpgradeNames,
   getSaveString,
} from './player';
import { UpdateCostVal, upgrades } from './upgrades';
import { format, formatb, getEl, D, onD, onBought, onBoughtInc } from './util';
import Decimal from 'break_eternity.js';

// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
declare var window: Window & Record<string, unknown>;

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
];
function themeExec(): void {
   const { textColor, bgColor, buttonColor, borderColor, themeName } =
      themes[player.themeNumber];
   //@ts-expect-error style isn't read only
   getEl('diventirebody').style =
      'color: ' + textColor + "; font-family: 'Times New Roman'";
   document.body.style.backgroundColor = bgColor;
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
   getEl('whattheme').textContent = 'Theme: ' + themeName;
}

window.theme = function (): void {
   player.themeNumber = (player.themeNumber + 1) % themes.length;
   themeExec();
};
function prePUD(): void {
   getEl('tabopenalpha').style.display = 'none';
   getEl('tabopenbeta').style.display = 'none';
   getEl('tabopengamma').style.display = 'none';
   getEl('tabopendelta').style.display = 'none';
   getEl('tabopenomega').style.display = 'none';
}
function passiveUnlockDisplay(): void {
   if (player.num.gte(1e9)) {
      getEl('tabopenalpha').style.display = 'inline';
      getEl('tabopenomega').style.display = 'inline';
   }
   if (player.alphaNum.gte(1e9)) {
      getEl('tabopenbeta').style.display = 'inline';
   }
}

const autosaveElement = getEl('autosaving');
const delayArray = [600, 300, 150, 100, 50, 20, 10, undefined];

function autoSaveSet(): void {
   const delay = delayArray[player.autoSaveMode];
   player.autoSaveSet = player.autoSaveDelay = delay ?? 1e308;
   autosaveElement.textContent = delay
      ? 'On, delay: ' + format(delay / 10) + 's'
      : 'Off';
}

window.autosavesettings = function (): void {
   player.autoSaveMode = (player.autoSaveMode + 1) % delayArray.length;
   autoSaveSet();
};

function loadMisc(): void {
   themeExec();
   prePUD();
   passiveUnlockDisplay();
   autoSaveSet();
   for (const upgradeName of UpgradeNames) {
      const upgrade = upgrades[upgradeName];
      UpdateCostVal(
         upgrade.costDiv,
         getUpgradeCost(upgradeName),
         upgrade.currency
      );
   }
   if (getUpgradeTimesBought('gen').eq(0)) {
      getEl('divgencost').textContent = 'Cost: Free';
   } else {
      UpdateCostVal('divgencost', getUpgradeCost('gen'));
   }
   if (getUpgradeTimesBought('unlockgb').eq(1)) {
      getEl('gbshow').style.display = 'block';
      getEl('divgenunlockcost').style.display = 'none';
      getEl('gbunlockbutton').style.display = 'none';
   }
   getEl('divnp').textContent =
      'Nuclear Particles: ' + formatb(getUpgradeTimesBought('nuclearbuy'));
   getEl('divnap').textContent =
      'Nuclear Alpha Particles: ' +
      formatb(getUpgradeTimesBought('nuclearalphabuy'));
   getEl('chunkamount').textContent =
      'Particle Chunks: ' + formatb(player.pChunks);
   if (getUpgradeTimesBought('unlockpca').eq(1)) {
      getEl('pcashow').style.display = 'block';
      getEl('divunlockpca').style.display = 'none';
      getEl('divunlockpcabutton').style.display = 'none';
      getEl('untilpca').textContent =
         format(player.pcaTimeLeft) + ' left until next autobuy';
      getEl('divtogglepca').style.display = 'inline-block';
      if (player.pcaToggle) {
         getEl('divtogglepca').textContent = 'On';
      } else {
         getEl('divtogglepca').textContent = 'Off';
      }
   }
   if (getUpgradeTimesBought('baunlock').eq(1)) {
      getEl('bashow').style.display = 'block';
      getEl('divbau').style.display = 'none';
      getEl('divbauextra').style.display = 'none';
      getEl('baunlockbutton').style.display = 'none';
      getEl('untilba').textContent =
         format(player.baTimeLeft) + ' left until next autobuy';
      getEl('divtoggleba').style.display = 'inline-block';
      if (player.baToggle) {
         getEl('divtoggleba').textContent = 'On';
      } else {
         getEl('divtoggleba').textContent = 'Off';
      }
   }
   getEl('omegabasecost').textContent =
      'Cost: ' + formatb(player.omegaBaseCost);
   getEl('divobase').textContent = 'You have ' + formatb(player.omegaBase);
   getEl('omegaalphacost').textContent =
      'Cost: ' + formatb(player.omegaAlphaCost);
   getEl('divoalpha').textContent = 'You have ' + formatb(player.omegaAlpha);
}

function makeElementMap(...names: string[]): { [k: string]: HTMLElement } {
   const entries = names.map(function (x) {
      return [x, getEl(x)] as const;
   });
   return Object.fromEntries(entries);
}
const tabElements = makeElementMap(
   'Base',
   'Alpha',
   'Beta',
   'Gamma',
   'Delta',
   'Omega',
   'Stats',
   'Settings',
   'Tutorial'
);
const tabOmegaElements = makeElementMap(
   'oBase',
   'oAlpha',
   'oBeta',
   'oGamma',
   'oDelta',
   'oOmega'
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

load();
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
window.setting1e4 = function (): void {
   player.eSetting = 1e4;
   loadMisc();
};
window.setting1e6 = function (): void {
   player.eSetting = 1e6;
   loadMisc();
};

window.mbman = function (): void {
   const gain: Decimal = onBoughtInc(
      'mbup',
      '*',
      'mbmult', '*', 'nuclearbuy'
   );
   player.num = player.num.plus(gain);
   getEl('counter').textContent = formatb(player.num) + ' particles';
};

window.gbboost = function (): void {
   player.gbTimeLeft = player.gbTimeLeftCon;
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
   if (getUpgradeTimesBought('baunlock').eq(1)) {
      player.baToggle = !player.baToggle;
      getEl('divtoggleba').style.display = 'inline-block';
      if (player.baToggle) {
         getEl('divtoggleba').textContent = 'On';
      } else {
         getEl('divtoggleba').textContent = 'Off';
      }
   }
};

function fgbtest(): void {
   if (getUpgradeTimesBought('gen').gt(0)) {
      getEl('boostsection').style.display = 'flex';
      getEl('bigboosttext').style.display = 'block';
      getEl('veryouterboost').style.display = 'block';
      if (player.gbTimeLeft.greaterThan(0)) {
         player.gbMult = getUpgradeTimesBought('gbupm').times(5).plus(5);
      } else {
         player.gbMult = D(1);
      }
      if (getUpgradeTimesBought('unlockgb').eq(1)) {
         getEl('gbshow').style.display = 'block';
         getEl('divgenunlockcost').style.display = 'none';
         getEl('gbunlockbutton').style.display = 'none';
      }

      player.bangTime = Math.ceil(
         300 / Math.pow(2, getUpgradeTimesBought('bangspeed').toNumber())
      );
      
      const alphaGain: Decimal = onBought(
         'alphaacc', '*', ['perbang', '+', D(1)], '*',['nuclearalphabuy', '+', D(1)], '*', [D(2), '^', 'alphamachinedouble']
         );
            
      if (player.bangTimeLeft === 0) {
         player.alphaNum = player.alphaNum.plus(alphaGain);
         getEl('bangtimeleft').textContent = '';
      }

      const gain: Decimal = onBought(        
            ['bb', '+', D(1)], '*', 'gen', '*', ['speed', '/', D(10), '+', D(0.1)], '*', player.gbMult, '*', [['nuclearbuy', '+', D(1)], '^', D(2)], '*', 
            [D(3), '^', 'tb'], '*', D(player.tempBoost), '*', player.boosterParticles, '/', D(100), '*', [['boosteruppercent', '+', D(1)], '/', D(100), '+', D(1)]
    );

      getEl('particlesperclick').textContent =
         'You are getting ' +
                  formatb ( onBought( ['mbup', '+', D(1)], '*', ['mbmult', '+', D(1)], '*',['nuclearbuy', '+', D(1)])
         ) +
         ' particles per click';

      getEl('alphapb').textContent =
         'You are getting ' + formatb(alphaGain) + ' Alpha/bang';
      player.bangTimeLeft -= 1;
      if (player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime) {
         getEl('bangtimeleft').textContent =
            'Bang time left: ' + format(player.bangTimeLeft);
         getEl('bangbutton').style.display = 'none';
      } else {
         getEl('bangbutton').style.display = 'block';
      }
      if (player.gbTimeLeft.greaterThan(0)) {
         player.gbTimeLeft = player.gbTimeLeft.minus(1);
      }
      getEl('divgbtl').textContent =
         'Boost Time Left: ' + formatb(player.gbTimeLeft);

      player.untilBoost -= 1;
      if (player.untilBoost === 0) {
         player.untilBoost = 10;
         const totalGain: Decimal = player.alphaNum.times(
            getUpgradeTimesBought('boosterup').plus(1)
         );
         player.boosterParticles = player.boosterParticles.plus(totalGain);
         const percentBoostDisplay: string = formatb(
            player.boosterParticles.times(
               getUpgradeTimesBought('boosteruppercent').plus(1).div(100)
            )
         );
         // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
         getEl('boostersmaintext').textContent =
            'You are currently getting ' +
            formatb(totalGain) +
            ' booster particles per alpha particle per second, resulting in a +' +
            percentBoostDisplay +
            '% boost to base particle production';
      }
      getEl('bpamount').textContent =
         'You have ' + formatb(player.boosterParticles) + ' booster particles';

      if (player.num.gte(1e6) && player.num.lessThan(1e12)) {
         player.tempBoost = 1.5;
         getEl('tmp').style.display = 'block';
      } else {
         player.tempBoost = 1;
         getEl('tmp').style.display = 'none';
      }

      getEl('omegabasecost').textContent =
         'Cost: ' + formatb(player.omegaBaseCost);
      getEl('divobase').textContent = 'You have ' + formatb(player.omegaBase);
      getEl('omegaalphacost').textContent =
         'Cost: ' + formatb(player.omegaAlphaCost);
      getEl('divoalpha').textContent = 'You have ' + formatb(player.omegaAlpha);

      player.num = player.num.plus(gain);
      getEl('particlespersecond').textContent =
         'You are getting ' + formatb(gain.times(10)) + ' particles/s';

      if (player.num.gte(1e6)) {
         getEl('nuclearreach').style.display = 'none';
         getEl('nuclearshow').style.display = 'block';
      }
      if (player.alphaNum.gte(1e6)) {
         getEl('nuclearalphareach').style.display = 'none';
         getEl('nuclearalphashow').style.display = 'block';
      }
      if (player.num.gte(1e9)) {
         getEl('bangreach').style.display = 'none';
         getEl('bangshow').style.display = 'block';
      }
      getEl('counter').textContent = formatb(player.num) + ' particles';
      getEl('alphacounter').textContent =
         formatb(player.alphaNum) + ' Alpha particles';
   }
}

function pcatest(): void {
   if (getUpgradeTimesBought('unlockpca').eq(1)) {
      getEl('pcashow').style.display = 'block';
      getEl('divunlockpca').style.display = 'none';
      getEl('divunlockpcabutton').style.display = 'none';
      if (player.pcaToggle === true) {
         if (player.pcaTimeLeft === 0) {
            player.pcaTimeLeft = player.pcaTime;
            makechunk();
         }
         player.pcaTimeLeft -= 1;
         getEl('untilpca').textContent =
            format(player.pcaTimeLeft) + ' left until next autobuy';
      }
   }
}

function batest(): void {
   if (getUpgradeTimesBought('baunlock').eq(1)) {
      getEl('bashow').style.display = 'block';
      getEl('divbau').style.display = 'none';
      getEl('divbauextra').style.display = 'none';
      getEl('baunlockbutton').style.display = 'none';
      if (player.baToggle === true) {
         if (player.baTimeLeft === 0) {
            player.baTimeLeft = player.baTime;
            bang();
         }
         player.baTimeLeft -= 1;
         getEl('untilba').textContent =
            format(player.baTimeLeft) + ' left until next autobuy';
      }
   }
}

function savinginloop(): void {
   player.autoSaveDelay -= 1;
   if (player.autoSaveDelay === 0) {
      player.autoSaveDelay = player.autoSaveSet;
      save();
   }
}

//game loop
setInterval(() => {
   passiveUnlockDisplay();
   pcatest();
   batest();
   fgbtest();
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

function save(): string {
   const savefile = JSON.stringify(player, saveReplace);
   localStorage.setItem(window.location.pathname, savefile);
   return savefile;
}
window.save = save;

window.reset = function (): void {
   localStorage.removeItem(window.location.pathname);
};
console.log(window.location.pathname);
