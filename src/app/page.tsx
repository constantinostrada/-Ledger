export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome to Ledger
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
        A production-ready financial transaction management system built with
        clean architecture principles.
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          API Endpoints
        </h2>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>POST /api/accounts</strong> - Create a new account
          </li>
          <li>
            <strong>GET /api/accounts?userId=:userId</strong> - Get user
            accounts
          </li>
          <li>
            <strong>POST /api/transactions</strong> - Create a transaction
          </li>
          <li>
            <strong>GET /api/transactions?accountId=:accountId</strong> - Get
            account transactions
          </li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Architecture
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          This application follows Clean Architecture principles with four
          distinct layers:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Domain</strong> - Business entities, value objects, and
            repository interfaces
          </li>
          <li>
            <strong>Application</strong> - Use cases and DTOs
          </li>
          <li>
            <strong>Infrastructure</strong> - Database implementations and
            external services
          </li>
          <li>
            <strong>Interfaces</strong> - API routes, controllers, and
            validation
          </li>
        </ul>
      </section>
    </main>
  );
}
