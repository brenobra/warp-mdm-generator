/**
 * Header component with dark mode toggle
 */

import { signal } from '@preact/signals';
import { Moon, Sun } from 'lucide-preact';

const isDark = signal(
  localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
);

export function Header() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');

    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-cf-orange-500 to-cf-blue-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">W</span>
            </div>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">
              WARP MDM Generator
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            class="btn btn-ghost p-2"
            aria-label="Toggle dark mode"
          >
            {isDark.value ? (
              <Sun class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
