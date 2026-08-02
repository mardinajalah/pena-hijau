import {
  mysqlTable,
  int,
  varchar,
  text,
  json,
  mysqlEnum,
  datetime,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// ─── Admins ─────────────────────────────────────────────────────────────────
export const admins = mysqlTable('admins', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: varchar('passwordHash', { length: 255 }),
  role: varchar('role', { length: 100 }),
  avatarUrl: varchar('avatarUrl', { length: 500 }),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`),
  lastLogin: datetime('lastLogin'),
});

// ─── Members ─────────────────────────────────────────────────────────────────
export const members = mysqlTable('members', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }),
  address: text('address'),
  domicile: varchar('domicile', { length: 255 }),
  division: varchar('division', { length: 255 }),
  whatsapp: varchar('whatsapp', { length: 50 }),
  motto: text('motto'),
  status: mysqlEnum('status', ['Aktif', 'Nonaktif']).default('Aktif'),
  joinDate: datetime('joinDate'),
  avatarUrl: varchar('avatarUrl', { length: 500 }),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updatedAt'),
});

// ─── Join Requests ────────────────────────────────────────────────────────────
export const joinRequests = mysqlTable('join_requests', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }),
  address: text('address'),
  domicile: varchar('domicile', { length: 255 }),
  divisionInterest: varchar('divisionInterest', { length: 255 }),
  whatsapp: varchar('whatsapp', { length: 50 }),
  motto: text('motto'),
  registeredDate: datetime('registeredDate'),
  status: mysqlEnum('status', ['Menunggu', 'Diterima', 'Ditolak']).default('Menunggu'),
  avatarUrl: varchar('avatarUrl', { length: 500 }),
  adminNote: text('adminNote'),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`),
  verifiedAt: datetime('verifiedAt'),
});

// ─── Galleries ───────────────────────────────────────────────────────────────
export const galleries = mysqlTable('galleries', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 500 }),
  category: varchar('category', { length: 100 }),
  location: varchar('location', { length: 255 }),
  date: varchar('date', { length: 50 }),
  coverImage: varchar('coverImage', { length: 500 }),
  photos: json('photos').$type<{ id: number; url: string; caption?: string }[]>(),
  photoCount: int('photoCount').default(0),
  description: text('description'),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updatedAt'),
});

// ─── Articles ─────────────────────────────────────────────────────────────────
export const articles = mysqlTable('articles', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 500 }),
  category: varchar('category', { length: 100 }),
  date: varchar('date', { length: 50 }),
  location: varchar('location', { length: 255 }),
  author: varchar('author', { length: 255 }),
  excerpt: text('excerpt'),
  paragraphs: json('paragraphs').$type<string[]>(),
  quote: text('quote'),
  image: varchar('image', { length: 500 }),
  galleryImages: json('galleryImages').$type<string[]>(),
  sources: json('sources').$type<{ name: string; url: string }[]>(),
  status: mysqlEnum('status', ['Dipublikasikan', 'Draft']).default('Draft'),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updatedAt'),
});
