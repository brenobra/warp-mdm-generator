/**
 * Organization card component with collapsible sections
 */

import { signal } from '@preact/signals';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, Trash2, Building2 } from 'lucide-preact';
import type { OrganizationConfig } from '../lib/types';
import { ORGANIZATION_PARAMETERS } from '../lib/constants';
import { ParameterInput } from './ParameterInput';

interface OrganizationCardProps {
  organization: OrganizationConfig;
  index: number;
  isMultiOrg: boolean;
  onUpdate: (org: OrganizationConfig) => void;
  onRemove: () => void;
  canRemove: boolean;
}

// Track which sections are open for each org (by index)
const openSections = signal<Record<number, Record<string, boolean>>>({});

export function OrganizationCard({
  organization,
  index,
  isMultiOrg,
  onUpdate,
  onRemove,
  canRemove,
}: OrganizationCardProps) {
  // Initialize open sections for this org if not exists
  if (!openSections.value[index]) {
    openSections.value = {
      ...openSections.value,
      [index]: {
        essential: true, // Essential section open by default
        authentication: false,
        behavior: false,
        network: false,
        identity: false,
      },
    };
  }

  const toggleSection = (section: string) => {
    openSections.value = {
      ...openSections.value,
      [index]: {
        ...openSections.value[index],
        [section]: !openSections.value[index]![section],
      },
    };
  };

  const updateField = (key: keyof OrganizationConfig, value: any) => {
    onUpdate({
      ...organization,
      [key]: value,
    });
  };

  const getSectionParams = (category: string) => {
    return ORGANIZATION_PARAMETERS.filter((p) => p.category === category);
  };

  const renderSection = (category: string, title: string, icon: string) => {
    const params = getSectionParams(category);
    const isOpen = openSections.value[index]?.[category] || false;

    return (
      <Collapsible.Root open={isOpen} onOpenChange={() => toggleSection(category)}>
        <Collapsible.Trigger class="collapsible-trigger w-full">
          <div class="flex items-center gap-2">
            <span>{icon}</span>
            <span class="font-medium">{title}</span>
            <span class="text-xs text-gray-500">({params.length})</span>
          </div>
          <ChevronDown
            class={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Collapsible.Trigger>

        <Collapsible.Content class="mt-4 space-y-4 px-4">
          {params.map((param) => (
            <ParameterInput
              key={param.key as string}
              param={param}
              value={organization[param.key as keyof OrganizationConfig]}
              onChange={(value) => updateField(param.key as keyof OrganizationConfig, value)}
            />
          ))}
        </Collapsible.Content>
      </Collapsible.Root>
    );
  };

  return (
    <div class="card p-6 space-y-4 animate-slide-down">
      {/* Card Header */}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-cf-orange-100 dark:bg-cf-orange-900/30 rounded-lg flex items-center justify-center">
            <Building2 class="w-5 h-5 text-cf-orange-600 dark:text-cf-orange-400" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {organization.display_name || organization.organization || `Organization #${index + 1}`}
            </h3>
            {isMultiOrg && (
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {organization.organization || 'Not configured'}
              </p>
            )}
          </div>
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            class="btn btn-ghost p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Remove organization"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sections */}
      <div class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        {renderSection('essential', 'Essential Configuration', '📋')}
        {renderSection('authentication', 'Authentication', '🔐')}
        {renderSection('behavior', 'Client Behavior', '⚙️')}
        {renderSection('network', 'Advanced Network', '🌐')}
        {renderSection('identity', 'Device Identity', '🆔')}
      </div>

      {/* Multi-org warning */}
      {isMultiOrg && !organization.display_name && (
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Display Name</strong> is required for multi-organization setups
          </p>
        </div>
      )}
    </div>
  );
}
