# Add Danzario class planning workspace with Firebase persistence

The repository previously contained only a prototype description. This PR adds a complete React 18/TypeScript app for dance teachers: services and itinerary templates, choreography folders, monthly student cycles, class planning, attendance, completion, and emotional check-ins.

The Spanish mobile-first interface uses the requested dark palette and fonts. Google authentication isolates each teacher's Firestore records; cycle attendance derives from given classes rather than a second attendance store. Includes Firebase rules/emulators, tests, CI, Vercel SPA configuration, and setup documentation.

See `docs/VALIDATION.md` for actual checks and screenshots. A real Firebase project and its Google provider/authorized domains must be configured before cloud sign-in can be verified. Vercel preview publication depends on that setup. No production deployment or legacy-data migration is included.
