# Studio 4 Milestone 07 — Implementation Note

Milestone 07 introduces a typed Library catalog over reusable Studio knowledge while preserving the Component Registry as the only runtime rendering authority.

## Library contract

Items have stable `id`, supported `type`, lifecycle `status`, future-compatible `version`, tags, description, provenance, and a typed payload/reference. Supported types are token, component, composition, blueprint, and starter package. Supported states are certified, specialty, experimental, deprecated, and archived.

Default queries return Certified items only. Type, explicit lifecycle, text, and tag filters intentionally expose less-common knowledge. Deprecated and Archived items therefore remain inspectable without entering normal production discovery.

## Runtime integration

Hero, Services, and CTA Library items carry only `payload.definitionType`; startup verifies each reference against the executable Component Registry. Renderers, variants, insertion defaults, and content remain owned by the runtime definition. Non-component seeds are metadata-only and cannot be inserted or executed.

## Browser and seed inventory

The Edit-mode Library drawer offers search plus type and lifecycle filtering. Cards show name, type, status, version, tags, and description. Browsing is local UI state and creates no document-history entries.

Seeds include three Certified components, a Certified color token and composition, an Experimental blueprint, Specialty starter package, Deprecated legacy token, and Archived composition.

## Limits

The catalog is in-memory and browse-only. Authoring, promotion, executable compositions/blueprints/starters, shared persistence, usage inventory, and later roadmap systems remain deferred.
