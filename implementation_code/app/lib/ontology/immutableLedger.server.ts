import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { LedgerRecord } from "./types";

export class ImmutableAuditLedger {
  constructor(private readonly storagePath = "runtime/audit-ledger.ndjson") {}

  async appendLog(
    entry: Omit<LedgerRecord, "timestamp" | "entryId" | "previousHash" | "hash">,
  ): Promise<LedgerRecord> {
    await mkdir(dirname(this.storagePath), { recursive: true });

    const previousHash = await this.readLastHash();
    const timestamp = new Date().toISOString();
    const entryId = randomUUID();
    const recordWithoutHash = {
      timestamp,
      entryId,
      previousHash,
      ...entry,
    };
    const hash = createHash("sha256")
      .update(JSON.stringify(recordWithoutHash))
      .digest("hex");
    const record: LedgerRecord = { ...recordWithoutHash, hash };

    await appendFile(this.storagePath, `${JSON.stringify(record)}\n`, "utf8");
    return record;
  }

  private async readLastHash(): Promise<string | null> {
    try {
      const content = await readFile(this.storagePath, "utf8");
      const lines = content.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length === 0) {
        return null;
      }

      const last = JSON.parse(lines[lines.length - 1]) as { hash?: unknown };
      return typeof last.hash === "string" ? last.hash : null;
    } catch (error) {
      if (isMissingFileError(error)) {
        return null;
      }

      throw error;
    }
  }
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
