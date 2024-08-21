import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding Database.....");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "English",
        imageSrc: "/flags/l/us.svg",
      },
      {
        id: 2,
        title: "French",
        imageSrc: "/flags/l/fr.svg",
      },
      {
        id: 3,
        title: "Spanish",
        imageSrc: "/flags/l/es.svg",
      },
      {
        id: 4,
        title: "Italian",
        imageSrc: "/flags/l/it.svg",
      },
    ]);

    //Add units
    await db.insert(schema.units).values([
      {
        id: 1,
        title: "Unit 1",
        description: "Learn the basics",
        course_id: 2, //French
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        title: "Nouns",
        unitId: 1,
        order: 1,
      },
      {
        id: 2,
        title: "Verbs",
        unitId: 1,
        order: 2,
      },
      {
        id: 3,
        title: "Adjectives",
        unitId: 1,
        order: 3,
      },
      {
        id: 4,
        title: "Pronouns",
        unitId: 1,
        order: 4,
      },
      {
        id: 5,
        title: "Adverbs",
        unitId: 1,
        order: 5,
      },
      {
        id: 6,
        title: "Prepositions",
        unitId: 1,
        order: 6,
      },
      {
        id: 7,
        title: "Phrases",
        unitId: 1,
        order: 7,
      },
      {
        id: 8,
        title: "Salutation",
        unitId: 1,
        order: 8,
      },
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "the man"?',
      },
      // {
      //   id: 2,
      //   lessonId: 1, // Nouns
      //   type: "ASSIST",
      //   order: 2,
      //   question: '"the man"',
      // },
      // {
      //   id: 3,
      //   lessonId: 1, // Nouns
      //   type: "SELECT",
      //   order: 3,
      //   question: 'Which one of these is the "the robot"?',
      // },
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        id: 1,
        challengeId: 1, // Which one of these is "the man"?
        imageSrc: "/man.svg",
        correct: true,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        id: 2,
        challengeId: 1,
        imageSrc: "/woman.svg",
        correct: false,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        id: 3,
        challengeId: 1,
        imageSrc: "/robot.svg",
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    /*  await db.insert(schema.challengeOptions).values([
      {
        challengeId: 2, // "the man"?
        correct: true,
        text: "l'homme",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 2,
        correct: false,
        text: "la femme",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 2,
        correct: false,
        text: "le robot",
        audioSrc: "/es_robot.mp3",
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 3, // Which one of these is the "the robot"?
        imageSrc: "/man.svg",
        correct: false,
        text: "l'homme",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/woman.svg",
        correct: false,
        text: "la femme",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/robot.svg",
        correct: true,
        text: "le robot",
        audioSrc: "/es_robot.mp3",
      },
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 4,
        lessonId: 2, // Verbs
        type: "SELECT",
        order: 1,
        question: 'Which one of these is the "the woman"?',
      },
      {
        id: 5,
        lessonId: 2, // Verbs
        type: "ASSIST",
        order: 2,
        question: '"the girl"',
      },
      {
        id: 6,
        lessonId: 2, // Verbs
        type: "SELECT",
        order: 3,
        question: 'Which one of these is the "the robot"?',
      },
    ]); */

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
  }
};

main();
