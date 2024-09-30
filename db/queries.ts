"use server";
import { cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq, inArray } from "drizzle-orm";
import {
  challengeProgress,
  challenges,
  courses,
  lessons,
  courseSections,
  sections,
  units,
  userProgress,
  userSubscription,
  sectionProgress,
} from "@/db/schema";

//Get user progress
export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

//Get all courses
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

//Get course by ID
export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      sections: {
        orderBy: (courseSections, { asc }) => [asc(courseSections.order)],
        with: {
          units: {
            orderBy: (units, { asc }) => [asc(units.order)],
            with: {
              lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
              },
            },
          },
        },
      },
    },
  });

  return data;
});

//Get Course progress
export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const courseSectionsData = await db.query.courseSections.findMany({
    where: eq(courseSections.courseId, userProgress.activeCourseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
            with: {
              challenges: {
                with: {
                  challengeProgress: {
                    where: eq(challengeProgress.userId, userId),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  //calculate total and completed units for each sections
  const progressData = await Promise.all(
    courseSectionsData.map(async (section) => {
      const totalUnits = await getTotalUnitsInSection(section.id);
      const completedUnits = await getCompletedUnits(section.id, userId);

      return {
        courseSectionId: section.id,
        totalUnits,
        completedUnits,
        completed: totalUnits === completedUnits, // Mark as completed if all units are completed
      };
    })
  );

  //   const sectionsInActiveCourse = await db.query.courseSections.findMany({
  //     orderBy: (courseSections, { asc }) => [asc(courseSections.order)],
  //     where: eq(courseSections.courseId, userProgress.activeCourseId),
  //     with: {
  //       units: {
  //         orderBy: (units, { asc }) => [asc(units.order)],
  //         with: {
  //           lessons: {
  //             orderBy: (lessons, { asc }) => [asc(lessons.order)],
  //             with: {
  //               units: true,
  //               challenges: {
  //                 with: {
  //                   challengeProgress: {
  //                     where: eq(challengeProgress.userId, userId),
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const unitsInSection = await db.query.units.findMany({
  //     orderBy: (units, { asc }) => [asc(units.order)],
  //     where: eq(units.courseSectionId, sectionsInActiveCourse),
  //     with: {
  //       lessons: {
  //         orderBy: (lessons, { asc }) => [asc(lessons.order)],
  //         with: {
  //           units: true,
  //           challenges: {
  //             with: {
  //               challengeProgress: {
  //                 where: eq(challengeProgress.userId, userId),
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  const firstUncompletedLesson = courseSectionsData
    .flatMap((section) => section.units)
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            (progress) => progress.completed === false
          )
        );
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
    courseSectionProgress: progressData,
  };
});

// Get all sections for a course
export const getCourseSections = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.courseSections.findMany({
    orderBy: (courseSections, { asc }) => [asc(courseSections.order)],
    where: eq(courseSections.courseId, userProgress.activeCourseId),
    with: {
      section: true,
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
            with: {
              challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                  challengeProgress: {
                    where: eq(challengeProgress.userId, userId),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
});

//Get section for a course by ID
export const getCourseSectionById = cache(async (sectionId: number) => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return {};
  }
  const data = await db.query.courseSections.findFirst({
    where: eq(courseSections.id, sectionId),
    with: {
      section: true,
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
            with: {
              challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                  challengeProgress: {
                    where: eq(challengeProgress.userId, userId),
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return data;
});

//Get all units for a course
export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.courseSections.findMany({
    where: eq(courseSections.courseId, userProgress.activeCourseId),
    with: {
      section: true,
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
            with: {
              challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                  challengeProgress: {
                    where: eq(challengeProgress.userId, userId),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // console.log("DATA", data);

  const normalizedData = data.flatMap((section) =>
    section.units.map((unit) => {
      const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
        //If there are no challenges, mark the lesson as not completed
        if (lesson.challenges.length === 0) {
          return { ...lesson, completed: false };
        }
        const allCompletedChallenges = lesson.challenges.every((challenge) => {
          return (
            challenge.challengeProgress &&
            challenge.challengeProgress.length > 0 &&
            challenge.challengeProgress.every((progress) => progress.completed)
          );
        });

        return { ...lesson, completed: allCompletedChallenges };
      });
      return { ...unit, lessons: lessonsWithCompletedStatus };
    })
  );
  // console.log("NORMALIZED DATA", normalizedData);
  return normalizedData;
});

//Get all units for a course by sectionId
export const getUnitsBySectionId = cache(async (sectionId: number) => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.courseSections.findFirst({
    where: and(
      eq(courseSections.courseId, userProgress.activeCourseId),
      eq(courseSections.id, sectionId)
    ),
    with: {
      section: true,
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
            with: {
              challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                  challengeProgress: {
                    where: eq(challengeProgress.userId, userId),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // console.log("DATA", data);

  if (!data) return null;

  const normalizedData = data.units.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      // Check if all challenges in a lesson are completed
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return {
        ...lesson,
        completed:
          lesson.challenges.length === 0 ? false : allCompletedChallenges,
      };
    });

    return {
      ...unit,
      sectionTitle: data.section.title,
      lessons: lessonsWithCompletedStatus,
    };
  });
  // console.log("NORMALIZED DATA", normalizedData);
  return normalizedData;
});

//Get sectionTitle by section ID
export const getSectionTitleBySectionId = cache(async (sectionId: number) => {
  const data = await db.query.courseSections.findFirst({
    where: eq(courseSections.id, sectionId),
    with: {
      section: true,
    },
  });

  if (!data) return;

  return {
    sectionTitle: data.section.title,
  };
});

//Get a specific lesson by ID or the active lesson
export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });
  return { ...data, challenges: normalizedChallenges };
});

// Get the lesson completion percentage
export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();
  if (!courseProgress?.activeLessonId) {
    return 0;
  }
  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );

  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );

  return percentage;
});

// Get user subscription status
export const getUserSubscription = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!data) return null;

  const DAY_IN_MS = 86_400_000;
  const isActive =
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive,
  };
});

