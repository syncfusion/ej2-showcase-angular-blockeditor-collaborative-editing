import { BlockType, ContentType } from '@syncfusion/ej2-angular-blockeditor';
import type { UserModel, CursorColor } from '../models/user.model';

const FIRST_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry',
  'Ivy', 'Jack', 'Karen', 'Leo', 'Mia', 'Nathan', 'Olivia', 'Peter',
  'Quinn', 'Ryan', 'Sophia', 'Thomas', 'Uma', 'Victor', 'Wendy', 'Xavier',
  'Yara', 'Zane', 'Aria', 'Blake', 'Caleb', 'Delilah', 'Ethan', 'Fiona',
  'Gavin', 'Hazel', 'Isaac', 'Jasmine', 'Kai', 'Luna', 'Miles', 'Nora',
  'Oscar', 'Paige', 'Riley', 'Scarlett', 'Theo', 'Valerie', 'Wyatt', 'Zoe'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson',
  'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
  'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green',
  'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts',
  'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards'
];

const DEFAULT_COLORS: CursorColor[] = [
  { light: '#F4433622', dark: '#F44336' },
  { light: '#E91E6322', dark: '#E91E63' },
  { light: '#9C27B022', dark: '#9C27B0' },
  { light: '#673AB722', dark: '#673AB7' },
  { light: '#3F51B522', dark: '#3F51B5' },
  { light: '#2196F322', dark: '#2196F3' },
  { light: '#03A9F422', dark: '#03A9F4' },
  { light: '#00BCD422', dark: '#00BCD4' },
  { light: '#00968822', dark: '#009688' },
  { light: '#4CAF5022', dark: '#4CAF50' },
  { light: '#8BC34A22', dark: '#8BC34A' },
  { light: '#CDDC3922', dark: '#CDDC39' },
  { light: '#FFC10722', dark: '#FFC107' },
  { light: '#FF980022', dark: '#FF9800' },
  { light: '#FF572222', dark: '#FF5722' },
  { light: '#79554822', dark: '#795548' },
  { light: '#607D8B22', dark: '#607D8B' },
  { light: '#EF535022', dark: '#EF5350' },
  { light: '#EC407A22', dark: '#EC407A' },
  { light: '#AB47BC22', dark: '#AB47BC' },
  { light: '#7E57C222', dark: '#7E57C2' },
  { light: '#5C6BC022', dark: '#5C6BC0' },
  { light: '#42A5F522', dark: '#42A5F5' },
  { light: '#29B6F622', dark: '#29B6F6' },
  { light: '#26C6DA22', dark: '#26C6DA' },
  { light: '#26A69A22', dark: '#26A69A' },
  { light: '#66BB6A22', dark: '#66BB6A' },
  { light: '#9CCC6522', dark: '#9CCC65' },
  { light: '#D4E15722', dark: '#D4E157' },
  { light: '#FFCA2822', dark: '#FFCA28' },
  { light: '#FFA72622', dark: '#FFA726' },
  { light: '#FF704322', dark: '#FF7043' },
  { light: '#BDBDBD22', dark: '#757575' },
  { light: '#90A4AE22', dark: '#90A4AE' },
  { light: '#A1887F22', dark: '#A1887F' }
];

export function colorForUser(user: UserModel): CursorColor {
  const userId = user.id || '';

  // Hash the user id for deterministic assignment
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }
  const color = DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
  return color;
}

export function generateUser(): UserModel {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const id = 'user-' + Math.random().toString(36).slice(2, 4);
  const color = colorForUser({ id, user: '', avatarBgColor: '' });

  return {
    id,
    user: `${firstName} ${lastName}`,
    avatarBgColor: color.dark
  };
}

/**
 * Default editor blocks
 */
export const DEFAULT_EDITOR_BLOCKS: any[] = [
  {
    blockType: BlockType.Heading,
    properties: { level: 3 },
    id: 'block-1',
    content: [{ contentType: ContentType.Text, content: 'Welcome to Block Editor Collaboration' }],
  },
  {
    blockType: BlockType.Paragraph,
    id: 'block-2',
    content: [{ contentType: ContentType.Text, content: 'Start typing to begin editing. Your changes will be synced in real-time with all collaborators.' }],
  },
  {
    blockType: BlockType.Paragraph,
    id: 'block-3',
    content: [{ contentType: ContentType.Text, content: 'Share the room URL with others to collaborate together.' }],
  },
];
