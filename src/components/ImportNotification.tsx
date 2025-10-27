import { importNotification } from '../App';
import { CheckCircle, XCircle } from 'lucide-preact';

export function ImportNotification() {
  const notification = importNotification.value;

  if (!notification?.show) {
    return null;
  }

  const isSuccess = notification.type === 'success';

  return (
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
      <div
        class={`
          flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg
          backdrop-blur-sm border-2
          ${
            isSuccess
              ? 'bg-green-50/95 dark:bg-green-900/95 border-green-500 text-green-900 dark:text-green-100'
              : 'bg-red-50/95 dark:bg-red-900/95 border-red-500 text-red-900 dark:text-red-100'
          }
        `}
      >
        {isSuccess ? (
          <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        ) : (
          <XCircle class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
        )}
        <span class="font-medium">{notification.message}</span>
      </div>
    </div>
  );
}
