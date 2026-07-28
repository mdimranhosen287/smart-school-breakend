import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white border border-red-100 rounded-2xl shadow-xl font-sans text-gray-800 text-left">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            ⚠️ Application Error Detected
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            An unexpected error occurred. This might be due to mismatched data or corrupted cache. You can view the technical details below or reset the cache to fix it.
          </p>
          <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl mb-6 overflow-auto max-h-60">
            <p className="font-mono text-xs text-red-800 font-bold mb-2">
              {this.state.error && this.state.error.toString()}
            </p>
            <pre className="font-mono text-[10px] text-gray-500 whitespace-pre">
              {this.state.error && this.state.error.stack}
            </pre>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => { 
                localStorage.clear(); 
                window.location.reload(); 
              }} 
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition shadow-sm cursor-pointer"
            >
              Reset Cache & Reload
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition cursor-pointer"
            >
              Just Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