// Get top 10 users based on points
export const getTopTenUsers = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });

  return data;
});

// Get progress of a course section for a specific user
export const getSectionProgress = cache(async (sectionId: number) => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const data = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.courseSectionId, sectionId),
      eq(sectionProgress.userId, userId)
    ),
    with: {
      section: true,
    },
  });

  return data;
});

// Get total number of units in a course section
export const getTotalUnitsInSection = cache(async (sectionId: number) => {
  const data = await db.query.units.findMany({
    where: eq(units.courseSectionId, sectionId),
  });

  return data.length;
});

// Get total number of completed units in a course section
export const getCompletedUnits = cache(
  async (courseSectionId: number, userId: string) => {
    // const {userId} = await auth();
    const unitsWithCompletedLessons = await db.query.units.findMany({
      where: eq(units.courseSectionId, courseSectionId),
      with: {
        lessons: {
          with: {
            challenges: {
              with: {
                challengeProgress: {
                  where: eq(challengeProgress.userId, userId),
                },
              },
            },
          },
        },
      },
    });
    // console.log(
    //   "UNITS WITH COMPLETED",
    //   unitsWithCompletedLessons[0].lessons[0].challenges
    // );

    // Count units with all lessons having 100% completion
    const completedUnits = unitsWithCompletedLessons.filter((unit) => {
      return (
        unit.lessons.length > 0 &&
        unit.lessons.every((lesson) => {
          return (
            lesson.challenges.length > 0 &&
            lesson.challenges.every((challenge) => {
              // Check if challengeProgress exists and is non-empty, and all progress entries are completed
              return (
                challenge.challengeProgress.length > 0 &&
                challenge.challengeProgress.every(
                  (progress) => progress.completed
                )
              );
            })
          );
        })
      );
    }).length;

    return completedUnits;
  }
);

// Get progress percentage of a course section
export const getSectionPercentage = cache(async (sectionId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const totalUnits = await getTotalUnitsInSection(sectionId);
  const completedUnits = await getCompletedUnits(sectionId, userId);

  const percentage =
    totalUnits === 0 && completedUnits === 0
      ? 0
      : Math.round(completedUnits / totalUnits) * 100;

  return percentage;
});

// Get the active of a course section
export const getSectionActiveStatus = cache(async (sectionId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const sections = await getCourseSections();

  if (!sections) return null;

  const activeSection = await db.query.courseSections.findFirst({
    where: eq(courseSections.id, sectionId),
    with: {
      section: true,
      sectionProgress: {
        where: and(
          eq(sectionProgress.userId, userId),
          eq(sectionProgress.completed, false)
        ),
      },
    },
  });

  return activeSection;
});

