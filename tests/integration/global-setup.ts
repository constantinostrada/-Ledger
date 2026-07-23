import './setup-env';
import { PrismaClient } from '@prisma/client';

// Integration tests run against the shared dev database. They only ever
// touch data belonging to users they register themselves (all with
// @ledger.test emails), and this teardown removes those users afterwards —
// every owned row cascades away with them.
export default function globalSetup() {
  return async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.user.deleteMany({
        where: { email: { endsWith: '@ledger.test' } },
      });
    } finally {
      await prisma.$disconnect();
    }
  };
}
