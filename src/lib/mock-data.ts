// Mock data for dashboard UI development
// Replace with real database queries once Prisma is set up

export type ItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
};

export type Tag = {
  id: string;
  name: string;
};

export type Item = {
  id: string;
  title: string;
  content: string | null;
  description: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemType: ItemType;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

// ─── Item Types ─────────────────────────────────────────

export const itemTypes: ItemType[] = [
  { id: "type-1", name: "Snippets", icon: "Code", color: "#22c55e", isSystem: true },
  { id: "type-2", name: "Notes", icon: "StickyNote", color: "#3b82f6", isSystem: true },
  { id: "type-3", name: "Commands", icon: "Terminal", color: "#f59e0b", isSystem: true },
  { id: "type-4", name: "Files", icon: "File", color: "#8b5cf6", isSystem: true },
  { id: "type-5", name: "Prompts", icon: "Sparkles", color: "#ec4899", isSystem: true },
  { id: "type-6", name: "Images", icon: "Image", color: "#14b8a6", isSystem: true },
  { id: "type-7", name: "Links", icon: "Link", color: "#f97316", isSystem: true },
];

// ─── Tags ───────────────────────────────────────────────

export const tags: Tag[] = [
  { id: "tag-1", name: "react" },
  { id: "tag-2", name: "hooks" },
  { id: "tag-3", name: "performance" },
  { id: "tag-4", name: "bash" },
  { id: "tag-5", name: "devops" },
  { id: "tag-6", name: "typescript" },
  { id: "tag-7", name: "config" },
  { id: "tag-8", name: "remote" },
  { id: "tag-9", name: "code-review" },
  { id: "tag-10", name: "automation" },
];

// ─── Items ──────────────────────────────────────────────

export const items: Item[] = [
  {
    id: "item-1",
    title: "useDebounce Hook",
    description: "A custom hook for debouncing values in React components",
    content: `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}`,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    itemType: itemTypes[0],
    tags: [tags[0], tags[1], tags[2]],
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "item-2",
    title: "Git Reset Hard",
    description: "Reset the current branch to the previous commit. Useful for reverting changes.",
    content: "git reset --hard HEAD~1",
    language: null,
    isFavorite: true,
    isPinned: false,
    itemType: itemTypes[2],
    tags: [tags[3], tags[4], tags[7]],
    createdAt: "2024-01-13T14:30:00Z",
    updatedAt: "2024-01-13T14:30:00Z",
  },
  {
    id: "item-3",
    title: "Code Review Assistant",
    description: "An AI prompt for code review automation. Analyzes pull request code changes, identifies bugs and improvements.",
    content: "Review the following pull request code changes. Analyze for bugs, performance issues, and suggest improvements. Format your response as a list of findings.",
    language: null,
    isFavorite: false,
    isPinned: false,
    itemType: itemTypes[4],
    tags: [tags[8], tags[9]],
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "item-4",
    title: "tsconfig.json Template",
    description: "Standard TypeScript configuration for Next.js projects",
    content: `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve"
  }
}`,
    language: "json",
    isFavorite: false,
    isPinned: false,
    itemType: itemTypes[0],
    tags: [tags[5], tags[6], tags[7]],
    createdAt: "2024-01-11T16:00:00Z",
    updatedAt: "2024-01-11T16:00:00Z",
  },
  {
    id: "item-5",
    title: "useLocalStorage Hook",
    description: "Persist state in localStorage with SSR support",
    content: `import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    const item = window.localStorage.getItem(key)
    if (item) setStoredValue(JSON.parse(item))
  }, [key])

  const setValue = (value: T) => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue] as const
}`,
    language: "typescript",
    isFavorite: true,
    isPinned: false,
    itemType: itemTypes[0],
    tags: [tags[0], tags[1]],
    createdAt: "2024-01-10T11:00:00Z",
    updatedAt: "2024-01-10T11:00:00Z",
  },
  {
    id: "item-6",
    title: "Meeting Notes - Sprint Planning",
    description: "Sprint planning meeting notes and action items",
    content: "## Sprint Goals\n- Complete dashboard UI\n- Set up authentication\n- Deploy staging environment\n\n## Action Items\n- [ ] Design sidebar component\n- [ ] Implement collection cards\n- [ ] Add search functionality",
    language: null,
    isFavorite: false,
    isPinned: false,
    itemType: itemTypes[1],
    tags: [],
    createdAt: "2024-01-09T08:00:00Z",
    updatedAt: "2024-01-09T08:00:00Z",
  },
];

// ─── Collections ────────────────────────────────────────

export const collections: Collection[] = [
  { id: "col-1", name: "React Hooks", description: "Custom React hooks and patterns", isFavorite: true, itemCount: 12 },
  { id: "col-2", name: "Terminal Commands", description: "Frequently used shell commands", isFavorite: false, itemCount: 8 },
  { id: "col-3", name: "AI Prompts", description: "Prompt templates for AI tools", isFavorite: false, itemCount: 5 },
  { id: "col-4", name: "Config Files", description: "Project configuration templates", isFavorite: false, itemCount: 6 },
  { id: "col-5", name: "Project Stories", description: "User stories and requirements", isFavorite: true, itemCount: 14 },
  { id: "col-6", name: "TypeScript Utils", description: "TypeScript utility types and helpers", isFavorite: false, itemCount: 9 },
];

// ─── Current User ───────────────────────────────────────

export const currentUser: User = {
  id: "user-1",
  name: "Developer",
  email: "dev@example.com",
  image: null,
};
