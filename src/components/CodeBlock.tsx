import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  label?: string;
  onCopy?: () => void;
}

export default function CodeBlock({ code, label, onCopy }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      {label && (
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-800 dark:bg-black">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-black dark:hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <div className="relative">
        {!label && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 z-10 rounded-md bg-white/80 p-2 text-gray-500 opacity-0 backdrop-blur-sm transition-all hover:text-black group-hover:opacity-100 dark:bg-black/80 dark:hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-800 dark:text-gray-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
