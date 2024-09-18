import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

//Courses Table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

//Sections Table
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "Section 1"
  level: text("level").notNull(), // e.g., "Beginner A1"
  description: text("description").notNull(), // e.g., "Introduction to basic phrases"
  order: integer("order").notNull(), // Position of section within the course
});

// Join Table for Many-to-Many relationship Between Courses and Sections
export const courseSections = pgTable("course_sections", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  sectionId: integer("section_id")
    .notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  sectionPhrase: text("section_phrase").notNull(),
  order: integer("order").notNull(), // Position of section within a course
});

//Relations for courses
export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  sections: many(courseSections), //Many-to-Many relationship
}));

//Relations for sections
export const sectionsRelations = relations(sections, ({ many }) => ({
  course: many(courseSections),
  // units: many(units), // Units linked through courseSections
}));

//Relations for courseSections
export const courseSectionsRelations = relations(
  courseSections,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseSections.courseId],
      references: [courses.id],
    }),
    section: one(sections, {
      fields: [courseSections.sectionId],
      references: [sections.id],
    }),
    units: many(units), // Each course-section combo has many units
  })
);

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "Unit 1"
  description: text("description").notNull(), // e.g., "Learn the basics"
  courseSectionId: integer("course_section_id")
    .notNull()
    .references(() => courseSections.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(), // Position of unit within the section
});

export const unitsRelations = relations(units, ({ one, many }) => ({
  courseSection: one(courseSections, {
    fields: [units.courseSectionId],
    references: [courseSections.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  units: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const sectionProgress = pgTable("section_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  courseSectionId: integer("course_section_id")
    .references(() => courseSections.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const sectionProgressRelations = relations(
  sectionProgress,
  ({ one }) => ({
    section: one(courseSections, {
      fields: [sectionProgress.courseSectionId],
      references: [courseSections.id],
    }),
  })
);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});
