import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["OWNER", "EDITOR", "VIEWER"]);

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tripsTable = pgTable("trips", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  title: text("title").notNull(),

  description: text("description"),

  startDate: timestamp("start_date", { withTimezone: true }),

  endDate: timestamp("end_date", { withTimezone: true }),

  createdBy: integer("created_by")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tripMembersTable = pgTable(
  "trip_members",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    tripId: integer("trip_id")
      .notNull()
      .references(() => tripsTable.id, { onDelete: "cascade" }),

    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    role: roleEnum("role").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    {
      uniqueMember: uniqueIndex("unique_trip_user").on(
        table.tripId,
        table.userId,
      ),

      tripIdx: index("trip_idx").on(table.tripId),
      userIdx: index("user_idx").on(table.userId),
    },
  ],
);
