/**
 * Conflict Resolver — Strategies for handling sync conflicts
 */
export type ConflictStrategy = 'local-wins' | 'sync-wins' | 'newest-wins' | 'merge';

export class ConflictResolver {
    /** Merge two objects (shallow merge, arrays concatenated) */
    static merge(local: unknown, remote: unknown): unknown {
        if (typeof local !== 'object' || typeof remote !== 'object' || !local || !remote) return remote;
        if (Array.isArray(local) && Array.isArray(remote)) {
            return [...new Set([...local, ...remote])]; // Deduplicated merge
        }
        return { ...(local as Record<string, unknown>), ...(remote as Record<string, unknown>) };
    }

    /** Deep merge two objects */
    static deepMerge(local: unknown, remote: unknown): unknown {
        if (typeof local !== 'object' || typeof remote !== 'object' || !local || !remote) return remote;
        if (Array.isArray(local) && Array.isArray(remote)) return [...new Set([...local, ...remote])];
        const result: Record<string, unknown> = { ...(local as Record<string, unknown>) };
        for (const [key, value] of Object.entries(remote as Record<string, unknown>)) {
            result[key] = key in result ? this.deepMerge(result[key], value) : value;
        }
        return result;
    }

    /** Resolve using timestamps (newest wins) */
    static newestWins(localData: { value: unknown; updatedAt: number }, remoteData: { value: unknown; updatedAt: number }): unknown {
        return localData.updatedAt >= remoteData.updatedAt ? localData.value : remoteData.value;
    }
}
