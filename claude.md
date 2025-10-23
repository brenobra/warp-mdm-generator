# WARP MDM Generator - Development Notes

## Project Overview
A browser-based tool to generate Cloudflare WARP `mdm.xml` configuration files with support for all 20 documented parameters and multi-organization setups.

**Deployment:** mdm.cflab.one
**Repository:** GitHub (open source)
**Tech Stack:** Cloudflare Workers + Preact + TypeScript + Tailwind CSS

---

## WARP MDM Parameters (20 Total)

### Organization-Level Parameters (15)
These can be set per-organization in multi-org setups.

#### Essential Configuration (4)
- `organization` (string, required) - Team name for Zero Trust
- `auto_connect` (integer, 0-1440) - Minutes before auto-reconnect
- `service_mode` (enum) - warp | 1dot1 | proxy | postureonly
- `display_name` (string) - Org name in GUI (required for multi-org)

#### Authentication (3)
- `auth_client_id` (string) - Service token client ID
- `auth_client_secret` (string) - Service token secret
- `gateway_unique_id` (string) - DoH subdomain

#### Client Behavior (3)
- `switch_locked` (boolean) - Prevent users from disconnecting
- `onboarding` (boolean) - Show/hide onboarding screens
- `support_url` (string) - URL for feedback button

#### Advanced Network (5)
- `override_api_endpoint` (string) - IPv4/IPv6 for API calls
- `override_doh_endpoint` (string) - IPv4/IPv6 for DoH
- `override_warp_endpoint` (string) - IP:port for WARP tunnel
- `enable_post_quantum` (boolean) - Post-quantum cryptography
- `proxy_port` (integer, 0-65535) - SOCKS proxy port

#### Device Identity (1)
- `unique_client_id` (string, UUID) - Device UUID for posture checks (mobile only)

### Global Parameters (3)
Top-level settings that apply to entire MDM config.

- `multi_user` (boolean) - Multiple users on Windows
- `pre_login` (boolean) - Connect before Windows login
- `configs` (array) - Array of OrganizationConfig objects

### Android Parameters (2)
Per-app VPN configuration (separate section).

- `app_identifier` (string) - Android package name
- `is_browser` (boolean) - Mark app as browser

---

## XML Structure

### Single Organization Mode
```xml
<dict>
  <key>organization</key>
  <string>mycompany</string>
  <key>auto_connect</key>
  <integer>0</integer>
  <!-- other params -->
</dict>
```

### Multi-Organization Mode
```xml
<dict>
  <key>multi_user</key>
  <true/>
  <key>configs</key>
  <array>
    <dict>
      <key>display_name</key>
      <string>Production</string>
      <key>organization</key>
      <string>mycompany-prod</string>
      <!-- other params -->
    </dict>
    <dict>
      <key>display_name</key>
      <string>Staging</string>
      <key>organization</key>
      <string>mycompany-staging</string>
      <!-- other params -->
    </dict>
  </array>
</dict>
```

---

## Platform File Paths

- **Windows:** `C:\ProgramData\Cloudflare\mdm.xml`
- **macOS:** `/Library/Application Support/Cloudflare/mdm.xml`
- **Linux:** `/var/lib/cloudflare-warp/mdm.xml`

---

## Implementation Progress

### ✅ Phase 1: Project Foundation (COMPLETED)
- [x] Initialized Cloudflare Worker project with Vite + Preact + TypeScript
- [x] Configured Tailwind CSS and project dependencies
- [x] Created TypeScript interfaces for all 20 WARP parameters
- [x] Built parameter metadata system with descriptions and validation rules
- [x] Created claude.md tracking file

### ✅ Phase 2: XML Generation Engine (COMPLETED)
- [x] Implement Apple plist XML serializer
- [x] Add validation logic with real-time feedback
- [x] Test XML generation

### ✅ Phase 3: UI Components (COMPLETED)
- [x] Main layout with Cloudflare-inspired design
- [x] Header component with dark mode toggle
- [x] Organization cards with collapsible sections
- [x] Parameter inputs with validation and tooltips
- [x] Global settings component (multi_user, pre_login)
- [x] Reusable ParameterInput component

### ✅ Phase 4: Preview & Export (COMPLETED)
- [x] XML preview with syntax highlighting
- [x] Copy to clipboard functionality
- [x] Download mdm.xml button
- [x] Platform-specific file path display
- [x] Real-time validation with errors/warnings

### ✅ Phase 5: Polish & Dark Mode (COMPLETED)
- [x] Cloudflare-inspired color scheme (orange/blue gradient)
- [x] Dark mode with user preference toggle
- [x] Responsive design for mobile/tablet/desktop
- [x] Smooth animations and transitions
- [x] Accessible components with keyboard navigation

### 🔄 Phase 6: Documentation & Deployment (IN PROGRESS)
- [x] Comprehensive README.md with all features
- [x] Build tested and working (1595 modules, 113KB JS)
- [x] Dev server running successfully (http://localhost:5173)
- [ ] Configure wrangler.toml for custom domain
- [ ] Deploy to mdm.cflab.one
- [ ] Production testing
- [ ] GitHub repository setup with LICENSE

---

## Design Decisions

### Multi-Org UX
- Start with 1 organization by default (simpler UX)
- Card-based interface for each organization
- Collapsible sections for parameter categories
- Add/remove orgs dynamically
- Smart mode switching:
  - 1 org = simple mode (flat structure, no configs array)
  - 2+ orgs = multi mode (configs array, requires display_name)

### Dark Mode
- Respects user system preference
- Manual toggle available
- Persisted to localStorage

### Validation
- Real-time validation as user types
- Error messages for invalid input
- Warnings for recommended but optional fields
- Pattern validation for URLs, IPs, UUIDs, etc.

---

## Technical Notes

### Type Safety
All 20 parameters have full TypeScript definitions with:
- Proper types (string, number, boolean, enum)
- Optional vs required marking
- Platform-specific annotations
- Validation patterns

### Dependencies
- **preact** - 3KB React-compatible UI library
- **@preact/signals** - Reactive state management
- **@radix-ui/** - Accessible UI primitives (collapsible, tooltip, select, switch)
- **lucide-preact** - Icon library
- **shiki** - Syntax highlighting for XML preview
- **tailwindcss** - Utility-first CSS
- **vite** - Fast build tool

### Cloudflare Workers Static Assets
Using the new static assets feature (no Pages needed):
- `worker.js` serves files from `dist/`
- SPA routing for non-asset requests
- Fast global edge deployment

---

## Next Steps

1. ✅ Complete XML serializer
2. ✅ Implement validation
3. ✅ Build UI components
4. ✅ Add preview and export
5. ✅ Apply styling and dark mode
6. 🔄 Deploy to mdm.cflab.one
7. ⏳ Create GitHub repository
8. ⏳ Production testing

## Build Stats

**Production Build:**
- HTML: 0.60 kB (gzip: 0.36 kB)
- CSS: 23.65 kB (gzip: 4.74 kB)
- JS: 112.94 kB (gzip: 38.67 kB)
- Total: ~137 KB (~44 KB gzipped)
- Modules: 1,595 transformed
- Build time: 1.12s

**Dev Server:**
- Running at: http://localhost:5173/
- Startup time: 551ms

---

## Resources

- [Cloudflare WARP MDM Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/)
- [Parameters Reference](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/parameters/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
