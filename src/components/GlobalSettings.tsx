/**
 * Global settings component (multi_user, pre_login)
 */

import { mdmConfig } from '../App';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, Settings } from 'lucide-preact';
import { signal } from '@preact/signals';

const isOpen = signal(false);

export function GlobalSettings() {
  const toggleMultiUser = () => {
    mdmConfig.value = {
      ...mdmConfig.value,
      multi_user: !mdmConfig.value.multi_user,
    };
  };

  const togglePreLogin = () => {
    mdmConfig.value = {
      ...mdmConfig.value,
      pre_login: !mdmConfig.value.pre_login,
    };
  };

  return (
    <div class="card p-6">
      <Collapsible.Root open={isOpen.value} onOpenChange={(open) => (isOpen.value = open)}>
        <Collapsible.Trigger class="collapsible-trigger w-full">
          <div class="flex items-center gap-2">
            <Settings class="w-5 h-5 text-cf-orange-500" />
            <span class="font-semibold text-gray-900 dark:text-white">Global Settings</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">(Windows only)</span>
          </div>
          <ChevronDown
            class={`w-5 h-5 text-gray-500 transition-transform ${isOpen.value ? 'rotate-180' : ''}`}
          />
        </Collapsible.Trigger>

        <Collapsible.Content class="mt-4 space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            These settings apply globally to the entire MDM configuration and are specific to Windows devices.
          </p>

          {/* Multi-user */}
          <div class="flex items-start space-x-3">
            <input
              type="checkbox"
              id="multi_user"
              checked={mdmConfig.value.multi_user}
              onChange={toggleMultiUser}
              class="mt-1 w-4 h-4 text-cf-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-cf-orange-500"
            />
            <div class="flex-1">
              <label for="multi_user" class="label cursor-pointer">
                Multi-User Support
              </label>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Enable multiple user registrations on Windows devices. Each Windows user maintains a separate WARP registration.
              </p>
            </div>
          </div>

          {/* Pre-login */}
          <div class="flex items-start space-x-3">
            <input
              type="checkbox"
              id="pre_login"
              checked={mdmConfig.value.pre_login}
              onChange={togglePreLogin}
              class="mt-1 w-4 h-4 text-cf-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-cf-orange-500"
            />
            <div class="flex-1">
              <label for="pre_login" class="label cursor-pointer">
                Pre-Login Support
              </label>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Allow WARP to connect with a service token before user completes Windows login.
              </p>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
