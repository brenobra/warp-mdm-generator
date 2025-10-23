# WARP MDM Configuration Generator

A browser-based tool to generate Cloudflare WARP `mdm.xml` configuration files with support for all 20 documented parameters and multi-organization setups.

🌐 **Live Tool:** [mdm.cflab.one](https://mdm.cflab.one)
📦 **GitHub:** [github.com/brenobra/warp-mdm-generator](https://github.com/brenobra/warp-mdm-generator)

## Features

- ✅ **All 20 WARP MDM Parameters** - Complete support for every documented configuration option
- 🏢 **Multi-Organization Support** - Configure multiple Zero Trust organizations in a single file
- 🎨 **Beautiful UI** - Cloudflare-inspired design with dark mode
- ✨ **Real-time Validation** - Instant feedback on configuration errors
- 📋 **Copy & Download** - Easy export of generated XML files
- 🔍 **Syntax Highlighting** - Color-coded XML preview
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## WARP MDM Parameters Supported

### Organization-Level Parameters (15)

**Essential Configuration:**
- `organization` - Team name for Zero Trust
- `auto_connect` - Minutes before auto-reconnect (0-1440)
- `service_mode` - Operational mode (warp, 1dot1, proxy, postureonly)
- `display_name` - Organization name in GUI

**Authentication:**
- `auth_client_id` - Service token client ID
- `auth_client_secret` - Service token secret
- `gateway_unique_id` - DoH subdomain

**Client Behavior:**
- `switch_locked` - Prevent disconnection
- `onboarding` - Show/hide onboarding screens
- `support_url` - Support/feedback URL

**Advanced Network:**
- `override_api_endpoint` - Custom API endpoint
- `override_doh_endpoint` - Custom DoH endpoint
- `override_warp_endpoint` - Custom WARP endpoint
- `enable_post_quantum` - Post-quantum cryptography
- `proxy_port` - SOCKS proxy port

**Device Identity:**
- `unique_client_id` - Device UUID (mobile only)

### Global Parameters (3)
- `multi_user` - Multiple users on Windows
- `pre_login` - Connect before Windows login
- `configs` - Array of organization configurations

### Android Parameters (2)
- `app_identifier` - Android package name
- `is_browser` - Mark as browser app

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/brenobra/warp-mdm-generator.git
cd warp-mdm-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Deployment

### Deploy to Cloudflare Workers

```bash
# Login to Cloudflare
npx wrangler login

# Deploy
npm run build
npx wrangler pages deploy dist
```

### Deploy to Cloudflare Workers (with static assets)

```bash
# Update wrangler.toml with your account details
# Then run:
npx wrangler deploy
```

## Usage

### Basic Setup (Single Organization)

1. Open the generator in your browser
2. Fill in the **Essential Configuration** section:
   - Organization: Your team name (e.g., `mycompany`)
   - Auto Connect: `0` (recommended for new deployments)
   - Service Mode: `warp` (default)
3. (Optional) Configure additional parameters in collapsible sections
4. Click **Download** to save `mdm.xml`

### Multi-Organization Setup

1. Click **Add Another Organization** to add multiple orgs
2. Each organization requires a **Display Name**
3. Configure each organization independently
4. Download the generated `mdm.xml` file

### Android Per-App VPN

1. Expand the **Android Per-App VPN** section
2. Add app package names from Google Play Store
3. Mark browsers if needed for re-authentication

## File Locations

Save the generated `mdm.xml` file to:

**Windows:**
```
C:\ProgramData\Cloudflare\mdm.xml
```

**macOS:**
```
/Library/Application Support/Cloudflare/mdm.xml
```

**Linux:**
```
/var/lib/cloudflare-warp/mdm.xml
```

## Tech Stack

- **Runtime:** Cloudflare Workers with Static Assets
- **Framework:** Preact (3KB React alternative)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI primitives
- **Icons:** Lucide Preact
- **State:** Preact Signals

## Project Structure

```
warp-mdm-generator/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Header with dark mode
│   │   ├── GlobalSettings.tsx      # Global MDM settings
│   │   ├── OrganizationCard.tsx    # Org configuration card
│   │   ├── ParameterInput.tsx      # Reusable input component
│   │   └── XmlPreview.tsx          # XML preview & export
│   ├── lib/
│   │   ├── types.ts                # TypeScript definitions
│   │   ├── constants.ts            # Parameter metadata
│   │   ├── xmlGenerator.ts         # XML serialization
│   │   └── validation.ts           # Validation logic
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
│   └── favicon.svg                 # App icon
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── wrangler.toml
└── README.md
```

## Development

### Type Safety

All 20 WARP parameters have full TypeScript definitions with:
- Proper types (string, number, boolean, enum)
- Optional vs required marking
- Platform-specific annotations
- Validation patterns

### Adding New Parameters

To add new parameters:

1. Update `src/lib/types.ts` with the new parameter type
2. Add parameter metadata to `src/lib/constants.ts`
3. Update validation rules if needed
4. The UI will automatically include the new parameter

### Testing

```bash
# Type checking
npm run type-check

# Build test
npm run build

# Preview production build
npm run preview
```

## Resources

- [Cloudflare WARP Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/)
- [WARP MDM Deployment Guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/)
- [WARP MDM Parameters Reference](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/parameters/)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- **Issues:** [GitHub Issues](https://github.com/brenobra/warp-mdm-generator/issues)
- **Documentation:** [Cloudflare WARP Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/)

---

Built with ❤️ for the Cloudflare community
