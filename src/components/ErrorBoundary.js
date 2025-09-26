import React from 'react';
import { FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] min-h-[300px] flex items-center justify-center">
          <div className="text-center text-white">
            <FaExclamationTriangle className="text-4xl text-red-400 mb-4 mx-auto" />
            <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">
              {this.props.fallbackMessage || "An error occurred while rendering this component."}
            </p>
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 mx-auto"
            >
              <FaSyncAlt className="text-sm" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
