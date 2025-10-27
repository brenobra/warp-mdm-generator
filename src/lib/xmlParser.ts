import type { MDMConfig, OrganizationConfig, ServiceMode } from './types';

export interface ImportResult {
  config: MDMConfig;
  warnings: string[];
}

// Valid parameter names we recognize
const VALID_GLOBAL_PARAMS = ['multi_user', 'pre_login'];
const VALID_ORG_PARAMS = [
  'organization',
  'display_name',
  'auth_client_id',
  'auth_client_secret',
  'gateway_unique_id',
  'auto_connect',
  'onboarding',
  'switch_locked',
  'support_url',
  'service_mode',
  'proxy_port',
  'override_api_endpoint',
  'override_doh_endpoint',
  'override_warp_endpoint',
  'enable_post_quantum',
  'unique_client_id',
  'app_identifier',
  'is_browser',
];

export function parseXmlToConfig(xmlString: string): ImportResult {
  const warnings: string[] = [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Check for XML parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format. Please ensure the file is a valid Apple plist.');
  }

  // Find the root dict element
  const plist = xmlDoc.querySelector('plist');
  if (!plist) {
    throw new Error('Not a valid plist file. Missing <plist> root element.');
  }

  const rootDict = plist.querySelector('dict');
  if (!rootDict) {
    throw new Error('Not a valid plist file. Missing <dict> element.');
  }

  const config: MDMConfig = {};
  const rootData = parseDictElement(rootDict);

  // Check if this is multi-org format (has configs array)
  if (rootData.configs && Array.isArray(rootData.configs)) {
    // Multi-org format
    config.configs = [];

    for (const orgData of rootData.configs) {
      const org = parseOrganizationData(orgData, warnings);
      if (org.organization) {
        config.configs.push(org);
      }
    }

    // Extract global params
    if (rootData.multi_user !== undefined) {
      config.multi_user = rootData.multi_user as boolean;
    }
    if (rootData.pre_login !== undefined) {
      config.pre_login = rootData.pre_login as boolean;
    }

    // Warn about any unknown root-level params
    Object.keys(rootData).forEach((key) => {
      if (key !== 'configs' && !VALID_GLOBAL_PARAMS.includes(key)) {
        warnings.push(`Unknown parameter '${key}' at root level was skipped`);
      }
    });
  } else {
    // Single-org format (flat structure)
    // Check if there's at least one org-level param to create an org
    const hasOrgParams = Object.keys(rootData).some((key) =>
      VALID_ORG_PARAMS.includes(key)
    );

    if (hasOrgParams) {
      const org = parseOrganizationData(rootData, warnings);
      config.configs = [org];
    }

    // Extract global params from root
    if (rootData.multi_user !== undefined) {
      config.multi_user = rootData.multi_user as boolean;
    }
    if (rootData.pre_login !== undefined) {
      config.pre_login = rootData.pre_login as boolean;
    }

    // Warn about unknown params
    Object.keys(rootData).forEach((key) => {
      if (
        !VALID_GLOBAL_PARAMS.includes(key) &&
        !VALID_ORG_PARAMS.includes(key)
      ) {
        warnings.push(`Unknown parameter '${key}' was skipped`);
      }
    });
  }

  return { config, warnings };
}

function parseDictElement(dictElement: Element): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const children = Array.from(dictElement.children);

  for (let i = 0; i < children.length; i += 2) {
    const keyElement = children[i];
    const valueElement = children[i + 1];

    if (keyElement.tagName !== 'key' || !valueElement) {
      continue;
    }

    const key = keyElement.textContent || '';
    const value = parseValueElement(valueElement);
    result[key] = value;
  }

  return result;
}

function parseValueElement(element: Element): unknown {
  switch (element.tagName) {
    case 'string':
      return element.textContent || '';
    case 'integer':
      return parseInt(element.textContent || '0', 10);
    case 'true':
      return true;
    case 'false':
      return false;
    case 'array':
      return Array.from(element.children).map(parseValueElement);
    case 'dict':
      return parseDictElement(element);
    default:
      return null;
  }
}

function parseOrganizationData(
  data: Record<string, unknown>,
  warnings: string[]
): OrganizationConfig {
  const org: OrganizationConfig = {
    organization: '',
  };

  // Required field
  if (typeof data.organization === 'string') {
    org.organization = data.organization;
  } else {
    warnings.push('Missing or invalid required field: organization');
  }

  // Optional string fields
  if (data.display_name !== undefined) {
    org.display_name = String(data.display_name);
  }
  if (data.auth_client_id !== undefined) {
    org.auth_client_id = String(data.auth_client_id);
  }
  if (data.auth_client_secret !== undefined) {
    org.auth_client_secret = String(data.auth_client_secret);
  }
  if (data.gateway_unique_id !== undefined) {
    const uuid = String(data.gateway_unique_id);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
      warnings.push(`Invalid UUID format for 'gateway_unique_id': ${uuid}`);
    }
    org.gateway_unique_id = uuid;
  }
  if (data.support_url !== undefined) {
    org.support_url = String(data.support_url);
  }
  if (data.override_api_endpoint !== undefined) {
    org.override_api_endpoint = String(data.override_api_endpoint);
  }
  if (data.override_doh_endpoint !== undefined) {
    org.override_doh_endpoint = String(data.override_doh_endpoint);
  }
  if (data.override_warp_endpoint !== undefined) {
    org.override_warp_endpoint = String(data.override_warp_endpoint);
  }
  if (data.unique_client_id !== undefined) {
    org.unique_client_id = String(data.unique_client_id);
  }
  if (data.app_identifier !== undefined) {
    org.app_identifier = String(data.app_identifier);
  }

  // Number fields
  if (data.auto_connect !== undefined) {
    const val = Number(data.auto_connect);
    if (val < 0 || val > 1440) {
      warnings.push(`Invalid value for 'auto_connect': ${val} (must be 0-1440 minutes)`);
    } else {
      org.auto_connect = val;
    }
  }
  if (data.proxy_port !== undefined) {
    org.proxy_port = Number(data.proxy_port);
  }

  // Boolean fields
  if (data.onboarding !== undefined) {
    org.onboarding = Boolean(data.onboarding);
  }
  if (data.switch_locked !== undefined) {
    org.switch_locked = Boolean(data.switch_locked);
  }
  if (data.enable_post_quantum !== undefined) {
    org.enable_post_quantum = Boolean(data.enable_post_quantum);
  }
  if (data.is_browser !== undefined) {
    org.is_browser = Boolean(data.is_browser);
  }

  // Service mode enum
  if (data.service_mode !== undefined) {
    const mode = String(data.service_mode);
    if (['warp', '1dot1', 'proxy', 'postureonly'].includes(mode)) {
      org.service_mode = mode as ServiceMode;
    } else {
      warnings.push(`Invalid value for 'service_mode': ${mode}`);
    }
  }

  return org;
}
