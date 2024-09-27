import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const reset = async () => {
  console.log("Resetting Database.....");

  await db.delete(schema.courses);
  await db.delete(schema.userProgress);
  await db.delete(schema.units);
  await db.delete(schema.lessons);
  await db.delete(schema.challenges);
  await db.delete(schema.challengeOptions);
  await db.delete(schema.challengeProgress);
  await db.delete(schema.userSubscription);
  console.log("Resetting Finished.....");
};

const coursesPopulation = async () => {
  console.log("Populating Courses.....");
  await db.insert(schema.courses).values([
    {
      id: 1,
      title: "French",
      imageSrc: "/flags/l/fr.svg",
    },
    {
      id: 2,
      title: "Spanish",
      imageSrc: "/flags/l/es.svg",
    },
    {
      id: 3,
      title: "Italian",
      imageSrc: "/flags/l/it.svg",
    },
  ]);
  console.log("Populating Courses Finished");
};
const sectionsPopulation = async () => {
  console.log("Populating Sections.....");
  await db.insert(schema.sections).values([
    {
      id: 1,
      title: "Section 1",
      level: "Beginner A1",
      description: "Start with essential phrases and simple grammar concepts",
      order: 1,
    },
    {
      title: "Section 2",
      level: "Beginner A1",
      description:
        "Learn words, phrases and grammar concepts for basic interactions",
      order: 2,
    },
    {
      title: "Section 3",
      level: "Elementary A2",
      description:
        "Learn more foundational concepts and sentences for basic conversation",
      order: 3,
    },
    {
      title: "Section 4",
      level: "Elementary A2",
      description: "Use sentences in conversations about everyday topics",
      order: 4,
    },
    {
      title: "Section 5",
      level: "Intermediate B1",
      description: "Form sentences about a wider variety of topics",
      order: 5,
    },
    {
      title: "Section 6",
      level: "Intermediate B1",
      description: "Communicate more complex ideas in conversations",
      order: 6,
    },
    {
      title: "Section 7",
      level: "Upper Intermediate B2",
      description: "Talk about abstract feelings and opinions",
      order: 7,
    },
    {
      title: "Section 8",
      level: "Upper Intermediate B2",
      description: "Converse confidently, even about some specialized topics.",
      order: 8,
    },
  ]);
  console.log("Populating Sections Finished");
};

