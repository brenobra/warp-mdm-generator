/**
 * XML Generator for Apple plist-style MDM configuration
 * Generates WARP MDM XML files from configuration objects
 */

import type { MDMConfig, OrganizationConfig, AndroidAppConfig } from './types';

/**
 * Escapes special XML characters in strings
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Serializes a value to plist XML format
 */
function serializeValue(value: unknown, indent: number = 1): string {
  const spaces = '  '.repeat(indent);

  if (typeof value === 'string') {
    return `${spaces}<string>${escapeXml(value)}</string>`;
  }

  if (typeof value === 'number') {
    return `${spaces}<integer>${value}</integer>`;
  }

  if (typeof value === 'boolean') {
    return value ? `${spaces}<true/>` : `${spaces}<false/>`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${spaces}<array/>`;
    }

    const items = value
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return serializeDict(item as Record<string, unknown>, indent + 1);
        }
        return serializeValue(item, indent + 1);
      })
      .join('\n');

    return `${spaces}<array>\n${items}\n${spaces}</array>`;
  }

  if (typeof value === 'object' && value !== null) {
    return serializeDict(value as Record<string, unknown>, indent);
  }

  return '';
}

/**
 * Serializes a dictionary object to plist XML format
 */
function serializeDict(obj: Record<string, unknown>, indent: number = 1): string {
  const spaces = '  '.repeat(indent);
  const entries = Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const keyLine = `${spaces}<key>${escapeXml(key)}</key>`;
      const valueLine = serializeValue(value, indent);
      return `${keyLine}\n${valueLine}`;
    })
    .join('\n');

  return `${spaces}<dict>\n${entries}\n${spaces}</dict>`;
}

/**
 * Cleans organization config by removing empty/undefined values
 */
function cleanOrgConfig(config: OrganizationConfig): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  // Always include required fields
  if (config.organization) {
    cleaned.organization = config.organization;
  }

  // Include display_name if present (required for multi-org)
  if (config.display_name) {
    cleaned.display_name = config.display_name;
  }

  // Include all other fields if they have values
  if (config.auth_client_id) cleaned.auth_client_id = config.auth_client_id;
  if (config.auth_client_secret) cleaned.auth_client_secret = config.auth_client_secret;
  if (config.gateway_unique_id) cleaned.gateway_unique_id = config.gateway_unique_id;

  if (config.auto_connect !== undefined && config.auto_connect !== null) {
    cleaned.auto_connect = config.auto_connect;
  }

  if (config.onboarding !== undefined && config.onboarding !== null) {
    cleaned.onboarding = config.onboarding;
  }

  if (config.switch_locked !== undefined && config.switch_locked !== null) {
    cleaned.switch_locked = config.switch_locked;
  }

  if (config.support_url) cleaned.support_url = config.support_url;
  if (config.service_mode) cleaned.service_mode = config.service_mode;

  if (config.proxy_port !== undefined && config.proxy_port !== null) {
    cleaned.proxy_port = config.proxy_port;
  }

  if (config.override_api_endpoint) cleaned.override_api_endpoint = config.override_api_endpoint;
  if (config.override_doh_endpoint) cleaned.override_doh_endpoint = config.override_doh_endpoint;
  if (config.override_warp_endpoint) cleaned.override_warp_endpoint = config.override_warp_endpoint;

  if (config.enable_post_quantum !== undefined && config.enable_post_quantum !== null) {
    cleaned.enable_post_quantum = config.enable_post_quantum;
  }

  if (config.unique_client_id) cleaned.unique_client_id = config.unique_client_id;

  return cleaned;
}

/**
 * Cleans Android app config by removing empty values
 */
function cleanAndroidConfig(apps: AndroidAppConfig[]): Record<string, unknown>[] {
  return apps
    .filter(app => app.app_identifier)
    .map(app => {
      const cleaned: Record<string, unknown> = {
        app_identifier: app.app_identifier,
      };
      if (app.is_browser !== undefined && app.is_browser !== null) {
        cleaned.is_browser = app.is_browser;
      }
      return cleaned;
    });
}

/**
 * Generates MDM XML from configuration
 */
export function generateMDMXml(config: MDMConfig): string {
  const rootDict: Record<string, unknown> = {};

  // Determine if we're in multi-org mode
  const isMultiOrg = config.configs && config.configs.length > 1;
  const hasSingleOrgInConfigs = config.configs && config.configs.length === 1;

  // Add global settings
  if (config.multi_user !== undefined && config.multi_user !== null) {
    rootDict.multi_user = config.multi_user;
  }

  if (config.pre_login !== undefined && config.pre_login !== null) {
    rootDict.pre_login = config.pre_login;
  }

  // Handle organization configurations
  if (isMultiOrg) {
    // Multi-org mode: use configs array
    rootDict.configs = config.configs!.map(cleanOrgConfig);
  } else if (hasSingleOrgInConfigs) {
    // Single org in configs: flatten it to root level
    const singleOrg = config.configs![0]!;
    Object.assign(rootDict, cleanOrgConfig(singleOrg));
  } else {
    // Simple mode: use root-level org parameters
    const orgConfig = cleanOrgConfig({
      organization: config.organization || '',
      display_name: config.display_name,
      auth_client_id: config.auth_client_id,
      auth_client_secret: config.auth_client_secret,
      gateway_unique_id: config.gateway_unique_id,
      auto_connect: config.auto_connect,
      onboarding: config.onboarding,
      switch_locked: config.switch_locked,
      support_url: config.support_url,
      service_mode: config.service_mode,
      proxy_port: config.proxy_port,
      override_api_endpoint: config.override_api_endpoint,
      override_doh_endpoint: config.override_doh_endpoint,
      override_warp_endpoint: config.override_warp_endpoint,
      enable_post_quantum: config.enable_post_quantum,
      unique_client_id: config.unique_client_id,
    });
    Object.assign(rootDict, orgConfig);
  }

  // Add Android per-app VPN configuration
  if (config.android_apps && config.android_apps.length > 0) {
    const cleanedApps = cleanAndroidConfig(config.android_apps);
    if (cleanedApps.length > 0) {
      rootDict.android_apps = cleanedApps;
    }
  }

  // Generate XML
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const xmlBody = serializeDict(rootDict, 0);

  return xmlHeader + xmlBody;
}

/**
 * Creates a default empty organization configuration
 */
export function createDefaultOrganization(): OrganizationConfig {
  return {
    organization: '',
    auto_connect: 0,
    service_mode: 'warp',
  };
}

/**
 * Creates a default Android app configuration
 */
export function createDefaultAndroidApp(): AndroidAppConfig {
  return {
    app_identifier: '',
    is_browser: false,
  };
}
