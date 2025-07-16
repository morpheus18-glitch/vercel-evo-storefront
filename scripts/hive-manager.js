#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const merchantsPath = path.join(__dirname, '..', 'data', 'merchants.json');
const logosDir = path.join(__dirname, '..', 'public', 'logos');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function ensureLogo(id, color = '#000000', name = id) {
  ensureDir(logosDir);
  const file = path.join(logosDir, `${id}.png`);
  if (fs.existsSync(file)) return;
  const image = new Jimp(256, 256, color);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  image.print(
    font,
    0,
    0,
    {
      text: name.substring(0, 2).toUpperCase(),
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    256,
    256
  );
  await image.writeAsync(file);
}

function loadMerchants() {
  if (!fs.existsSync(merchantsPath)) return {};
  return JSON.parse(fs.readFileSync(merchantsPath, 'utf8'));
}

function saveMerchants(data) {
  fs.writeFileSync(merchantsPath, JSON.stringify(data, null, 2));
}

async function createHive(id, name, themeColor, baseId) {
  if (!id) throw new Error('ID required');
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
  await ensureLogo(id, merchant.themeColor, merchant.name);
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

const argv = yargs(hideBin(process.argv))
  .command('create <id> [name] [theme]', 'create a new hive', y => {
    y.positional('id', { describe: 'Hive ID', type: 'string' })
      .positional('name', { describe: 'Display name', type: 'string' })
      .positional('theme', { describe: 'Hex color for theme', type: 'string' })
      .option('base', { type: 'string', describe: 'Base hive to clone' });
  })
  .command('merge <target> <source>', 'merge source hive into target', y => {
    y.positional('target', { type: 'string' })
      .positional('source', { type: 'string' });
  })
  .command('dissolve <id>', 'remove a hive', y => {
    y.positional('id', { type: 'string' });
  })
  .demandCommand()
  .strict()
  .help()
  .argv;

(async () => {
  const cmd = argv._[0];
  try {
    if (cmd === 'create') {
      await createHive(argv.id, argv.name, argv.theme, argv.base);
    } else if (cmd === 'merge') {
      mergeHives(argv.target, argv.source);
    } else if (cmd === 'dissolve') {
      dissolveHive(argv.id);
    }
  } catch (err) {
    console.error((err && err.message) || err);
    process.exit(1);
  }
})();
