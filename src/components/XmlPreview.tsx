/**
 * XML Preview component with syntax highlighting and export
 */

import { useState, useEffect } from 'preact/hooks';
import { Copy, Download, CheckCircle, AlertCircle } from 'lucide-preact';
import type { MDMConfig } from '../lib/types';
import { generateMDMXml } from '../lib/xmlGenerator';
import { validateMDMConfig } from '../lib/validation';
import { PLATFORM_PATHS } from '../lib/constants';

interface XmlPreviewProps {
  config: MDMConfig;
}

export function XmlPreview({ config }: XmlPreviewProps) {
  const [xml, setXml] = useState('');
  const [copied, setCopied] = useState(false);
  const [highlightedXml, setHighlightedXml] = useState('');

  // Generate XML whenever config changes
  useEffect(() => {
    try {
      const generatedXml = generateMDMXml(config);
      setXml(generatedXml);
      // Simple syntax highlighting (we can enhance this with shiki later)
      setHighlightedXml(highlightXmlSimple(generatedXml));
    } catch (error) {
      console.error('Error generating XML:', error);
      setXml('');
      setHighlightedXml('');
    }
  }, [config]);

  // Validate configuration
  const validation = validateMDMConfig(config);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadXml = () => {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mdm.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div class="space-y-4">
      {/* Validation Status */}
      {validation.errors.length > 0 && (
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-start gap-2">
            <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <h4 class="font-semibold text-red-800 dark:text-red-200 mb-2">
                Configuration Errors
              </h4>
              <ul class="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                {validation.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {validation.warnings.length > 0 && validation.errors.length === 0 && (
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div class="flex items-start gap-2">
            <AlertCircle class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <h4 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Warnings</h4>
              <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                {validation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {validation.valid && (
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div class="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle class="w-5 h-5" />
            <span class="text-sm font-medium">Configuration is valid!</span>
          </div>
        </div>
      )}

      {/* XML Preview */}
      <div class="card p-0 overflow-hidden">
        <div class="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📄</span>
            Generated XML
          </h3>
          <div class="flex gap-2">
            <button
              onClick={copyToClipboard}
              disabled={!validation.valid}
              class="btn btn-ghost px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <CheckCircle class="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy class="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={downloadXml}
              disabled={!validation.valid}
              class="btn btn-primary px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download mdm.xml"
            >
              <Download class="w-4 h-4 mr-1" />
              Download
            </button>
          </div>
        </div>

        <div class="code-block max-h-[600px] overflow-y-auto">
          <pre class="text-sm">
            <code dangerouslySetInnerHTML={{ __html: highlightedXml }} />
          </pre>
        </div>
      </div>

      {/* Platform Instructions */}
      <div class="card p-4">
        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">
          💡 Installation Instructions
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Save the generated file to the following location on your device:
        </p>
        <div class="space-y-2 text-sm">
          <div class="bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
            <strong class="text-gray-900 dark:text-white">Windows:</strong>
            <code class="block mt-1 text-cf-orange-600 dark:text-cf-orange-400 font-mono text-xs">
              {PLATFORM_PATHS.windows}
            </code>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
            <strong class="text-gray-900 dark:text-white">macOS:</strong>
            <code class="block mt-1 text-cf-orange-600 dark:text-cf-orange-400 font-mono text-xs">
              {PLATFORM_PATHS.macos}
            </code>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
            <strong class="text-gray-900 dark:text-white">Linux:</strong>
            <code class="block mt-1 text-cf-orange-600 dark:text-cf-orange-400 font-mono text-xs">
              {PLATFORM_PATHS.linux}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple XML syntax highlighting with theme support
 * Can be enhanced with shiki for better highlighting
 */
function highlightXmlSimple(xml: string): string {
  return xml
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w-]+)/g, '<span class="text-blue-600 dark:text-blue-400">$1$2</span>')
    .replace(/(&lt;key&gt;)([^&]+)(&lt;\/key&gt;)/g, '$1<span class="text-green-600 dark:text-green-400">$2</span>$3')
    .replace(/(&lt;string&gt;)([^&]+)(&lt;\/string&gt;)/g, '$1<span class="text-amber-600 dark:text-yellow-300">$2</span>$3')
    .replace(/(&lt;integer&gt;)([^&]+)(&lt;\/integer&gt;)/g, '$1<span class="text-purple-600 dark:text-purple-400">$2</span>$3')
    .replace(/(&lt;)(true|false)(\s*\/&gt;)/g, '$1<span class="text-orange-600 dark:text-orange-400">$2</span>$3');
}
