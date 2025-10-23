/**
 * TypeScript type definitions for Cloudflare WARP MDM parameters
 * Based on official Cloudflare documentation
 */

/**
 * Service mode options for WARP client
 */
export type ServiceMode = 'warp' | '1dot1' | 'proxy' | 'postureonly';

/**
 * Android per-app VPN configuration
 */
export interface AndroidAppConfig {
  /** Package name from Google Play Store URL */
  app_identifier: string;
  /** Whether this app is a browser (for re-authentication and block notifications) */
  is_browser?: boolean;
}

/**
 * Organization configuration parameters
 * These parameters are set per-organization when using multi-org setup
 */
export interface OrganizationConfig {
  /** Team name - instructs client to register device with your organization */
  organization: string;

  /** Display name for organization (required when in configs array) */
  display_name?: string;

  // Authentication parameters
  /** Client ID from service token for device enrollment */
  auth_client_id?: string;
  /** Client secret from service token for device enrollment */
  auth_client_secret?: string;
  /** DoH subdomain for Gateway DNS location */
  gateway_unique_id?: string;

  // Client behavior parameters
  /** Minutes before auto-reconnect (0 = indefinite, 1-1440 = minutes) */
  auto_connect?: number;
  /** Controls visibility of onboarding/privacy policy screens */
  onboarding?: boolean;
  /** Prevents users from disconnecting WARP */
  switch_locked?: boolean;
  /** URL for user support/feedback button */
  support_url?: string;

  // Service configuration
  /** Operational mode of the client */
  service_mode?: ServiceMode;
  /** SOCKS proxy port (required when service_mode is 'proxy') */
  proxy_port?: number;

  // Network override parameters
  /** IPv4/IPv6 address to redirect API calls */
  override_api_endpoint?: string;
  /** IPv4/IPv6 address to redirect DoH lookups */
  override_doh_endpoint?: string;
  /** IPv4:port or IPv6:port socket address for WARP tunnel */
  override_warp_endpoint?: string;

  // Security parameters
  /** Enable post-quantum cryptography */
  enable_post_quantum?: boolean;

  // Device identity (mobile only)
  /** Device UUID for posture checks (iOS/Android only) */
  unique_client_id?: string;
}

/**
 * Top-level MDM configuration
 * Contains global settings and organization configurations
 */
export interface MDMConfig {
  /** Global: Enable multiple user registrations on Windows */
  multi_user?: boolean;

  /** Global: Enable WARP connection before Windows login */
  pre_login?: boolean;

  /** Array of organization configurations (for multi-org support) */
  configs?: OrganizationConfig[];

  /** Single organization configuration (for simple single-org setup) */
  organization?: string;
  auth_client_id?: string;
  auth_client_secret?: string;
  gateway_unique_id?: string;
  auto_connect?: number;
  onboarding?: boolean;
  switch_locked?: boolean;
  support_url?: string;
  service_mode?: ServiceMode;
  proxy_port?: number;
  override_api_endpoint?: string;
  override_doh_endpoint?: string;
  override_warp_endpoint?: string;
  enable_post_quantum?: boolean;
  unique_client_id?: string;
  display_name?: string;

  /** Android per-app VPN configurations */
  android_apps?: AndroidAppConfig[];
}

/**
 * Parameter metadata for UI generation
 */
export interface ParameterMetadata {
  /** Parameter key name */
  key: keyof OrganizationConfig | keyof MDMConfig;
  /** Human-readable label */
  label: string;
  /** Detailed description */
  description: string;
  /** Input type */
  type: 'string' | 'number' | 'boolean' | 'select';
  /** Options for select type */
  options?: Array<{ value: string; label: string }>;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum value for number type */
  min?: number;
  /** Maximum value for number type */
  max?: number;
  /** Whether this parameter is required */
  required?: boolean;
  /** Platform support */
  platforms?: string[];
  /** Category for grouping */
  category: 'essential' | 'authentication' | 'behavior' | 'network' | 'identity' | 'global' | 'android';
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
