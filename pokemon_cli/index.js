#!/usr/bin/env node
/**
 * index.js - Mini Pokémon CLI game (Node.js)
 *
 * Usage:
 *   npm install
 *   node index.js
 *
 * Le joueur choisit un Pokémon (nom), choisit 5 attaques parmi celles disponibles
 * (avec power, accuracy et pp). Le bot prend un Pokémon aléatoire et 5 attaques aléatoires.
 * Les deux commencent avec 300 HP. Premier à 0 HP perd.
 */

const axios = require("axios");
const rl = require("readline-sync");
const chalk = require("chalk");

const API_POKEMON = "https://pokeapi.co/api/v2/pokemon/";
const MAX_HP = 300;

/**
 * Récupère les données d'un Pokémon par son nom (ou id).
 * Filtre et récupère les moves qui ont power et accuracy.
 */
async function fetchPokemon(nameOrId) {
  try {
    const res = await axios.get(`${API_POKEMON}${encodeURIComponent(nameOrId.toLowerCase())}`);
    const data = res.data;

    // Prépare une liste de moves candidate (on limitera le nombre pour ne pas faire trop de requêtes)
    const candidates = data.moves.slice(0, 40); // 40 premiers moves au max pour réduire les requêtes
    const moves = [];

    for (const m of candidates) {
      // pour chaque move, on demande ses détails
      try {
        const moveRes = await axios.get(m.move.url);
        const md = moveRes.data;
        // on garde que les moves qui ont power (int) et accuracy (int)
        if (md.power && md.accuracy && md.pp) {
          moves.push({
            name: md.name,
            power: md.power,
            accuracy: md.accuracy,
            pp: md.pp,
            max_pp: md.pp
          });
        }
      } catch (err) {
        // ignore move fetch errors, continue
      }
      if (moves.length >= 20) break; // cap pour ne pas trop charger l'API
    }

    return {
      name: data.name,
      moves,
      hp: MAX_HP
    };
  } catch (err) {
    return null;
  }
}

/**
 * Permet au joueur de choisir 5 attaques parmi la liste disponible.
 */
function choosePlayerMoves(pokemon) {
  console.log(chalk.blue(`\nAttaques disponibles pour ${pokemon.name} :`));
  pokemon.moves.forEach((m, i) => {
    console.log(`${i + 1}. ${m.name} (Power=${m.power}, Acc=${m.accuracy}%, PP=${m.pp})`);
  });

  const chosen = [];
  while (chosen.length < 5) {
    const idxStr = rl.questionInt(`Choisis l'attaque n°${chosen.length + 1} (1-${pokemon.moves.length}) : `);
    const idx = idxStr - 1;
    if (idx >= 0 && idx < pokemon.moves.length) {
      chosen.push(JSON.parse(JSON.stringify(pokemon.moves[idx]))); // clone objet (pp indépendant)
      console.log(chalk.green(`-> ${pokemon.moves[idx].name} ajoutée.`));
    } else {
      console.log(chalk.yellow("Choix invalide, réessaie."));
    }
  }
  return chosen;
}

/**
 * Bot choisit aléatoirement 5 attaques (si disponibles).
 */
function chooseBotMoves(pokemon) {
  const pool = pokemon.moves.slice();
  const result = [];
  while (result.length < 5 && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    result.push(JSON.parse(JSON.stringify(pool[i])));
    pool.splice(i, 1);
  }
  return result;
}

/**
 * Résolution d'une attaque (vérifie PP, accuracy, applique dégât si touché)
 */
function performAttack(attacker, defender, move) {
  if (move.pp <= 0) {
    console.log(chalk.yellow(`${attacker.name} n'a plus de PP pour ${move.name}.`));
    return;
  }
  move.pp -= 1;

  const roll = Math.floor(Math.random() * 100) + 1; // 1..100
  const hit = roll <= move.accuracy;

  if (hit) {
    // dégâts simples = power (on peut ajouter modificateurs si voulu)
    const damage = move.power;
    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;
    console.log(chalk.green(`${attacker.name} utilise ${move.name} ! Ça touche → -${damage} HP`));
  } else {
    console.log(chalk.red(`${attacker.name} utilise ${move.name}... mais rate !`));
  }
}

/**
 * Affiche l'état HP et PP
 */
function showStatus(player, bot) {
  console.log(chalk.cyan(`\n${player.name.toUpperCase()} HP: ${player.hp} | ${bot.name.toUpperCase()} HP: ${bot.hp}`));
  console.log(chalk.magenta("Tes attaques (PP restant):"));
  player.moves.forEach((m, i) => {
    console.log(` ${i + 1}. ${m.name} (PP ${m.pp}/${m.max_pp})`);
  });
}

/**
 * Programme principal
 */
async function main() {
  console.log(chalk.bold("=== Mini Pokémon CLI Game (Node.js) ==="));

  // Choix du Pokémon du joueur
  let playerPokeName = rl.question("Choisis ton Pokémon (nom en anglais, ex: pikachu) : ").trim();
  let player = await fetchPokemon(playerPokeName);
  if (!player) {
    console.log(chalk.red("Pokémon introuvable ou erreur API. Fin."));
    return;
  }
  if (player.moves.length < 5) {
    console.log(chalk.yellow(`Attention : ${player.name} n'a que ${player.moves.length} attaques valides (power+accuracy+pp).`));
  }
  player.moves = choosePlayerMoves(player);

  // Bot: pokémon aléatoire parmi une courte liste
  const botPool = ["pikachu","charmander","squirtle","bulbasaur","eevee","pidgey"];
  const botChoice = botPool[Math.floor(Math.random() * botPool.length)];
  let bot = await fetchPokemon(botChoice);
  if (!bot) {
    console.log(chalk.red("Erreur lors du choix du bot. Fin."));
    return;
  }
  bot.moves = chooseBotMoves(bot);
  if (bot.moves.length < 5) {
    // si le bot n'a pas 5 attaques valides, on duplique ou on garde ce qu'il a
    while (bot.moves.length < 5 && bot.moves.length > 0) {
      bot.moves.push(JSON.parse(JSON.stringify(bot.moves[0])));
    }
  }

  console.log(chalk.yellow(`\nLe bot choisit ${bot.name.toUpperCase()} !`));
  console.log(chalk.yellow("Début du combat !\n"));

  // Boucle de combat
  while (player.hp > 0 && bot.hp > 0) {
    showStatus(player, bot);

    // Tour joueur
    let choice = rl.questionInt("Choisis ton attaque (1-5): ");
    const idx = choice - 1;
    if (idx < 0 || idx >= player.moves.length) {
      console.log(chalk.yellow("Choix invalide, tu rates ton tour."));
    } else {
      const move = player.moves[idx];
      performAttack(player, bot, move);
    }

    if (bot.hp <= 0) {
      console.log(chalk.green.bold("\n🏆 Tu as gagné !"));
      break;
    }

    // Tour bot (choix aléatoire)
    const botMove = bot.moves[Math.floor(Math.random() * bot.moves.length)];
    console.log(chalk.gray(`\nLe bot (${bot.name}) réfléchit...`));
    // petit délai visuel
    const waitMS = 700;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, waitMS); // pause synchrone simple
    performAttack(bot, player, botMove);

    if (player.hp <= 0) {
      console.log(chalk.red.bold("\n💀 Tu as perdu..."));
      break;
    }
  }

  console.log(chalk.blue("\nFin du jeu. Merci d'avoir joué !"));
}

main().catch(err => {
  console.error("Erreur inattendue :", err.message || err);
});
