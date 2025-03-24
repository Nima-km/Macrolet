import { timestamp } from 'drizzle-orm/gel-core';
import { check, sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
const timestamps = {
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  }

export const tasks = sqliteTable('tasks', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    list_id: integer('list_id')
    .notNull()
    .references(() => lists.id),
})

export const lists = sqliteTable('lists', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
})

export const food = sqliteTable('food', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    description: text('description').notNull(),
    protein: integer('protein').notNull(),
    fat: integer('fat').notNull(),
    calories: integer('calories'),
    carbs: integer('carbs').notNull(),
})

export const nutritionGoal = sqliteTable('nutritionGoal', {
    id: integer('id').primaryKey({autoIncrement: true}),
    created_at: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
    protein: integer('protein').notNull().default(0),
    fat: integer('fat').notNull().default(0),
    calories: integer('calories').default(0),
    carbs: integer('carbs').notNull().default(0),
})

export const foodItem = sqliteTable ('foodItem', {
    id: integer('id').primaryKey({autoIncrement: true}),
    created_at: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
    food_id: integer('food_id')
    .notNull()
    .references(() => food.id),
    servings: integer('servings').notNull(),
    meal: integer('meal').notNull() 
    
},
    (table) => [
        check("meal_check", sql`${table.meal} < 3`),
        check("meal_check2", sql`${table.meal} >= 0`),
    ]
)

export type Task = typeof tasks.$inferSelect;