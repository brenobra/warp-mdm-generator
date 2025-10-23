/**
 * Parameter definitions and metadata for all WARP MDM parameters
 */

import type { ParameterMetadata } from './types';

/**
 * Complete metadata for all organization-level parameters
 */
export const ORGANIZATION_PARAMETERS: ParameterMetadata[] = [
  // Essential Configuration
  {
    key: 'organization',
    label: 'Organization',
    description: 'Your Cloudflare Zero Trust team name. Required for most Zero Trust features including HTTP policies, Browser Isolation, and device posture.',
    type: 'string',
    placeholder: 'mycompany',
    required: true,
    category: 'essential',
  },
  {
    key: 'auto_connect',
    label: 'Auto Connect',
    description: 'Minutes before automatically reconnecting if user turns off WARP. Use 0 for indefinite (recommended for new deployments).',
    type: 'number',
    min: 0,
    max: 1440,
    placeholder: '0',
    category: 'essential',
  },
  {
    key: 'service_mode',
    label: 'Service Mode',
    description: 'Operational mode of the WARP client.',
    type: 'select',
    options: [
      { value: 'warp', label: 'Gateway with WARP (recommended)' },
      { value: '1dot1', label: 'Gateway with DoH (DNS only)' },
      { value: 'proxy', label: 'Proxy mode (requires proxy_port)' },
      { value: 'postureonly', label: 'Device Information Only' },
    ],
    category: 'essential',
  },
  {
    key: 'display_name',
    label: 'Display Name',
    description: 'User-friendly name shown in WARP GUI for this organization (required for multi-org deployments).',
    type: 'string',
    placeholder: 'Production Environment',
    category: 'essential',
  },

  // Authentication
  {
    key: 'auth_client_id',
    label: 'Auth Client ID',
    description: 'Client ID from service token for automated device enrollment without user interaction.',
    type: 'string',
    placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.access',
    category: 'authentication',
  },
  {
    key: 'auth_client_secret',
    label: 'Auth Client Secret',
    description: 'Client secret from service token (required with auth_client_id).',
    type: 'string',
    placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    category: 'authentication',
  },
  {
    key: 'gateway_unique_id',
    label: 'Gateway Unique ID',
    description: 'DoH subdomain directing DNS queries to specific Gateway location. Only needed for DNS-only deployments or multiple DNS locations.',
    type: 'string',
    placeholder: 'xxxxxxxxxxxxxx',
    category: 'authentication',
  },

  // Client Behavior
  {
    key: 'switch_locked',
    label: 'Switch Locked',
    description: 'When enabled, prevents users from turning off WARP and starts client in connected state.',
    type: 'boolean',
    category: 'behavior',
  },
  {
    key: 'onboarding',
    label: 'Show Onboarding',
    description: 'When disabled, skips onboarding screens and privacy policy during first launch.',
    type: 'boolean',
    category: 'behavior',
  },
  {
    key: 'support_url',
    label: 'Support URL',
    description: 'URL or mailto link for the "Send Feedback" button in WARP client.',
    type: 'string',
    placeholder: 'https://support.example.com or mailto:it@example.com',
    category: 'behavior',
  },

  // Advanced Network
  {
    key: 'override_api_endpoint',
    label: 'Override API Endpoint',
    description: 'IPv4 or IPv6 address to redirect client API calls (for Cloudflare China partners).',
    type: 'string',
    placeholder: '1.2.3.4',
    category: 'network',
  },
  {
    key: 'override_doh_endpoint',
    label: 'Override DoH Endpoint',
    description: 'IPv4 or IPv6 address to redirect DNS over HTTPS lookups (Gateway with DoH mode only).',
    type: 'string',
    placeholder: '1.2.3.4',
    category: 'network',
  },
  {
    key: 'override_warp_endpoint',
    label: 'Override WARP Endpoint',
    description: 'Socket address (IPv4:port or IPv6:port) to redirect WARP tunnel traffic.',
    type: 'string',
    placeholder: '203.0.113.0:500',
    category: 'network',
  },
  {
    key: 'enable_post_quantum',
    label: 'Enable Post-Quantum Cryptography',
    description: 'Use post-quantum cryptography to secure connections. Requires WARP 2025.5.735.1+ (desktop) or 1.10+ (iOS) or 2.4+ (Android).',
    type: 'boolean',
    platforms: ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'ChromeOS'],
    category: 'network',
  },
  {
    key: 'proxy_port',
    label: 'Proxy Port',
    description: 'SOCKS proxy port (0-65535). Required when service_mode is "proxy".',
    type: 'number',
    min: 0,
    max: 65535,
    placeholder: '1080',
    category: 'network',
  },

  // Device Identity
  {
    key: 'unique_client_id',
    label: 'Unique Client ID',
    description: 'Device UUID in standard format for device posture checks. iOS and Android only.',
    type: 'string',
    placeholder: '496c6124-db89-4735-bc4e-7f759109a6f1',
    platforms: ['iOS', 'Android', 'ChromeOS'],
    category: 'identity',
  },
];

