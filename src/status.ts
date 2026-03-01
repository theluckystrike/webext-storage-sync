/**
 * Sync Status — Track and display sync state
 */
export class SyncStatus {
    private static KEY = '__sync_status__';

    static async setLastSync(): Promise<void> { await chrome.storage.local.set({ [this.KEY]: { lastSync: Date.now(), error: null } }); }

    static async setError(error: string): Promise<void> {
        const result = await chrome.storage.local.get(this.KEY);
        const status = (result[this.KEY] as Record<string, unknown>) || {};
        await chrome.storage.local.set({ [this.KEY]: { ...status, error, errorAt: Date.now() } });
    }

    static async getStatus(): Promise<{ lastSync: number | null; error: string | null; errorAt: number | null }> {
        const result = await chrome.storage.local.get(this.KEY);
        const status = (result[this.KEY] as Record<string, unknown>) || {};
        return { lastSync: (status.lastSync as number) || null, error: (status.error as string) || null, errorAt: (status.errorAt as number) || null };
    }

    static async getTimeSinceLastSync(): Promise<number | null> {
        const status = await this.getStatus();
        return status.lastSync ? Date.now() - status.lastSync : null;
    }
}
