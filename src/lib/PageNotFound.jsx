import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="text-center space-y-6">
        
        <h1 className="text-7xl font-light text-slate-300">404</h1>

        <div className="space-y-3">
          <h2 className="text-2xl font-medium text-slate-800">
            Page Not Found
          </h2>

          <p className="text-slate-600">
            The page <span className="font-medium">"{pageName}"</span> does not exist.
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 text-sm bg-white border rounded-lg"
        >
          Go Home
        </button>

      </div>
    </div>
  );
}
