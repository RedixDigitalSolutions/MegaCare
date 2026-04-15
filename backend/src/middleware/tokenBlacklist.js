// In-memory token blacklist for invalidated JWTs.
// Tokens are stored with their expiry time so the set never grows unbounded.
//
// ⚠️  PRODUCTION NOTE: This Map is per-process and will not work correctly
// in a multi-instance / load-balanced deployment (each instance has its own
// blacklist, so a token revoked on instance A is still accepted on instance B).
// Replace with a Redis SET:
//   - addToBlacklist  → SET token 1 PX <ttl_ms>  (auto-expires with TTL)
//   - isBlacklisted   → EXISTS token
// Use ioredis or the official redis npm package.

const blacklist = new Map(); // token → expiresAt (ms)

function addToBlacklist(token, expiresAt) {
    blacklist.set(token, expiresAt);
    // Prune expired entries opportunistically
    const now = Date.now();
    for (const [t, exp] of blacklist) {
        if (exp <= now) blacklist.delete(t);
    }
}

function isBlacklisted(token) {
    if (!blacklist.has(token)) return false;
    if (blacklist.get(token) <= Date.now()) {
        blacklist.delete(token);
        return false;
    }
    return true;
}

module.exports = { addToBlacklist, isBlacklisted };
