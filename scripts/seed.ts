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
    await db.delete(schema.userSubscription);

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
        courseId: 2, //French
        order: 1,
      },
    ]);

    // Add lesson
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

    //challenges 1-5 for lesson.id =1
    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "the man"?',
      },
      {
        id: 2,
        lessonId: 1, // Nouns
        type: "SELECT",
        order: 2,
        question: 'Which one of these is "the robot"?',
      },
      {
        id: 3,
        lessonId: 1, // Nouns
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the woman"?',
      },
      {
        id: 4,
        lessonId: 1, // Nouns
        type: "ASSIST",
        order: 4,
        question: '"the man"',
      },
      {
        id: 5,
        lessonId: 1, // Nouns
        type: "ASSIST",
        order: 5,
        question: '"the woman"',
      },
    ]);

    /* //challenges 6-10 for lesson.id=1
    await db.insert(schema.challenges).values([
      {
        id: 6,
        lessonId: 1, // Nouns
        type: "ASSIST",
        order: 6,
        question: '"the robot"',
      },
      {
        id: 7,
        lessonId: 1, // Nouns
        type: "ASSIST",
        order: 7,
        question: '"the boy"',
      },
      {
        id: 8,
        lessonId: 1, // Nouns
        type: "ASSIST",
        order: 8,
        question: '"the girl"',
      },
      {
        id: 9,
        lessonId: 1, // Nouns
        type: "ASSIST",
        order: 9,
        question: '"the dog"',
      },
      {
        id: 10,
        lessonId: 1, // Nouns
        type: "ASSIST",
        order: 10,
        question: '"the cat"',
      },
    ]); */

    // options for challenge.id=1, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 1, // Which one of these is "the man"?
        imageSrc: "/characters/man.svg",
        correct: true,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 1,
        imageSrc: "/characters/woman.svg",
        correct: false,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 1,
        imageSrc: "/characters/robot.svg",
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    // options for challenge.id=2, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 2, // Which one of these is "the robot"?
        imageSrc: "/characters/man.svg",
        correct: false,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 2,
        imageSrc: "/characters/woman.svg",
        correct: false,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 2,
        imageSrc: "/characters/robot.svg",
        correct: true,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    // options for challenge.id=3, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 3, // Which one of these is the "the woman"?
        imageSrc: "/characters/man.svg",
        correct: false,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/characters/woman.svg",
        correct: true,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/characters/robot.svg",
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    // options for challenge.id=4, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 4, //  "the man"?
        correct: true,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 4,
        correct: false,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 4,
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    // options for challenge.id=5, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 5, // "the woman"?
        correct: false,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 5,
        correct: true,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 5,
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    /* // options for challenge.id=6, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
      challengeId: 6, // "the robot"?
        correct: false,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
      challengeId: 6,
        correct: false,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
      challengeId: 6,
        correct: true,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);  */

    /*  // options for challenge.id=7, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
      challengeId: 7, //  "the boy"?
        correct: false,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
      challengeId: 7,
        correct: true,
        text: "le garçon",
        audioSrc: "/audio/fr_boy.mp3",
      },
      {
      challengeId: 7,
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]); */

    /*  // options for challenge.id=8
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 8, // "the girl"?
        correct: false,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
      challengeId: 8,
        correct: false,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
      challengeId: 8,
        correct: true,
        text: "la fille",
        audioSrc: "/audio/fr_girl.mp3",
      },
    ]); */

    /* // options for challenge.id=9, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
      challengeId: 6, // "the dog"?
        correct: true,
        text: "le chien",
        audioSrc: "/audio/fr_dog.mp3",
      },
      {
      challengeId: 6,
        correct: false,
        text: "le chat",
        audioSrc: "/audio/fr_cat.mp3",
      },
      {
      challengeId: 6,
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);  */

    /*  // options for challenge.id=10, lesson.id =1
    await db.insert(schema.challengeOptions).values([
      {
      challengeId: 10, // "the cat"?
        correct: false,
        text: "l'homme",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
      challengeId: 10,
        correct: false,
        text: "le bébé",
        audioSrc: "/audio/fr_baby.mp3",
      },
      {
      challengeId: 10,
        correct: true,
        text: "le chat",
        audioSrc: "/audio/fr_cat.mp3",
      },
    ]);  */

    //challenge for lesson id =2
    await db.insert(schema.challenges).values([
      {
        id: 6,
        lessonId: 2, // Verbs
        type: "ASSIST",
        order: 1,
        question: 'Which one of these means "to make"?',
      },
      {
        id: 7,
        lessonId: 2, // Verbs
        type: "ASSIST",
        order: 2,
        question: '"to have"',
      },
      {
        id: 8,
        lessonId: 2, // Verbs
        type: "ASSIST",
        order: 3,
        question: 'How do you say "to be"?',
      },
      {
        id: 9,
        lessonId: 2, // Nouns cont'd
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the girl"?',
      },
      {
        id: 10,
        lessonId: 2, // Nouns cont'd
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the boy"?',
      },
      {
        id: 11,
        lessonId: 2, // Nouns cont'd
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the bread"?',
      },
      {
        id: 12,
        lessonId: 2, // Nouns cont'd
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the apple"?',
      },
    ]);

    // options for challenge.id=6, lesson.id =2
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 6, // Which one of these means "to make"?
        correct: false,
        text: "pouvoir",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 6,
        correct: false,
        text: "dire",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 6,
        correct: true,
        text: "faire",
        audioSrc: "/audio/fr_robot.mp3",
      },
      {
        challengeId: 6,
        correct: false,
        text: "avoir",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    // options for challenge.id=7, lesson.id =2
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 7, // "to have"
        correct: false,
        text: "dire",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 7,
        correct: false,
        text: "pouvoir",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 7,
        correct: false,
        text: "faire",
        audioSrc: "/audio/fr_robot.mp3",
      },
      {
        challengeId: 7,
        correct: true,
        text: "avoir",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    // options for challenge.id=8, lesson.id =2
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 8, // 'How do you say "to be"?'
        correct: true,
        text: "être",
        audioSrc: "/audio/fr_man.mp3",
      },
      {
        challengeId: 8,
        correct: false,
        text: "voir",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 8,
        correct: false,
        text: "aller",
        audioSrc: "/audio/fr_robot.mp3",
      },
      {
        challengeId: 8,
        correct: false,
        text: "dire",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    //options for challenge.id=9, lesson.id=2
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 9,
        imageSrc: "/characters/girl.svg",
        correct: false,
        text: "la fille",
        audioSrc: "/audio/fr_girl.mp3",
      },
      {
        challengeId: 9,
        imageSrc: "/characters/woman.svg",
        correct: false,
        text: "la femme",
        audioSrc: "/audio/fr_woman.mp3",
      },
      {
        challengeId: 9,
        imageSrc: "/characters/robot.svg",
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
    ]);

    //options for challenge.id=10, lesson.id=2
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 10,
        imageSrc: "/characters/robot.svg",
        correct: false,
        text: "le robot",
        audioSrc: "/audio/fr_robot.mp3",
      },
      {
        challengeId: 10,
        imageSrc: "/characters/girl.svg",
        correct: false,
        text: "la fille",
        audioSrc: "/audio/fr_girl.mp3",
      },
      {
        challengeId: 10,
        imageSrc: "/characters/boy.svg",
        correct: true,
        text: "le garçon",
        audioSrc: "/audio/fr_boy.mp3",
      },
    ]);

    //options for challenge.id=11, lesson.id=2
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 11, // Which one of these is "the bread"?
        imageSrc: "/characters/bread.svg",
        correct: true,
        text: "le pain",
        audioSrc: "/audio/fr_bread.mp3",
      },
      {
        challengeId: 11,
        imageSrc: "/characters/apple.svg",
        correct: false,
        text: "la pomme",
        audioSrc: "/audio/fr_apple.mp3",
      },
      {
        challengeId: 11,
        imageSrc: "/characters/banana.svg",
        correct: false,
        text: "la banane",
        audioSrc: "/audio/fr_banana.mp3",
      },
    ]);

    //options for challenge.id=12, lesson.id=2
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 12, // Which one of these is "the apple"?
        imageSrc: "/characters/bread.svg",
        correct: false,
        text: "le pain",
        audioSrc: "/audio/fr_bread.mp3",
      },
      {
        challengeId: 12,
        imageSrc: "/characters/apple.svg",
        correct: true,
        text: "la pomme",
        audioSrc: "/audio/fr_apple.mp3",
      },
      {
        challengeId: 12,
        imageSrc: "/characters/banana.svg",
        correct: false,
        text: "la banane",
        audioSrc: "/audio/fr_banana.mp3",
      },
    ]);
    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
  }
};

main();
