import { ErrorBoundary } from '../components/ErrorBoundary';
import { VaultList } from '../components/VaultList';

export default function HomePage() {
  return (
    <ErrorBoundary>
      <main role="main" aria-label="Main content" className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-pearl to-dusk">
        <h1 className="text-3xl font-bold mb-4" tabIndex={0} aria-label="Welcome heading">
          Welcome to the AI-powered Mental Health Platform!
        </h1>
        <p className="mb-6 text-lg max-w-xl text-center">
          This platform is designed for clarity, safety, and collaboration.
        </p>
        <section aria-labelledby="vault-list-heading" className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-8">
          <h2 id="vault-list-heading" className="text-xl font-semibold mb-2">
            Vaults
          </h2>
          <VaultList apiUrl="/api/v1/vaults" />
        </section>
      </main>
    </ErrorBoundary>
  );
}
