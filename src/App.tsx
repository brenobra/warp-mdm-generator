/**
 * Main App component for WARP MDM Generator
 */

import { signal } from '@preact/signals';
import { useRef, useState } from 'preact/hooks';
import type { MDMConfig, OrganizationConfig } from './lib/types';
import { createDefaultOrganization } from './lib/xmlGenerator';
import { parseXmlToConfig } from './lib/xmlParser';
import { Header } from './components/Header';
import { GlobalSettings } from './components/GlobalSettings';
import { OrganizationCard } from './components/OrganizationCard';
import { XmlPreview } from './components/XmlPreview';
import { ImportNotification } from './components/ImportNotification';
import { PlusCircle, Upload } from 'lucide-preact';

// Global state
export const mdmConfig = signal<MDMConfig>({
  configs: [createDefaultOrganization()],
  multi_user: false,
  pre_login: false,
  android_apps: [],
});

// Import notification state
export const importNotification = signal<{
  show: boolean;
  message: string;
  type: 'success' | 'error';
} | null>(null);

// Import warnings (displayed in validation panel)
export const importWarnings = signal<string[]>([]);

export function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addOrganization = () => {
    const current = mdmConfig.value;
    mdmConfig.value = {
      ...current,
      configs: [...(current.configs || []), createDefaultOrganization()],
    };
  };

  const removeOrganization = (index: number) => {
    const current = mdmConfig.value;
    const configs = [...(current.configs || [])];
    configs.splice(index, 1);
    mdmConfig.value = {
      ...current,
      configs: configs.length > 0 ? configs : [createDefaultOrganization()],
    };
  };

  const updateOrganization = (index: number, org: OrganizationConfig) => {
    const current = mdmConfig.value;
    const configs = [...(current.configs || [])];
    configs[index] = org;
    mdmConfig.value = {
      ...current,
      configs,
    };
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    // Reset warnings
    importWarnings.value = [];

    try {
      const text = await file.text();
      const { config, warnings } = parseXmlToConfig(text);

      // Replace the entire config
      mdmConfig.value = {
        ...config,
        configs: config.configs || [createDefaultOrganization()],
      };

      // Store warnings for display in validation panel
      importWarnings.value = warnings;

      // Show success notification
      const orgCount = config.configs?.length || 0;
      const message = `Imported ${orgCount} organization${orgCount !== 1 ? 's' : ''}`;
      importNotification.value = {
        show: true,
        message,
        type: 'success',
      };

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        importNotification.value = null;
      }, 3000);
    } catch (error) {
      // Show error notification
      importNotification.value = {
        show: true,
        message: error instanceof Error ? error.message : 'Failed to import file',
        type: 'error',
      };

      // Auto-dismiss after 5 seconds for errors
      setTimeout(() => {
        importNotification.value = null;
      }, 5000);
    }
  };

  const handleFileImport = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    await processFile(file);

    // Reset file input
    target.value = '';
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.name.endsWith('.xml') && !file.name.endsWith('.plist')) {
      importNotification.value = {
        show: true,
        message: 'Please upload a .xml or .plist file',
        type: 'error',
      };
      setTimeout(() => {
        importNotification.value = null;
      }, 5000);
      return;
    }

    await processFile(file);
  };

  const isMultiOrg = (mdmConfig.value.configs?.length || 0) > 1;

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ImportNotification />
      <Header />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Configuration */}
          <div class="space-y-6">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,.plist"
              onChange={handleFileImport}
              class="hidden"
            />

            {/* Import Button / Drop Zone */}
            <button
              onClick={handleImportClick}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              class={`
                w-full btn btn-ghost px-4 py-3 border-2 border-dashed rounded-lg transition-all group
                ${isDragging
                  ? 'border-cf-blue-500 bg-cf-blue-50 dark:bg-cf-blue-950 scale-105'
                  : 'border-gray-300 dark:border-gray-700 hover:border-cf-blue-500 dark:hover:border-cf-blue-500'
                }
              `}
            >
              <Upload class={`w-5 h-5 mr-2 ${isDragging ? 'text-cf-blue-500' : 'text-gray-400 group-hover:text-cf-blue-500'}`} />
              <span class={`font-medium ${isDragging ? 'text-cf-blue-500' : 'text-gray-600 dark:text-gray-400 group-hover:text-cf-blue-500'}`}>
                {isDragging ? 'Drop your MDM file here' : 'Import Existing MDM File'}
              </span>
            </button>

            {/* Global Settings */}
            <GlobalSettings />

            {/* Organizations */}
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="text-2xl">🏢</span>
                  Organizations
                  {isMultiOrg && (
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({mdmConfig.value.configs?.length || 0})
                    </span>
                  )}
                </h2>
              </div>

              {mdmConfig.value.configs?.map((org, index) => (
                <OrganizationCard
                  key={index}
                  organization={org}
                  index={index}
                  isMultiOrg={isMultiOrg}
                  onUpdate={(updatedOrg) => updateOrganization(index, updatedOrg)}
                  onRemove={() => removeOrganization(index)}
                  canRemove={(mdmConfig.value.configs?.length || 0) > 1}
                />
              ))}

              {/* Add Organization Button */}
              <button
                onClick={addOrganization}
                class="w-full btn btn-ghost px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-cf-orange-500 dark:hover:border-cf-orange-500 transition-colors group"
              >
                <PlusCircle class="w-5 h-5 mr-2 text-gray-400 group-hover:text-cf-orange-500" />
                <span class="font-medium text-gray-600 dark:text-gray-400 group-hover:text-cf-orange-500">
                  Add Another Organization
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div class="lg:sticky lg:top-8 h-fit">
            <XmlPreview config={mdmConfig.value} />
          </div>
        </div>

        {/* Footer */}
        <footer class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Built for{' '}
            <a
              href="https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-cf-orange-500 hover:text-cf-orange-600 font-medium"
            >
              Cloudflare WARP
            </a>
            {' • '}
            <a
              href="https://github.com/brenobra/warp-mdm-generator"
              target="_blank"
              rel="noopener noreferrer"
              class="text-cf-orange-500 hover:text-cf-orange-600 font-medium"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
