// Result of one sweep run. The sweep is idempotent: due dates already
// materialized are skipped, so an immediate re-run reports createdCount 0.
export interface MaterializeRecurringResultDTO {
  /** Occurrences due across all the user's rules as of the sweep. */
  dueCount: number;
  /** Transactions actually inserted by this run (0 on a re-run). */
  createdCount: number;
}
