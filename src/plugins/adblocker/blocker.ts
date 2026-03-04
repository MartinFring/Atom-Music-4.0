// Used for caching
import path from 'node:path';
import fs, { promises } from 'node:fs';

import { ElectronBlocker } from '@ghostery/adblocker-electron';
import { app, net } from 'electron';

const SOURCES = [
  'https://raw.githubusercontent.com/kbinani/adblock-youtube-ads/master/signed.txt',
  // UBlock Origin
  'https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets/ublock-origin/filters.txt',
  'https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets/ublock-origin/quick-fixes.txt',
  'https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets/ublock-origin/unbreak.txt',
  'https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets/ublock-origin/filters-2020.txt',
  'https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets/ublock-origin/filters-2021.txt',
  'https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets/ublock-origin/filters-2022.txt',
  'https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets/ublock-origin/filters-2023.txt',
  // Fanboy Annoyances
  'https://secure.fanboy.co.nz/fanboy-annoyance_ubo.txt',
  // AdGuard
  'https://filters.adtidy.org/extension/ublock/filters/122_optimized.txt',
];

let blocker: ElectronBlocker | undefined;

const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export const loadAdBlockerEngine = async (
  session: Electron.Session | undefined = undefined,
  cache: boolean = true,
  additionalBlockLists: string[] = [],
  disableDefaultLists: boolean | unknown[] = false,
) => {
  const cacheDirectory = path.join(app.getPath('userData'), 'adblock_cache');
  if (!fs.existsSync(cacheDirectory)) {
    fs.mkdirSync(cacheDirectory);
  }

  const cachePath = path.join(cacheDirectory, 'adblocker-engine.bin');
  const useCache = cache && additionalBlockLists.length === 0;
  const lists = [
    ...((disableDefaultLists && !Array.isArray(disableDefaultLists)) ||
    (Array.isArray(disableDefaultLists) && disableDefaultLists.length > 0)
      ? []
      : SOURCES),
    ...additionalBlockLists,
  ];

  // Cache-first: try loading from cached binary immediately
  if (useCache && fs.existsSync(cachePath)) {
    try {
      const engineBytes = await promises.readFile(cachePath);
      blocker = ElectronBlocker.deserialize(engineBytes);
      if (session) {
        blocker.enableBlockingInSession(session);
      }

      // Update filter lists in background if cache is stale (>24h)
      const cacheAge = Date.now() - fs.statSync(cachePath).mtimeMs;
      if (cacheAge > CACHE_MAX_AGE_MS) {
        updateFilterListsInBackground(session, lists, cachePath).catch(
          (err) => console.error('Background filter list update failed', err),
        );
      }

      return;
    } catch {
      // Cache corrupted, fall through to full load
    }
  }

  // No cache or cache failed — full network load
  try {
    blocker = await ElectronBlocker.fromLists(
      (url: string) => net.fetch(url),
      lists,
      {
        enableCompression: true,
        loadNetworkFilters: session !== undefined,
      },
      useCache
        ? { path: cachePath, read: promises.readFile, write: promises.writeFile }
        : undefined,
    );
    if (session) {
      blocker.enableBlockingInSession(session);
    }
  } catch (error) {
    console.error('Error loading adBlocker engine', error);
  }
};

async function updateFilterListsInBackground(
  session: Electron.Session | undefined,
  lists: string[],
  cachePath: string,
) {
  const freshBlocker = await ElectronBlocker.fromLists(
    (url: string) => net.fetch(url),
    lists,
    {
      enableCompression: true,
      loadNetworkFilters: session !== undefined,
    },
  );

  // Serialize and save to cache
  const serialized = freshBlocker.serialize();
  await promises.writeFile(cachePath, serialized);

  // Hot-swap the blocker
  if (session && blocker) {
    blocker.disableBlockingInSession(session);
  }
  blocker = freshBlocker;
  if (session) {
    blocker.enableBlockingInSession(session);
  }
}

export const unloadAdBlockerEngine = (session: Electron.Session) => {
  if (blocker) {
    blocker.disableBlockingInSession(session);
  }
};

export const isBlockerEnabled = (session: Electron.Session) =>
  blocker !== undefined && blocker.isBlockingEnabled(session);