//Get the active status of a course section
export const getSectionActiveStatuses = cache(async (sectionId: number) => {
  const { userId } = await auth();
  if (!userId) return false;

  // Fetch all course sections
  const sections = await getCourseSections();
  if (!sections) return false;

  // Find the current section
  const currentSectionIndex = sections.findIndex(
    (section) => section.id === sectionId
  );
  if (currentSectionIndex === -1) return false;

  // If it's the first section, it's active by default
  if (currentSectionIndex === 0) return true;

  // Check if the previous section has been completed
  const previousSection = sections[currentSectionIndex - 1];
  const previousSectionProgress = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.userId, userId),
      eq(sectionProgress.courseSectionId, previousSection.id),
      eq(sectionProgress.completed, true)
    ),
  });

  if (!previousSectionProgress) return false;

  // Check if any challenge in the current section has been completed
  const challengeCompleted = await db
    .select()
    .from(challengeProgress)
    .where(
      and(
        inArray(
          challengeProgress.challengeId,
          db
            .select({ id: challenges.id })
            .from(challenges)
            .where(
              inArray(
                challenges.lessonId,
                db
                  .select({ id: lessons.id })
                  .from(lessons)
                  .where(
                    inArray(
                      lessons.unitId,
                      db
                        .select({ id: units.id })
                        .from(units)
                        .where(eq(units.courseSectionId, sectionId))
                    )
                  )
              )
            )
        ),
        eq(challengeProgress.userId, userId),
        eq(challengeProgress.completed, true)
      )
    )
    .limit(1);

  // Return true if either previous section is completed or a challenge in this section is completed
  return !!challengeCompleted;
});
// Get the active of a course section
export const getSectionCompletedStatus = cache(async (sectionId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  //Create variable for boolean result
  let completed = false;

  // Count total units in the section
  const totalUnits = await getTotalUnitsInSection(sectionId);

  // Count completed units in the section for the user
  const completedUnits = await getCompletedUnits(sectionId, userId);

  // Compare total units and completed units
  if (totalUnits === 0 && completedUnits === 0) {
    completed = false;
  }
  completed =
    totalUnits !== 0 && completedUnits !== 0 && totalUnits === completedUnits;

  return completed;
});

// Get the summary Info of all course section
export const getCourseSectionInfo = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const sections = await getCourseSections();

  if (!sections) return;

  const sectionProgressArray = [];

  for (let i = 0; i < sections.length; i++) {
    //Set an object for section progress
    const sectionProgressObject = {};

    //Get id of a section
    const id = sections[i].id;
    Object.assign(sectionProgressObject, { sectionId: id });

    //Get title of a section
    const title = sections[i].section.title;
    Object.assign(sectionProgressObject, { title: title });

    //Get level of a section
    const level = sections[i].section.level;
    Object.assign(sectionProgressObject, { level: level });

    //Get sectionPhrase and assign to object
    const phrase = sections[i].sectionPhrase;
    Object.assign(sectionProgressObject, { sectionPhrase: phrase });

    //Get sectionPhrase and assign to object
    /*  const courseId = sections[i].courseId;
    Object.assign(sectionProgressObject, { courseId: courseId }); */

    //Get total units in a section
    const totalUnits = await getTotalUnitsInSection(id);
    Object.assign(sectionProgressObject, { totalUnits: totalUnits });

    //Get completed units in a section
    const completedUnits = await getCompletedUnits(id, userId);
    Object.assign(sectionProgressObject, { completedUnits: completedUnits });

    //Get progress percentage of a section
    const percentage = await getSectionPercentage(id);
    Object.assign(sectionProgressObject, { progress: percentage });

    //Get active status a section
    const active = await getSectionActiveStatuses(id);
    Object.assign(sectionProgressObject, { active: active });

    //Get completed status a section
    const completed = await getSectionCompletedStatus(id);
    Object.assign(sectionProgressObject, { completed: completed });

    //Push object into an array
    sectionProgressArray.push(sectionProgressObject);
  }
  // console.log("SECTION ARRAY", sectionProgressArray);

  return sectionProgressArray;
});

// Get the summary Info of a course section
export const getACourseSectionInfo = cache(async (sectionId: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const sectionData = await db.query.courseSections.findFirst({
    where: eq(courseSections.id, sectionId),
    with: {
      section: true,
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
            with: {
              challenges: {
                with: {
                  challengeProgress: {
                    where: eq(challengeProgress.userId, userId),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Ensure sectionData is valid before accessing properties
  if (!sectionData || !sectionData.section) {
    return null;
  }

  // Extract section info
  const { id, sectionPhrase, section } = sectionData;
  const { title, level, description } = section;

  // Calculate total units and completed units
  const totalUnits = await getTotalUnitsInSection(id);
  const completedUnits = await getCompletedUnits(id, userId);
  const progressPercentage = await getSectionPercentage(id);
  const active = await getSectionActiveStatuses(id);
  const completed = await getSectionCompletedStatus(id);

  return {
    sectionId: id,
    title,
    level,
    sectionPhrase,
    description,
    totalUnits,
    completedUnits,
    progress: progressPercentage,
    active,
    completed,
  };
});