const courseSectionsPopulation = async () => {
  console.log("Populating Course Sections.....");
  //SECTIONS FOR COURSE.ID=1
  await db.insert(schema.courseSections).values([
    {
      id: 1, //COURSE 1, SECTION 1
      courseId: 1,
      sectionId: 1,
      order: 1,
    },
    {
      id: 2, //COURSE 1, SECTION 2
      courseId: 1,
      sectionId: 2,
      order: 2,
    },
    {
      id: 3, //COURSE 1, SECTION 3
      courseId: 1,
      sectionId: 3,
      order: 3,
    },
    {
      id: 4, //COURSE 1, SECTION 4
      courseId: 1,
      sectionId: 4,
      order: 4,
    },
    {
      id: 5, //COURSE 1, SECTION 5
      courseId: 1,
      sectionId: 5,
      order: 5,
    },
    {
      id: 6, //COURSE 1, SECTION 6
      courseId: 1,
      sectionId: 6,
      order: 6,
    },
    {
      id: 7, //COURSE 1, SECTION 7
      courseId: 1,
      sectionId: 1,
      order: 7,
    },
    {
      id: 8, //COURSE 1, SECTION 8
      courseId: 1,
      sectionId: 2,
      order: 8,
    },
  ]);

  //SECTIONS FOR COURSE.ID=2
  await db.insert(schema.courseSections).values([
    {
      id: 9, //COURSE 2, SECTION 1
      courseId: 2,
      sectionId: 1,
      order: 9,
    },
    {
      id: 10, //COURSE 2, SECTION 2
      courseId: 2,
      sectionId: 2,
      order: 10,
    },
    {
      id: 11, //COURSE 2, SECTION 3
      courseId: 2,
      sectionId: 3,
      order: 11,
    },
    {
      id: 12, //COURSE 2, SECTION 4
      courseId: 2,
      sectionId: 4,
      order: 12,
    },
    {
      id: 13, //COURSE 2, SECTION 5
      courseId: 2,
      sectionId: 5,
      order: 13,
    },
    {
      id: 14, //COURSE 2, SECTION 6
      courseId: 2,
      sectionId: 6,
      order: 14,
    },
    {
      id: 15, //COURSE 2, SECTION 7
      courseId: 2,
      sectionId: 7,
      order: 15,
    },
    {
      id: 16, //COURSE 2, SECTION 8
      courseId: 2,
      sectionId: 8,
      order: 16,
    },
  ]);
  console.log("Populating Course Sections Finished");
};
const unitsPopulation = async () => {
  console.log("Populating Units.....");
  // Populating units for French Section 1
  await db.insert(schema.units).values([
    {
      id: 1,
      title: "Unit 1",
      description: "Learn the basics",
      courseSectionId: 1, //French, Section 1
      order: 1,
    },
    {
      id: 2,
      title: "Unit 2",
      description: "Learn greetings",
      courseSectionId: 1, //French
      order: 2,
    },
    {
      id: 3,
      title: "Unit 3",
      description: "Learn to introduce yourself",
      courseSectionId: 1, //French
      order: 3,
    },
    {
      id: 4,
      title: "Unit 4",
      description: "Learn the present tense",
      courseSectionId: 1, //French
      order: 4,
    },
    {
      id: 5,
      title: "Unit 5",
      description: "Learn to get around town",
      courseSectionId: 1, //French
      order: 5,
    },
    {
      id: 6,
      title: "Unit 6",
      description: "Learn to refer to family members",
      courseSectionId: 1, //French
      order: 6,
    },
  ]);

  // Populating units for Spanish Section 1
  await db.insert(schema.units).values([
    {
      id: 1,
      title: "Unit 1",
      description: "Learn the basics",
      courseSectionId: 9, //Spanish, Section 1
      order: 1,
    },
    {
      id: 2,
      title: "Unit 2",
      description: "Learn greetings",
      courseSectionId: 9, //Spanish, Section 1
      order: 2,
    },
    {
      id: 3,
      title: "Unit 3",
      description: "Learn to introduce yourself",
      courseSectionId: 9, //Spanish, Section 1
      order: 3,
    },
    {
      id: 4,
      title: "Unit 4",
      description: "Learn the present tense",
      courseSectionId: 9, //Spanish, Section 1
      order: 4,
    },
    {
      id: 5,
      title: "Unit 5",
      description: "Learn to get around town",
      courseSectionId: 9, //Spanish, Section 1
      order: 5,
    },
    {
      id: 6,
      title: "Unit 6",
      description: "Learn to refer to family members",
      courseSectionId: 9, //Spanish, Section 1
      order: 6,
    },
  ]);
  console.log("Populating Units Finished");
};
const lessonsPopulation = async () => {
  console.log("Populating Lessons.....");
  // Add lesson
  await db.insert(schema.lessons).values([
    {
      id: 1,
      title: "Identifying people and object",
      unitId: 1,
      order: 1,
    },
    {
      id: 2,
      title: "Understanding gender nouns",
      unitId: 1,
      order: 2,
    },
    {
      id: 3,
      title: "Using verbs",
      unitId: 1,
      order: 3,
    },
    {
      id: 4,
      title: "Review",
      unitId: 1,
      order: 4,
    },
  ]);
  await db.insert(schema.lessons).values([
    {
      id: 5,
      title: "Salutations",
      unitId: 2,
      order: 5,
    },
    {
      id: 6,
      title: "Basic Greetings",
      unitId: 2,
      order: 6,
    },
    {
      id: 7,
      title: "Meeting next time",
      unitId: 2,
      order: 7,
    },
    {
      id: 8,
      title: "First time meeting",
      unitId: 2,
      order: 8,
    },
    {
      id: 9,
      title: "Review",
      unitId: 2,
      order: 9,
    },
  ]);
  console.log("Populating Lessons Finished");
};
const challengesPopulation = async () => {
  console.log("Populating Challenges.....");
  //challenges 1-5 for lesson.id =1
  await db.insert(schema.challenges).values([
    {
      id: 1,
      lessonId: 1, // Identifying people and object
      type: "SELECT",
      order: 1,
      question: 'Which one of these is "the man"?',
    },
    {
      id: 2,
      lessonId: 1, // Identifying people and object
      type: "SELECT",
      order: 2,
      question: 'Which one of these is "the robot"?',
    },
    {
      id: 3,
      lessonId: 1, // Identifying people and object
      type: "SELECT",
      order: 3,
      question: 'Which one of these is "the woman"?',
    },
    {
      id: 4,
      lessonId: 1, // Identifying people and object
      type: "ASSIST",
      order: 4,
      question: '"the man"',
    },
    {
      id: 5,
      lessonId: 1, // Identifying people and object
      type: "ASSIST",
      order: 5,
      question: '"the woman"',
    },
  ]);

  //challenges 6-10 for lesson.id=1
  await db.insert(schema.challenges).values([
    {
      id: 6,
      lessonId: 1, // Identifying people and object
      type: "ASSIST",
      order: 6,
      question: '"the robot"',
    },
    {
      id: 7,
      lessonId: 1, // Identifying people and object
      type: "ASSIST",
      order: 7,
      question: '"the boy"',
    },
    {
      id: 8,
      lessonId: 1, // Identifying people and object
      type: "ASSIST",
      order: 8,
      question: '"the girl"',
    },
    {
      id: 9,
      lessonId: 1, // Identifying people and object
      type: "ASSIST",
      order: 9,
      question: '"the dog"',
    },
    {
      id: 10,
      lessonId: 1, // Identifying people and object
      type: "ASSIST",
      order: 10,
      question: '"the cat"',
    },
  ]);

  //challenges 11-17 for lesson id =2
  await db.insert(schema.challenges).values([
    {
      id: 11,
      lessonId: 2, // Understanding gender nouns
      type: "SELECT",
      order: 11,
      question: 'Which one of these means "a man"?',
    },
    {
      id: 12,
      lessonId: 2, // Understanding gender nouns
      type: "SELECT",
      order: 12,
      question: 'Which one of these means "a woman"?',
    },
    {
      id: 13,
      lessonId: 2, // Understanding gender nouns
      type: "ASSIST",
      order: 13,
      question: '"a man"?',
    },
    {
      id: 14,
      lessonId: 2, // Understanding gender nouns
      type: "SELECT",
      order: 14,
      question: 'Which one of these is "a girl"?',
    },
    {
      id: 15,
      lessonId: 2, // Understanding gender nouns
      type: "SELECT",
      order: 15,
      question: 'Which one of these is "a boy"?',
    },
    {
      id: 16,
      lessonId: 2, // Understanding gender nouns
      type: "ASSIST",
      order: 16,
      question: '"a girl"?',
    },
    {
      id: 17,
      lessonId: 2, // Understanding gender nouns
      type: "ASSIST",
      order: 17,
      question: '"a boy"?',
    },
    {
      id: 18,
      lessonId: 2, // Understanding gender nouns
      type: "SELECT",
      order: 18,
      question: 'Which one of these is "a bread"?',
    },
    {
      id: 19,
      lessonId: 2, // Understanding gender nouns
      type: "ASSIST",
      order: 19,
      question: '"an bread"?',
    },
    {
      id: 20,
      lessonId: 2, // Understanding gender nouns
      type: "ASSIST",
      order: 20,
      question: 'Which one of these is "an apple"?',
    },
    {
      id: 21,
      lessonId: 2, // Understanding gender nouns
      type: "SELECT",
      order: 21,
      question: 'Which one of these is "an apple"?',
    },
    {
      id: 22,
      lessonId: 2, // Understanding gender nouns
      type: "ASSIST",
      order: 22,
      question: '"a dog"?',
    },
  ]);

  //challenges 21-22 for lesson id =2
  await db.insert(schema.challenges).values([
    {
      id: 21,
      lessonId: 2, // Understanding gender nouns
      type: "SELECT",
      order: 21,
      question: 'Which one of these is "an apple"?',
    },
    {
      id: 22,
      lessonId: 2, // Understanding gender nouns
      type: "ASSIST",
      order: 22,
      question: '"a dog"?',
    },
  ]);

  console.log("Populating Challenges Finished");
};
const challengeOptionsPopulation = async () => {
  console.log("Populating Challenge Options.....");
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

  // options for challenge.id=6, lesson.id =1
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
  ]);

  // options for challenge.id=7, lesson.id =1
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
  ]);
  // options for challenge.id=8 lesson.id=1
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
  ]);

  // options for challenge.id=9, lesson.id =1
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
  ]);

  // options for challenge.id=10, lesson.id =1
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
  ]);

  // options for challenge.id=11, lesson.id =2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 11, // Which one of these means "a man"?
      imageSrc: "/characters/man.svg",
      correct: true,
      text: "un homme",
      audioSrc: "/audio/fr_a_man.mp3",
    },
    {
      challengeId: 11,
      imageSrc: "/characters/woman.svg",
      correct: false,
      text: "une femme",
      audioSrc: "/audio/fr_a_woman.mp3",
    },
    {
      challengeId: 11,
      imageSrc: "/characters/robot.svg",
      correct: false,
      text: "un robot",
      audioSrc: "/audio/fr_a_robot.mp3",
    },
  ]);

  // options for challenge.id=12, lesson.id =2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 12, // Which one of these means "a woman"?
      imageSrc: "/characters/man.svg",
      correct: false,
      text: "un homme",
      audioSrc: "/audio/fr_a_man.mp3",
    },
    {
      challengeId: 12,
      imageSrc: "/characters/woman.svg",
      correct: true,
      text: "une femme",
      audioSrc: "/audio/fr_a_woman.mp3",
    },
    {
      challengeId: 12,
      imageSrc: "/characters/robot.svg",
      correct: false,
      text: "un robot",
      audioSrc: "/audio/fr_a_robot.mp3",
    },
  ]);

  //options for challenge.id=13, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 13, //  "a man"
      correct: true,
      text: "un homme",
      audioSrc: "/audio/fr_man.mp3",
    },
    {
      challengeId: 13,
      correct: false,
      text: "une femme",
      audioSrc: "/audio/fr_woman.mp3",
    },
    {
      challengeId: 13,
      correct: false,
      text: "un robot",
      audioSrc: "/audio/fr_robot.mp3",
    },
  ]);

  //options for challenge.id=14, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 14, //Which one of these is "a girl"?
      imageSrc: "/characters/robot.svg",
      correct: false,
      text: "un robot",
      audioSrc: "/audio/fr_a_robot.mp3",
    },
    {
      challengeId: 14,
      imageSrc: "/characters/boy.svg",
      correct: false,
      text: "un garçon",
      audioSrc: "/audio/fr_a_boy.mp3",
    },
    {
      challengeId: 14,
      imageSrc: "/characters/girl.svg",
      correct: true,
      text: "une fille",
      audioSrc: "/audio/fr_a_girl.mp3",
    },
  ]);

  //options for challenge.id=15, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 14,
      imageSrc: "/characters/boy.svg",
      correct: false,
      text: "un garçon",
      audioSrc: "/audio/fr_a_boy.mp3",
    },
    {
      challengeId: 14, //Which one of these is "a girl"?
      imageSrc: "/characters/robot.svg",
      correct: false,
      text: "un robot",
      audioSrc: "/audio/fr_a_robot.mp3",
    },
    {
      challengeId: 14,
      imageSrc: "/characters/girl.svg",
      correct: true,
      text: "une fille",
      audioSrc: "/audio/fr_a_girl.mp3",
    },
  ]);

  //options for challenge.id=16, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 16, // "the girl"?
      correct: false,
      text: "un homme",
      audioSrc: "/audio/fr_a_man.mp3",
    },
    {
      challengeId: 16,
      correct: false,
      text: "une femme",
      audioSrc: "/audio/fr_a_woman.mp3",
    },
    {
      challengeId: 16,
      correct: true,
      text: "une fille",
      audioSrc: "/audio/fr_a_girl.mp3",
    },
  ]);

  //options for challenge.id=17, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 17, //  "the boy"?
      correct: false,
      text: "un homme",
      audioSrc: "/audio/fr_a_man.mp3",
    },
    {
      challengeId: 17,
      correct: true,
      text: "un garçon",
      audioSrc: "/audio/fr_a_boy.mp3",
    },
    {
      challengeId: 17,
      correct: false,
      text: "un robot",
      audioSrc: "/audio/fr_a_robot.mp3",
    },
  ]);

  //options for challenge.id=18, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 18, // Which one of these is "a bread"?
      imageSrc: "/characters/bread.svg",
      correct: true,
      text: "un pain",
      audioSrc: "/audio/fr_a_bread.mp3",
    },
    {
      challengeId: 18,
      imageSrc: "/characters/apple.svg",
      correct: false,
      text: "une pomme",
      audioSrc: "/audio/fr_an_apple.mp3",
    },
    {
      challengeId: 18,
      imageSrc: "/characters/banana.svg",
      correct: false,
      text: "une banane",
      audioSrc: "/audio/fr_a_banana.mp3",
    },
  ]);

  //options for challenge.id=19, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 19, // a bread"
      correct: true,
      text: "un pain",
      audioSrc: "/audio/fr_a_bread.mp3",
    },
    {
      challengeId: 19,
      correct: false,
      text: "une pomme",
      audioSrc: "/audio/fr_an_apple.mp3",
    },
    {
      challengeId: 19,
      correct: false,
      text: "une banane",
      audioSrc: "/audio/fr_a_banana.mp3",
    },
  ]);

  //options for challenge.id=20, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 20, // Which one of these is "an apple"?
      imageSrc: "/characters/bread.svg",
      correct: false,
      text: "un pain",
      audioSrc: "/audio/fr_a_bread.mp3",
    },
    {
      challengeId: 20,
      imageSrc: "/characters/apple.svg",
      correct: true,
      text: "une pomme",
      audioSrc: "/audio/fr_an_apple.mp3",
    },
    {
      challengeId: 20,
      imageSrc: "/characters/banana.svg",
      correct: false,
      text: "une banane",
      audioSrc: "/audio/fr_a_banana.mp3",
    },
  ]);

  //options for challenge.id=21, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 21, // an apple
      correct: false,
      text: "un pain",
      audioSrc: "/audio/fr_a_bread.mp3",
    },
    {
      challengeId: 21,
      correct: true,
      text: "une pomme",
      audioSrc: "/audio/fr_an_apple.mp3",
    },
    {
      challengeId: 21,
      correct: false,
      text: "une banane",
      audioSrc: "/audio/fr_a_banana.mp3",
    },
  ]);

  //options for challenge.id=22, lesson.id=2
  await db.insert(schema.challengeOptions).values([
    {
      challengeId: 22, // a dog
      correct: false,
      text: "un cheval",
      audioSrc: "/audio/fr_a_horse.mp3",
    },
    {
      challengeId: 22,
      correct: true,
      text: "un chien",
      audioSrc: "/audio/fr_a_dog.mp3",
    },
    {
      challengeId: 22,
      correct: false,
      text: "un zombie",
      audioSrc: "/audio/fr_a_zombie.mp3",
    },
  ]);
  console.log("Populating Challenge Options Finished");
};

const main = async () => {
  try {
    await reset();
    console.log("Seeding Database.....");
    await coursesPopulation();
    await sectionsPopulation();
    await courseSectionsPopulation();
    await unitsPopulation();
    await lessonsPopulation();
    await challengesPopulation();
    await challengeOptionsPopulation();
    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
  }
};

main();
