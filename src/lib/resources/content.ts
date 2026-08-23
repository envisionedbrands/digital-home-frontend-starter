/**
 * Resource file content registry.
 *
 * Each .md file in public/resources/ that should be downloadable
 * is imported here as raw text (via the webpack asset/source rule
 * in next.config.ts). The download route handler reads from this map.
 *
 * To add a new downloadable resource:
 *   1. Place the .md file in public/resources/
 *   2. Add an import + map entry here
 *   3. Add an entry to the RESOURCES array in src/app/resources/page.tsx
 */

// @ts-expect-error — webpack asset/source import, no type declaration
import callIntelligence from "../../../public/resources/call-intelligence-skill.md";

export const RESOURCE_FILES: Record<string, string> = {
  "call-intelligence-skill.md": callIntelligence as string,
};
