import { pgTable, serial, varchar, timestamp, text, integer, bigint, boolean, interval } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('hashed_password'),
  image: text('image'),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  verificationToken: varchar('verification_token', { length: 255 }),
  verificationTokenExpires: timestamp('verification_token_expires', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// OAuth accounts table schema
export const oauthAccounts = pgTable('oauth_accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Task types table schema
export const taskTypes = pgTable('task_types', {
  typeId: bigint('type_id', { mode: 'number' }).primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  typeName: text('type_name').notNull(),
  color: varchar('color', { length: 30 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Todo lists table schema
export const todoLists = pgTable('todo_lists', {
  listId: bigint('list_id', { mode: 'number' }).primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  typeId: bigint('type_id', { mode: 'number' }).references(() => taskTypes.typeId, { onDelete: 'set null' }),
  listName: text('list_name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Todo tasks table schema
export const todoTasks = pgTable('todo_tasks', {
  taskId: bigint('task_id', { mode: 'number' }).primaryKey(),
  listId: bigint('list_id', { mode: 'number' }).references(() => todoLists.listId, { onDelete: 'cascade' }),
  parentTaskId: bigint('parent_task_id', { mode: 'number' }).references(() => todoTasks.taskId, { onDelete: 'cascade' }),
  typeId: bigint('type_id', { mode: 'number' }).references(() => taskTypes.typeId, { onDelete: 'set null' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  priority: integer('priority'),
  duration: interval('duration'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// App types table schema
export const appTypes = pgTable('app_types', {
  typeId: bigint('type_id', { mode: 'number' }).primaryKey(),
  typeName: text('type_name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Applications table schema
export const applications = pgTable('applications', {
  appId: bigint('app_id', { mode: 'number' }).primaryKey(),
  appName: text('app_name').notNull(),
  packageName: text('package_name').notNull().unique(),
  typeId: bigint('type_id', { mode: 'number' }).references(() => appTypes.typeId),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Operating systems table schema
export const operatingSystems = pgTable('operating_systems', {
  osName: text('os_name').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Devices table schema
export const devices = pgTable('devices', {
  deviceId: bigint('device_id', { mode: 'number' }).primaryKey(),
  userId: integer('user_id').references(() => users.id),
  deviceName: text('device_name').notNull(),
  osName: text('os_name').references(() => operatingSystems.osName),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// App groups table schema
export const appGroups = pgTable('app_groups', {
  groupId: bigint('group_id', { mode: 'number' }).primaryKey(),
  userId: integer('user_id').references(() => users.id),
  groupName: text('group_name').notNull(),
  parentGroupId: bigint('parent_group_id', { mode: 'number' }).references(() => appGroups.groupId, { onDelete: 'cascade' }),
  workCategory: integer('work_category').default(0),
  dailyTimeLimit: interval('daily_time_limit'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// App usage sessions table schema
export const appUsageSessions = pgTable('app_usage_sessions', {
  sessionId: bigint('session_id', { mode: 'number' }).primaryKey(),
  userId: integer('user_id').references(() => users.id),
  deviceId: bigint('device_id', { mode: 'number' }).references(() => devices.deviceId),
  appId: bigint('app_id', { mode: 'number' }).references(() => applications.appId),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// App group members table schema
export const appGroupMembers = pgTable('app_group_members', {
  groupId: bigint('group_id', { mode: 'number' }).references(() => appGroups.groupId),
  appId: bigint('app_id', { mode: 'number' }).references(() => applications.appId),
  dailyTimeLimit: interval('daily_time_limit'),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  oauthAccounts: many(oauthAccounts),
  todoLists: many(todoLists),
  todoTasks: many(todoTasks),
  taskTypes: many(taskTypes),
  devices: many(devices),
  appGroups: many(appGroups),
  appUsageSessions: many(appUsageSessions),
}));

export const todoListsRelations = relations(todoLists, ({ one, many }) => ({
  user: one(users, {
    fields: [todoLists.userId],
    references: [users.id],
  }),
  type: one(taskTypes, {
    fields: [todoLists.typeId],
    references: [taskTypes.typeId],
  }),
  tasks: many(todoTasks),
}));

export const todoTasksRelations = relations(todoTasks, ({ one, many }) => ({
  list: one(todoLists, {
    fields: [todoTasks.listId],
    references: [todoLists.listId],
  }),
  parentTask: one(todoTasks, {
    fields: [todoTasks.parentTaskId],
    references: [todoTasks.taskId],
  }),
  type: one(taskTypes, {
    fields: [todoTasks.typeId],
    references: [taskTypes.typeId],
  }),
  user: one(users, {
    fields: [todoTasks.userId],
    references: [users.id],
  }),
  subtasks: many(todoTasks, { relationName: 'parentChild' }),
}));

export const appGroupsRelations = relations(appGroups, ({ one, many }) => ({
  user: one(users, {
    fields: [appGroups.userId],
    references: [users.id],
  }),
  parentGroup: one(appGroups, {
    fields: [appGroups.parentGroupId],
    references: [appGroups.groupId],
  }),
  members: many(appGroupMembers),
}));

export const devicesRelations = relations(devices, ({ one, many }) => ({
  user: one(users, {
    fields: [devices.userId],
    references: [users.id],
  }),
  operatingSystem: one(operatingSystems, {
    fields: [devices.osName],
    references: [operatingSystems.osName],
  }),
  usageSessions: many(appUsageSessions),
}));

// Type definitions for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OAuthAccount = typeof oauthAccounts.$inferSelect;
export type NewOAuthAccount = typeof oauthAccounts.$inferInsert;
export type TaskType = typeof taskTypes.$inferSelect;
export type NewTaskType = typeof taskTypes.$inferInsert;
export type TodoList = typeof todoLists.$inferSelect;
export type NewTodoList = typeof todoLists.$inferInsert;
export type TodoTask = typeof todoTasks.$inferSelect;
export type NewTodoTask = typeof todoTasks.$inferInsert;
export type AppType = typeof appTypes.$inferSelect;
export type NewAppType = typeof appTypes.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type OperatingSystem = typeof operatingSystems.$inferSelect;
export type NewOperatingSystem = typeof operatingSystems.$inferInsert;
export type Device = typeof devices.$inferSelect;
export type NewDevice = typeof devices.$inferInsert;
export type AppGroup = typeof appGroups.$inferSelect;
export type NewAppGroup = typeof appGroups.$inferInsert;
export type AppUsageSession = typeof appUsageSessions.$inferSelect;
export type NewAppUsageSession = typeof appUsageSessions.$inferInsert;
export type AppGroupMember = typeof appGroupMembers.$inferSelect;
export type NewAppGroupMember = typeof appGroupMembers.$inferInsert; 