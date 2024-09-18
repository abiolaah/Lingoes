import { cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq } from "drizzle-orm";
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
  const data = await db.query.courseSections.findFirst({
    where: eq(courseSections.id, sectionId),
    with: {
      section: true,
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
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
  return normalizedData;
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

// Get detailed information for a course section, including progress and completion status May need to be deleted
export const getCourseSectionDetails = cache(async (sectionId: number) => {
  const { userId } = await auth();
  if (!userId) return null;

  // Retrieve section info
  const sectionInfo = await db.query.courseSections.findFirst({
    where: eq(courseSections.id, sectionId),
    with: {
      section: true,
      units: {
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
      },
    },
  });

  if (!sectionInfo) return [];

  //Extract title and level from teh related section
  const { title, level } = sectionInfo.section;

  // Calculate progress
  const totalUnits = sectionInfo.units.length;
  const totalChallenges = sectionInfo.units
    .flatMap((unit) => unit.lessons)
    .flatMap((lesson) => lesson.challenges).length;

  const completedChallenges = sectionInfo.units
    .flatMap((unit) => unit.lessons)
    .flatMap((lesson) => lesson.challenges)
    .filter(
      (challenge) =>
        challenge.challengeProgress &&
        challenge.challengeProgress.every((progress) => progress.completed)
    ).length;

  const progressPercentage =
    totalChallenges === 0
      ? 0
      : Math.round((completedChallenges / totalChallenges) * 100);

  const isCompleted = completedChallenges === totalChallenges;

  return {
    title,
    level,
    totalUnits,
    progressPercentage,
    isCompleted,
  };
});

// Get progress of a course section for a specific user
export const getSectionProgress = cache(async (sectionId: number) => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const completedUnits = await getCompletedUnits(sectionId, userId);
  const totalUnits = await getTotalUnitsInSection(sectionId);

  const data = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.courseSectionId, sectionId),
      eq(sectionProgress.userId, userId)
    ),
    with: {
      section: true,
    },
  });

  const percentage = Math.round(completedUnits / totalUnits) * 100;

  const completed = percentage === 100;

  return {
    data,
    totalUnits,
    completedUnits,
    percentage,
    completed,
  };
});

// Get total number of units in a course section
export const getTotalUnitsInSection = cache(async (sectionId: number) => {
  const data = await db.query.units.findMany({
    where: eq(units.courseSectionId, sectionId),
  });

  return data.length;
});

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

    // Count units with all lessons having 100% completion
    const completedUnits = unitsWithCompletedLessons.filter((unit) => {
      return unit.lessons.every((lesson) => {
        return lesson.challenges.every((challenge) => {
          const completedChallenges = challenge.challengeProgress.every(
            (progress) => progress.completed
          );
          return completedChallenges;
        });
      });
    }).length;

    return completedUnits;
  }
);
