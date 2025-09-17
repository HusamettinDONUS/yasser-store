"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bir Şeyler Yanlış Gitti
          </h1>
          <p className="text-gray-600 mb-6">
            Uygulama yüklenirken bir hata oluştu. Bu genellikle geçici bir
            sorundur.
          </p>
          <details className="text-left mb-6 bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Teknik Detaylar
            </summary>
            <code className="text-sm text-red-600 break-all">
              {error.message}
            </code>
          </details>
          <div className="space-y-3">
            <button
              onClick={retry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              🔄 Tekrar Dene
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
            >
              🔃 Sayfayı Yenile
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Sorun devam ederse, browser cache'ini temizleyin veya geliştirici
            konsolu için F12'ye basın.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundaryClass {...props} />;
}
