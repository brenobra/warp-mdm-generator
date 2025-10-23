/**
 * Main App component for WARP MDM Generator
 */

import { signal } from '@preact/signals';
import type { MDMConfig, OrganizationConfig } from './lib/types';
import { createDefaultOrganization } from './lib/xmlGenerator';
import { Header } from './components/Header';
import { GlobalSettings } from './components/GlobalSettings';
import { OrganizationCard } from './components/OrganizationCard';
import { XmlPreview } from './components/XmlPreview';
import { PlusCircle } from 'lucide-preact';

// Global state
export const mdmConfig = signal<MDMConfig>({
  configs: [createDefaultOrganization()],
  multi_user: false,
  pre_login: false,
  android_apps: [],
});

export function App() {
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

  const isMultiOrg = (mdmConfig.value.configs?.length || 0) > 1;

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            WARP MDM Configuration Generator
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Generate <code class="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-sm">mdm.xml</code> files for Cloudflare WARP with all documented parameters.
            Configure single or multiple organizations with full control over client behavior.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Configuration */}
          <div class="space-y-6">
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
