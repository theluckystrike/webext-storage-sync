# webext-storage-sync

[![npm version](https://img.shields.io/npm/v/webext-storage-sync)](https://npmjs.com/package/webext-storage-sync)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![CI Status](https://img.shields.io/github/actions/workflow/status/theluckystrike/webext-storage-sync/ci.yml?branch=main)](https://github.com/theluckystrike/webext-storage-sync/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-storage-sync?style=social)](https://github.com/theluckystrike/webext-storage-sync)

> A simple Promise-based wrapper for chrome.storage API with automatic JSON serialization and TypeScript support.

## Overview

**webext-storage-sync** is a lightweight Promise-based wrapper for the chrome.storage API. It provides automatic JSON serialization, TypeScript support with generics, default values, change listeners, namespace support, and bulk operations.

Part of the [Zovo](https://zovo.one) developer tools family.

## Features

- ✅ **Promise-Based** - No callbacks, clean async/await
- ✅ **Auto Serialization** - JSON handled automatically
- ✅ **TypeScript** - Full generics support
- ✅ **Default Values** - Fallback when keys missing
- ✅ **Change Listeners** - Watch for storage changes
- ✅ **Bulk Operations** - Get/set multiple keys

## Installation

```bash
npm install webext-storage-sync
```

## Quick Start

### Basic Usage

```javascript
import { storage } from 'webext-storage-sync';

// Save data
await storage.set('user', { name: 'John', email: 'john@example.com' });

// Get data
const user = await storage.get('user');
console.log(user.name); // 'John'

// Remove data
await storage.remove('user');

// Clear all
await storage.clear();
```

### Default Values

```javascript
// Get with default if not found
const settings = await storage.get('settings', {
  theme: 'dark',
  notifications: true
});

// Returns default if key doesn't exist
const theme = await storage.get('theme', 'light');
```

### Bulk Operations

```javascript
// Get multiple values
const { user, settings, items } = await storage.get(['user', 'settings', 'items']);

// Set multiple values
await storage.set({
  user: { name: 'John' },
  settings: { theme: 'dark' }
});
```

### Watching for Changes

```javascript
import { watch } from 'webext-storage-sync';

// Watch for changes to a key
watch('settings', (newValue, oldValue) => {
  console.log('Settings changed:', newValue);
});

// Watch for any changes
watch((changes, area) => {
  console.log('Changes:', changes);
  console.log('Storage area:', area);
});
```

## API

### storage

| Method | Description |
|--------|-------------|
| `get(key, default?)` | Get value by key |
| `set(key, value)` | Set value |
| `remove(key)` | Remove value |
| `clear()` | Clear all storage |
| `getBytesInUse(key?)` | Get bytes used |

### storage.get(key, defaultValue?)

```javascript
// Single key
const value = await storage.get('key');

// With default
const value = await storage.get('key', 'default');

// Multiple keys
const { a, b } = await storage.get(['a', 'b']);
```

### storage.set(key, value)

```javascript
// Single value
await storage.set('user', { name: 'John' });

// Multiple values
await storage.set({
  a: 1,
  b: 2,
  c: 3
});
```

### watch(key, callback) / watch(callback)

```javascript
// Watch single key
const unwatch = watch('user', (newVal, oldVal) => {
  console.log('User changed');
});

// Watch all changes
const unwatch = watch((changes, area) => {
  console.log(changes);
});

// Stop watching
unwatch();
```

## TypeScript

```typescript
import { storage, watch } from 'webext-storage-sync';

interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
}

interface User {
  id: string;
  name: string;
}

// Typed get
const settings = await storage.get<Settings>('settings', {
  theme: 'dark',
  notifications: true
});

// Typed set
await storage.set<User>('user', {
  id: '1',
  name: 'John'
});

// Typed watch
watch<Settings>('settings', (newSettings) => {
  console.log(newSettings.theme);
});
```

## Using with React

```javascript
import { useState, useEffect } from 'react';
import { storage, watch } from 'webext-storage-sync';

function useStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    // Load initial value
    storage.get(key, defaultValue).then(setValue);
    
    // Watch for changes
    return watch(key, setValue);
  }, [key]);

  const updateValue = (newValue) => {
    setValue(newValue);
    return storage.set(key, newValue);
  };

  return [value, updateValue];
}

// Usage
function App() {
  const [theme, setTheme] = useStorage('theme', 'dark');
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {theme}
    </button>
  );
}
```

## Browser Support

- Chrome 88+
- Edge 88+
- Chromium-based browsers

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/storage-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/storage-feature`
7. **Submit** a Pull Request

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Advanced storage wrapper
- [webext-reactive-store](https://github.com/theluckystrike/webext-reactive-store) - State management
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Extension template
- [zovo-extension-template](https://github.com/theluckystrike/zovo-extension-template) - Privacy-first template

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
