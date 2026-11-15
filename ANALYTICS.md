# Google Analytics 4 — Defense Line

Web stream: **G-23KW675G31**, supplied by the owner. This Measurement ID is public configuration, not an API secret.

## Architecture

The repository originally contained a Godot static Web export with no analytics. The existing GitHub Actions workflow still publishes `site/` to GitHub Pages on pushes to `main`; its configuration is unchanged.

- `site/analytics-config.js`: Measurement ID and enabled/debug switches.
- `site/analytics.js`: consent, asynchronous Google tag loading, allowlists, deduplication and gameplay engagement summary.
- `site/analytics.css`: bilingual preferences UI.
- `index.html`: loads these modules and signals successful engine launch.
- The separate Godot working project has a small `analytics_bridge.gd` with hooks at actual game actions. Its export branding script preserves the integration on rebuilds.

No analytics polling runs per frame. Gameplay never depends on Google availability.

## Events

| Event | Meaning |
| --- | --- |
| `page_view` and GA4 automatic events | Consenting visitors, sessions, returning browsers, engagement, approximate countries, devices and attribution. One explicit page view; initial automatic page view is disabled. Reserved automatic events are not sent manually. |
| `game_launch` (custom) | Engine loaded, once per page after consent. |
| `game_start` (custom) | First actual mission deployment in this page session. Opening a briefing does not count. |
| `level_start` | Each actual attempt; `level_name`, `level_number`, `sector_id`, `difficulty`, `character`. |
| `level_end` | Actual victory/defeat; recommended boolean `success` plus level context. Abandon/retry is not reported as defeat. |
| `game_session_end` (custom) | Once on page hide/unload after gameplay: `active_time_sec`, `levels_started`, `levels_completed`, `levels_failed`. Active time excludes hidden tabs, pauses, menus and briefings. |
| `tutorial_begin`, `tutorial_complete`, `tutorial_skip` (custom skip) | Guide opened, explicitly completed, or skipped; exit includes `tutorial_step`. |
| `level_up` | Actual hero level increase; `level`, `character`. |
| `unlock_achievement` | New achievement; `achievement_id`. |
| `spend_virtual_currency` | Successful build/upgrade; `virtual_currency_name=gold`, `value`, `item_name`. |
| `earn_virtual_currency` | Actual early-wave reward, without per-kill spam. |
| `wave_start` (custom) | Actual wave; `wave_number`, `early`. |
| `ability_use` (custom) | Successful hero/air/reinforcement use; `ability`. Selecting or cancelling a target does not count. |

Attempt keys are local deduplication values and are never transmitted. Parameters are allowlisted. No movement, shot or animation-frame events are sent. QA/probe URLs and Godot review/testing modes are excluded. Consented-load buffers and deduplication sets are bounded.

## Privacy

[Basic consent mode](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic): no Google script, analytics cookies, measurement requests or cookieless pings before explicit acceptance. Declining or closing the prompt does not block the game. Consent expires after 180 days. GPC and Do Not Track override a stored grant.

Use **Privacy / פרטיות** to withdraw or re-grant consent. Desktop has a privacy button; touch devices expose it under Actions. Withdrawal disables new collection, clears pending events and scoped Analytics cookies. Already-sent requests cannot be recalled. Changing consent does not reset the game.

Advertising storage, ad user data and ad personalization stay denied. Google Signals and ad personalization are disabled. Cookies have a `defense` prefix, the project subpath, Secure/SameSite=Lax, and a 180-day lifetime. Returning players rely on GA4's consented browser cookie; there is no custom player ID, fingerprint or cross-device identity.

Game code supplies no logins, email, saved profiles, account IDs, precise location or custom user IDs. Google receives normal consented connection/device information for its reporting. Arbitrary URL parameters and fragments are removed, constrained UTM fields are retained, and referrers are reduced to origins. Reports cover consenting visitors, not every player.

## Dashboard

1. Open [Google Analytics](https://analytics.google.com/) with the account that owns this property.
2. Select the property with Web stream **G-23KW675G31**.
3. Enhanced measurement is disabled in the Web stream (confirmed by the owner) because this integration sends page views and gameplay explicitly; this avoids unrelated automatic scroll/form events. Use **Reports → Realtime** for incoming activity; Events/Explore for gameplay, Acquisition for traffic, user attributes for country, and Tech for devices. Returning-user reports depend on consenting browser cookies.
4. For debugging, visit `https://afedidastudio.github.io/defense-line-web/?analytics_debug=1`, accept Analytics, and inspect DebugView. Configure the property's developer-traffic filter if debug traffic should be excluded from regular reports.
5. To filter Explore by gameplay fields, register event-scoped custom definitions for `sector_id`, `level_number`, `difficulty`, `ability`, `character`, and `level_name`/`success` if not already available. Register `active_time_sec` as a seconds metric if desired.

No further credentials are needed for collection. Property retention, filters and custom definitions require the owner's Analytics UI permissions and are not changed by this repository. Browser requests can be verified without access to the private dashboard. [Google notes that regular reports can take 24–48 hours; Realtime and DebugView help verify collection.](https://support.google.com/analytics/answer/9333790?hl=en)

## Verification

- Mocked consent tests: missing configuration, no pre-consent traffic/cookies, decline persistence, one tag/pageview, no replay of pre-consent gameplay, URL redaction, level win/failure parameters, deduplication, withdrawal/re-grant, GPC/DNT, consent expiry and probe exclusion. No real gameplay telemetry is sent in these tests.
- Touch-driven Godot test with mocked transport: one launch/start/level/tutorial, actual build/upgrade currency spends, actual air strike versus cancellation, wave start and early-wave reward.
- Native suites: 4,119 campaign checks and 320 UI checks pass. The 2,391-check threat suite, including added vehicle footprint/turn checks, passes on its stage-1 fixture.
- Public-site asset hashes and actual consented collection requests are verified after deployment. A live debug test is not a full human playthrough or a view of the owner's private dashboard.

References: [recommended events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events), [configuration fields](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
