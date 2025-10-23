/**
 * Validation logic for WARP MDM parameters
 */

import type { MDMConfig, OrganizationConfig, ValidationResult } from './types';
import { VALIDATION_RULES } from './constants';

/**
 * Validates a single field value against its rules
 */
function validateField(
  key: string,
  value: unknown
): { valid: boolean; message?: string } {
  // Skip validation for empty values (they're optional unless marked required)
  if (value === undefined || value === null || value === '') {
    return { valid: true };
  }

  const rule = VALIDATION_RULES[key as keyof typeof VALIDATION_RULES];
  if (!rule) {
    return { valid: true };
  }

  // Validate string patterns
  if (typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      return { valid: false, message: rule.message };
    }
  }

  return { valid: true };
}

/**
 * Validates an organization configuration
 */
function validateOrganization(
  org: OrganizationConfig,
  index: number,
  isMultiOrg: boolean
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prefix = isMultiOrg ? `Organization #${index + 1}` : 'Configuration';

  // Required field: organization
  if (!org.organization || org.organization.trim() === '') {
    errors.push(`${prefix}: Organization name is required`);
  } else {
    const validation = validateField('organization', org.organization);
    if (!validation.valid) {
      errors.push(`${prefix}: ${validation.message}`);
    }
  }

  // Multi-org requires display_name
  if (isMultiOrg && (!org.display_name || org.display_name.trim() === '')) {
    errors.push(`${prefix}: Display name is required for multi-organization setups`);
  }

  // Validate auth_client_id and auth_client_secret pairing
  if (org.auth_client_id && !org.auth_client_secret) {
    warnings.push(`${prefix}: auth_client_secret should be provided when auth_client_id is set`);
  }
  if (org.auth_client_secret && !org.auth_client_id) {
    warnings.push(`${prefix}: auth_client_id should be provided when auth_client_secret is set`);
  }

  // Validate gateway_unique_id
  if (org.gateway_unique_id) {
    const validation = validateField('gateway_unique_id', org.gateway_unique_id);
    if (!validation.valid) {
      errors.push(`${prefix}: ${validation.message}`);
    }
  }

  // Validate auto_connect range
  if (org.auto_connect !== undefined && org.auto_connect !== null) {
    if (org.auto_connect < 0 || org.auto_connect > 1440) {
      errors.push(`${prefix}: auto_connect must be between 0 and 1440 minutes`);
    }
  } else {
    warnings.push(`${prefix}: auto_connect is recommended (use 0 for indefinite reconnection)`);
  }

  // Validate switch_locked requires auto_connect
  if (org.switch_locked && (org.auto_connect === undefined || org.auto_connect === null)) {
    warnings.push(`${prefix}: switch_locked should be used with auto_connect parameter`);
  }

  // Validate proxy_port when service_mode is proxy
  if (org.service_mode === 'proxy') {
    if (org.proxy_port === undefined || org.proxy_port === null) {
      errors.push(`${prefix}: proxy_port is required when service_mode is "proxy"`);
    } else if (org.proxy_port < 0 || org.proxy_port > 65535) {
      errors.push(`${prefix}: proxy_port must be between 0 and 65535`);
    }
  }

  // Validate support_url
  if (org.support_url) {
    const validation = validateField('support_url', org.support_url);
    if (!validation.valid) {
      errors.push(`${prefix}: ${validation.message}`);
    }
  }

  // Validate override endpoints
  if (org.override_api_endpoint) {
    const validation = validateField('override_api_endpoint', org.override_api_endpoint);
    if (!validation.valid) {
      errors.push(`${prefix}: ${validation.message}`);
    }
  }

  if (org.override_doh_endpoint) {
    const validation = validateField('override_doh_endpoint', org.override_doh_endpoint);
    if (!validation.valid) {
      errors.push(`${prefix}: ${validation.message}`);
    }
  }

  if (org.override_warp_endpoint) {
    const validation = validateField('override_warp_endpoint', org.override_warp_endpoint);
    if (!validation.valid) {
      errors.push(`${prefix}: ${validation.message}`);
    }
  }

  // Validate unique_client_id (UUID format)
  if (org.unique_client_id) {
    const validation = validateField('unique_client_id', org.unique_client_id);
    if (!validation.valid) {
      errors.push(`${prefix}: ${validation.message}`);
    }
  }

  return { errors, warnings };
}

/**
 * Validates the complete MDM configuration
 */
export function validateMDMConfig(config: MDMConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Determine configuration mode
  const hasConfigs = config.configs && config.configs.length > 0;
  const isMultiOrg = hasConfigs && config.configs!.length > 1;

  if (hasConfigs) {
    // Validate each organization in configs array
    config.configs!.forEach((org, index) => {
      const result = validateOrganization(org, index, isMultiOrg);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    });
  } else {
    // Validate root-level organization parameters
    const singleOrg: OrganizationConfig = {
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
    };

    const result = validateOrganization(singleOrg, 0, false);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  // Validate Android apps
  if (config.android_apps && config.android_apps.length > 0) {
    config.android_apps.forEach((app, index) => {
      if (!app.app_identifier || app.app_identifier.trim() === '') {
        errors.push(`Android App #${index + 1}: app_identifier is required`);
      }
    });
  }

  // Global validation: check if any organization is configured
  const hasOrgConfig = hasConfigs
    ? config.configs!.some((org) => org.organization)
    : !!config.organization;

  if (!hasOrgConfig) {
    errors.push('At least one organization must be configured');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a single field in real-time (for form inputs)
 */
export function validateFieldRealtime(
  key: string,
  value: unknown
): { valid: boolean; message?: string } {
  return validateField(key, value);
}
