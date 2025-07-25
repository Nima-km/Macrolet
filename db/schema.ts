import { timestamp } from 'drizzle-orm/gel-core';
import { check, sqliteTable, text, integer, } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';



export const food = sqliteTable('food', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    description: text('description').notNull(),
    protein: integer('protein').default(0).notNull(),
    fat: integer('fat').default(0).notNull(),
    calories: integer('calories'),
    carbs: integer('carbs').default(0).notNull(),
    fiber: integer('fiber').default(0).notNull(),
    barcode: integer('barcode').default(0),
    is_recipe: integer('is_recipe', {mode: 'boolean'}).default(false),
    is_template: integer('is_template', {mode: 'boolean'}).default(false),
    serving_100g: integer('serving_100g').default(1).notNull(),
    volume_100g: integer('volume_100g').default(1).notNull(),
})

export const macroProfile = sqliteTable('macroProfile', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
})

export const macroGoal = sqliteTable('macroGoal', {
    id: integer('id').primaryKey({autoIncrement: true}),
    protein: integer('protein').default(0).notNull(),
    fat: integer('fat').default(0).notNull(),
    carbs: integer('carbs').default(0).notNull(),
    calories: integer('calories').default(0).notNull(),
    macro_profile: integer('macro_profile')
    .notNull()
    .references(() => macroProfile.id),
})

export const nutritionGoal = sqliteTable('nutritionGoal', {
    id: integer('id').primaryKey({autoIncrement: true}),
    timestamp: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
    protein: integer('protein').notNull().default(0),
    fat: integer('fat').notNull().default(0),
    calories: integer('calories').default(0).notNull(),
    carbs: integer('carbs').notNull().default(0),
    
})

export const foodItem = sqliteTable ('foodItem', {
    id: integer('id').primaryKey({autoIncrement: true}),
    timestamp: integer('timestamp', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
    food_id: integer('food_id')
    .notNull()
    .references(() => food.id),
    servings: integer('servings').default(0).notNull(),
    serving_mult: integer('serving_mult').default(1).notNull(),
    serving_type: text('serving_type').notNull(),
    
}
)
export const WeightItem = sqliteTable ('weightItem', {
    id: integer('id').primaryKey({autoIncrement: true}),
    timestamp: integer('timestamp', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
    weight: integer('weight').default(0).notNull(),
    }
)

export const recipeItem = sqliteTable ('recipeItem', {
    id: integer('id').primaryKey({autoIncrement: true}),
    recipe_id: integer('recipe_id')
    .notNull()
    .references(() => food.id),
    ingredient_id: integer('food_id')
    .notNull()
    .references(() => food.id),
    servings: integer('servings').notNull(),
    serving_mult: integer('serving_mult').default(1).notNull(),
    serving_type: text('serving_type').notNull(),
    
},
    (table) => [
        check("meal_check3", sql`${table.id} != ${table.ingredient_id}`),
    ]
)
