# webext-storage-sync

A simple Promise-based wrapper for chrome.storage API with automatic JSON serialization and TypeScript support.

## Features

- Promise-based API (no callbacks)
- Automatic JSON serialization
- TypeScript support with generics
- Default values
- Change listeners
- Namespace support
- Bulk operations

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

## License

MIT
