# webext-storage-sync — Cross-Device Storage Sync for Chrome Extensions

[![npm](https://img.shields.io/npm/v/webext-storage-sync.svg)](https://www.npmjs.com/package/webext-storage-sync)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Built by [Zovo](https://zovo.one)**

**Intelligent sync between chrome.storage.local and chrome.storage.sync** — conflict resolution, merge strategies, offline queue, and sync status tracking.

## 📦 Install
```bash
npm install webext-storage-sync
```

## 🚀 Quick Start
```typescript
import { SyncManager } from 'webext-storage-sync';
const sync = new SyncManager({
  keys: ['settings', 'favorites', 'theme'],
  conflictStrategy: 'newest-wins',
  onSync: (synced) => console.log('Synced:', synced),
});
sync.start(); // Auto-syncs every 30s
```

## ✨ Features
- **SyncManager** — Automatic local ↔ sync with configurable interval
- **ConflictResolver** — local-wins, sync-wins, newest-wins, deep merge
- **OfflineQueue** — Buffer changes when sync unavailable, flush when online
- **SyncStatus** — Track last sync time and errors

## 📄 License
MIT — [Zovo](https://zovo.one)
