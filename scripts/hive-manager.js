#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const merchantsPath = path.join(__dirname, '..', 'data', 'merchants.json');
const logosDir = path.join(__dirname, '..', 'public', 'logos');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function ensureLogo(id) {
  ensureDir(logosDir);
  const file = path.join(logosDir, `${id}.png`);
  if (!fs.existsSync(file)) {
    const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9VUMHEQAAAAASUVORK5CYII=';
    fs.writeFileSync(file, Buffer.from(png, 'base64'));
  }
}

function loadMerchants() {
  if (!fs.existsSync(merchantsPath)) return {};
  return JSON.parse(fs.readFileSync(merchantsPath, 'utf8'));
}

function saveMerchants(data) {
  fs.writeFileSync(merchantsPath, JSON.stringify(data, null, 2));
}

function createHive(id, name, themeColor, baseId) {
  const merchants = loadMerchants();
  if (merchants[id]) throw new Error(`Hive ${id} already exists`);
  let base;
  if (baseId) {
    base = merchants[baseId];
    if (!base) throw new Error(`Base hive ${baseId} not found`);
  }
  const merchant = {
    name: name || (base ? base.name : id),
    themeColor: themeColor || (base ? base.themeColor : '#000000'),
    logo: `/logos/${id}.png`,
    products: base ? JSON.parse(JSON.stringify(base.products)) : [],
  };
  merchants[id] = merchant;
  ensureLogo(id);
  saveMerchants(merchants);
  console.log(`Hive ${id} created`);
}

function mergeHives(targetId, sourceId) {
  const merchants = loadMerchants();
  const target = merchants[targetId];
  const source = merchants[sourceId];
  if (!target || !source) throw new Error('Target or source hive not found');
  const offset = target.products.length;
  source.products.forEach((p, idx) => {
    target.products.push({ ...p, id: String(offset + idx + 1) });
  });
  delete merchants[sourceId];
  const logo = path.join(logosDir, `${sourceId}.png`);
  if (fs.existsSync(logo)) fs.rmSync(logo);
  saveMerchants(merchants);
  console.log(`Merged ${sourceId} into ${targetId}`);
}

function dissolveHive(id) {
  const merchants = loadMerchants();
  if (!merchants[id]) throw new Error('Hive not found');
  delete merchants[id];
  const logo = path.join(logosDir, `${id}.png`);
  if (fs.existsSync(logo)) fs.rmSync(logo);
  saveMerchants(merchants);
  console.log(`Hive ${id} dissolved`);
}

function printHelp() {
  console.log(`Hive Manager\nCommands:\n  create <id> <name> <themeColor> [baseId]\n  merge <targetId> <sourceId>\n  dissolve <id>`);
}

const [,,cmd,...args] = process.argv;
try {
  switch (cmd) {
    case 'create':
      createHive(args[0], args[1], args[2], args[3]);
      break;
    case 'merge':
      mergeHives(args[0], args[1]);
      break;
    case 'dissolve':
      dissolveHive(args[0]);
      break;
    default:
      printHelp();
  }
} catch (err) {
  console.error((err && err.message) || err);
  process.exit(1);
}
