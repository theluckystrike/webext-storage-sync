/**
 * Sync Manager — Intelligent sync between chrome.storage.local and chrome.storage.sync
 */
export interface SyncConfig { keys: string[]; syncInterval?: number; conflictStrategy?: 'local-wins' | 'sync-wins' | 'newest-wins'; onSync?: (synced: string[]) => void; onConflict?: (key: string, local: unknown, remote: unknown) => unknown; }

export class SyncManager {
    private config: Required<SyncConfig>;
    private intervalId?: ReturnType<typeof setInterval>;

    constructor(config: SyncConfig) {
        this.config = { syncInterval: 30000, conflictStrategy: 'newest-wins', onSync: () => { }, onConflict: (_, __, remote) => remote, ...config };
    }

    /** Start automatic syncing */
    start(): void {
        this.sync();
        this.intervalId = setInterval(() => this.sync(), this.config.syncInterval);
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local') this.pushToSync(changes);
        });
    }

    /** Stop syncing */
    stop(): void { if (this.intervalId) clearInterval(this.intervalId); }

    /** Manual sync */
    async sync(): Promise<string[]> {
        const synced: string[] = [];
        const localData = await chrome.storage.local.get(this.config.keys);
        const syncData = await chrome.storage.sync.get(this.config.keys);

        for (const key of this.config.keys) {
            const local = localData[key];
            const remote = syncData[key];

            if (local === undefined && remote !== undefined) {
                await chrome.storage.local.set({ [key]: remote });
                synced.push(key);
            } else if (local !== undefined && remote === undefined) {
                await chrome.storage.sync.set({ [key]: local });
                synced.push(key);
            } else if (JSON.stringify(local) !== JSON.stringify(remote)) {
                const resolved = this.resolve(key, local, remote);
                await chrome.storage.local.set({ [key]: resolved });
                await chrome.storage.sync.set({ [key]: resolved });
                synced.push(key);
            }
        }

        if (synced.length > 0) this.config.onSync(synced);
        return synced;
    }

    private resolve(key: string, local: unknown, remote: unknown): unknown {
        if (this.config.conflictStrategy === 'local-wins') return local;
        if (this.config.conflictStrategy === 'sync-wins') return remote;
        return this.config.onConflict(key, local, remote);
    }

    private async pushToSync(changes: Record<string, chrome.storage.StorageChange>): Promise<void> {
        const updates: Record<string, unknown> = {};
        for (const key of this.config.keys) {
            if (changes[key]?.newValue !== undefined) updates[key] = changes[key].newValue;
        }
        if (Object.keys(updates).length > 0) await chrome.storage.sync.set(updates);
    }
}
