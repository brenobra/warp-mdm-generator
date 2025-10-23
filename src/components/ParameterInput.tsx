/**
 * Reusable parameter input component
 */

import { Info } from 'lucide-preact';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { ParameterMetadata } from '../lib/types';
import { validateFieldRealtime } from '../lib/validation';
import { useState } from 'preact/hooks';

interface ParameterInputProps {
  param: ParameterMetadata;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean | undefined) => void;
}

export function ParameterInput({ param, value, onChange }: ParameterInputProps) {
  const [validationError, setValidationError] = useState<string | undefined>();

  const handleChange = (newValue: string | number | boolean | undefined) => {
    // Validate in real-time
    const validation = validateFieldRealtime(param.key as string, newValue);
    setValidationError(validation.valid ? undefined : validation.message);
    onChange(newValue);
  };

  return (
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="label" for={param.key as string}>
          {param.label}
          {param.required && <span class="text-red-500 ml-1">*</span>}
        </label>
        {param.platforms && (
          <span class="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
            {param.platforms.join(', ')}
          </span>
        )}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Info class="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                class="max-w-xs bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-50"
                sideOffset={5}
              >
                {param.description}
                <Tooltip.Arrow class="fill-gray-900 dark:fill-gray-700" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>

      {param.type === 'string' && (
        <input
          id={param.key as string}
          type="text"
          value={(value as string) || ''}
          onInput={(e) => handleChange((e.target as HTMLInputElement).value)}
          placeholder={param.placeholder}
          class={`input ${validationError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
      )}

      {param.type === 'number' && (
        <input
          id={param.key as string}
          type="number"
          value={value !== undefined ? (value as number) : ''}
          onInput={(e) => {
            const val = (e.target as HTMLInputElement).value;
            handleChange(val === '' ? undefined : parseInt(val, 10));
          }}
          placeholder={param.placeholder}
          min={param.min}
          max={param.max}
          class={`input ${validationError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
      )}

      {param.type === 'boolean' && (
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <input
              id={param.key as string}
              type="checkbox"
              checked={value === true}
              onChange={(e) => handleChange((e.target as HTMLInputElement).checked)}
              class="w-4 h-4 text-cf-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-cf-orange-500"
            />
            <label for={param.key as string} class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              {value === undefined ? 'Enable this option' : value === true ? 'Enabled' : 'Disabled'}
            </label>
          </div>
          <button
            type="button"
            onClick={() => handleChange(undefined)}
            disabled={value === undefined}
            class="btn btn-ghost text-xs px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed"
            title={value === undefined ? 'Already unset' : 'Remove from MDM file (use dashboard setting)'}
          >
            Unset
          </button>
        </div>
      )}

      {param.type === 'select' && param.options && (
        <select
          id={param.key as string}
          value={(value as string) || ''}
          onChange={(e) => handleChange((e.target as HTMLSelectElement).value)}
          class="input"
        >
          <option value="">Unset / Dash default</option>
          {param.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {validationError && (
        <p class="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          {validationError}
        </p>
      )}
    </div>
  );
}