/**
 * Global (top-level) parameters
 */
export const GLOBAL_PARAMETERS: ParameterMetadata[] = [
  {
    key: 'multi_user',
    label: 'Multi-User Support',
    description: 'Enable multiple user registrations on Windows devices. Each Windows user maintains a separate WARP registration.',
    type: 'boolean',
    platforms: ['Windows'],
    category: 'global',
  },
  {
    key: 'pre_login',
    label: 'Pre-Login Support',
    description: 'Allow WARP to connect with a service token before user completes Windows login.',
    type: 'boolean',
    platforms: ['Windows'],
    category: 'global',
  },
];

/**
 * Platform-specific file paths for mdm.xml
 */
export const PLATFORM_PATHS = {
  windows: 'C:\\ProgramData\\Cloudflare\\mdm.xml',
  macos: '/Library/Application Support/Cloudflare/mdm.xml',
  linux: '/var/lib/cloudflare-warp/mdm.xml',
};

/**
 * Service mode descriptions
 */
export const SERVICE_MODE_INFO = {
  warp: 'Full Gateway with WARP tunnel - routes all traffic through Cloudflare Gateway (recommended)',
  '1dot1': 'Gateway with DoH - enforces DNS policies only using DNS over HTTPS',
  proxy: 'Proxy mode - uses SOCKS5 proxy for traffic routing',
  postureonly: 'Device Information Only - collects device posture without routing traffic',
};

/**
 * Validation rules for specific parameters
 */
export const VALIDATION_RULES = {
  organization: {
    pattern: /^[a-zA-Z0-9-_]+$/,
    message: 'Organization name should contain only letters, numbers, hyphens, and underscores',
  },
  gateway_unique_id: {
    pattern: /^[a-z0-9]+$/,
    message: 'Gateway Unique ID should contain only lowercase letters and numbers',
  },
  unique_client_id: {
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    message: 'Must be a valid UUID format (e.g., 496c6124-db89-4735-bc4e-7f759109a6f1)',
  },
  support_url: {
    pattern: /^(https?:\/\/.+|mailto:.+)$/,
    message: 'Must be a valid URL (https://...) or mailto link (mailto:...)',
  },
  override_api_endpoint: {
    pattern: /^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-f]{0,4}:){7}[0-9a-f]{0,4}$/i,
    message: 'Must be a valid IPv4 or IPv6 address',
  },
  override_doh_endpoint: {
    pattern: /^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-f]{0,4}:){7}[0-9a-f]{0,4}$/i,
    message: 'Must be a valid IPv4 or IPv6 address',
  },
  override_warp_endpoint: {
    pattern: /^(\d{1,3}\.){3}\d{1,3}:\d+$|^\[([0-9a-f]{0,4}:){7}[0-9a-f]{0,4}\]:\d+$/i,
    message: 'Must be a valid IPv4:port or [IPv6]:port address',
  },
};
