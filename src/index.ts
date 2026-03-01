/**
 * webext-storage-sync — Cross-device sync for Chrome extensions
 */
export { SyncManager, type SyncConfig } from './sync';
export { ConflictResolver, type ConflictStrategy } from './conflict';
export { SyncStatus } from './status';
export { OfflineQueue } from './offline';
