/**
 * Offline Queue — Queue changes when sync is unavailable
 */
export class OfflineQueue {
    private static KEY = '__offline_queue__';

    static async enqueue(key: string, value: unknown): Promise<void> {
        const result = await chrome.storage.local.get(this.KEY);
        const queue = (result[this.KEY] as Array<{ key: string; value: unknown; timestamp: number }>) || [];
        queue.push({ key, value, timestamp: Date.now() });
        await chrome.storage.local.set({ [this.KEY]: queue });
    }

    static async flush(): Promise<Array<{ key: string; value: unknown }>> {
        const result = await chrome.storage.local.get(this.KEY);
        const queue = (result[this.KEY] as Array<{ key: string; value: unknown }>) || [];
        if (queue.length > 0) {
            const updates: Record<string, unknown> = {};
            queue.forEach((item) => { updates[item.key] = item.value; });
            await chrome.storage.sync.set(updates);
            await chrome.storage.local.remove(this.KEY);
        }
        return queue;
    }

    static async getSize(): Promise<number> {
        const result = await chrome.storage.local.get(this.KEY);
        return ((result[this.KEY] as unknown[]) || []).length;
    }

    static async clear(): Promise<void> { await chrome.storage.local.remove(this.KEY); }
}
