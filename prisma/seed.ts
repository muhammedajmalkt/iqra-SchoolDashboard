import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { createClerkClient } from "@clerk/backend";
import { config } from "dotenv";
config();

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function createAdminUser() {
  try {
    const existingUsers = await clerk.users.getUserList({
      username: ["anfaskaloor"],
    });

    if (existingUsers.data.length > 0) {
      await clerk.users.deleteUser(existingUsers.data[0].id);
      console.log("Existing user deleted");
    }

    const user = await clerk.users.createUser({
      username: "anfaskaloor",
      password: "SecureAdmin123!",
      publicMetadata: { role: "admin" },
    });

    await prisma.admin.deleteMany()
    // ADMIN
    await prisma.admin.create({
      data: {
        id: "1",
        username: "anfaskaloor",
      },
    });

    console.log("Admin user created:", user.id);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

async function main() {
  await createAdminUser();
  // await tempSeed();

  await prisma.grade.deleteMany()
  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // FEE TYPES
  const feeTypes = [
    {
      name: "Tuition",
      description: "Monthly tuition fee",
      defaultAmount: 150.0,
    },
    {
      name: "Lab Fee",
      description: "Science lab maintenance fee",
      defaultAmount: 50.0,
    },
    {
      name: "Library Fee",
      description: "Library membership and maintenance",
      defaultAmount: 30.0,
    },
    {
      name: "Transport",
      description: "School bus fee",
      defaultAmount: 75.0,
    },
  ];

  await prisma.feeType.deleteMany()
  for (const feeType of feeTypes) {
    await prisma.feeType.create({ data: feeType });
  }
}

async function tempSeed() {
  // Clear existing data (be careful with this in production!)
  await prisma.$transaction([
    prisma.incident.deleteMany(),
    prisma.behavior.deleteMany(),
    prisma.announcementView.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.event.deleteMany(),
    prisma.result.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.exam.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.fee.deleteMany(),
    prisma.feeType.deleteMany(),
    prisma.student.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.class.deleteMany(),
    prisma.grade.deleteMany(),
  ]);

  // Create Grades
  const grades = await prisma.$transaction([
    prisma.grade.create({ data: { level: 9 } }),
    prisma.grade.create({ data: { level: 10 } }),
    prisma.grade.create({ data: { level: 11 } }),
  ]);

  // Create Subjects
  const subjects = await prisma.$transaction([
    prisma.subject.create({ data: { name: "Mathematics" } }),
    prisma.subject.create({ data: { name: "Science" } }),
    prisma.subject.create({ data: { name: "English" } }),
    prisma.subject.create({ data: { name: "History" } }),
  ]);

  // Create Teachers
  const teacher1 = await clerk.users.createUser({
    username: "teacher1",
    password: "SecureAdmin123!",
    firstName: "John",
    lastName: "Smith",
    emailAddress: ["john.smith@school.edu"],
    publicMetadata: { role: "teacher" },
  });

  const teacher2 = await clerk.users.createUser({
    username: "teacher2",
    password: "SecureAdmin123!",
    firstName: "Sarah",
    lastName: "Johnson",
    emailAddress: ["sarah.johnson@school.edu"],
    publicMetadata: { role: "teacher" },
  });

  const teacher3 = await clerk.users.createUser({
    username: "teacher3",
    password: "SecureAdmin123!",
    firstName: "Michael",
    lastName: "Brown",
    emailAddress: ["michael.brown@school.edu"],
    publicMetadata: { role: "teacher" },
  });

  await prisma.$transaction([
    prisma.teacher.create({
      data: {
        id: teacher1.id,
        username: "teacher1",
        name: "John",
        surname: "Smith",
        email: "john.smith@school.edu",
        phone: "555-0101",
        address: "123 Teacher St, Education City",
        bloodType: "A+",
        sex: "MALE",
        birthday: new Date("1980-05-15"),
        subjects: {
          connect: [{ id: subjects[0].id }, { id: subjects[1].id }], // Math and Science
        },
      },
    }),
    prisma.teacher.create({
      data: {
        id: teacher2.id,
        username: "teacher2",
        name: "Sarah",
        surname: "Johnson",
        email: "sarah.johnson@school.edu",
        phone: "555-0102",
        address: "456 Educator Ave, Education City",
        bloodType: "B+",
        sex: "FEMALE",
        birthday: new Date("1985-08-22"),
        subjects: {
          connect: [{ id: subjects[2].id }], // English
        },
      },
    }),
    prisma.teacher.create({
      data: {
        id: teacher3.id,
        username: "teacher3",
        name: "Michael",
        surname: "Brown",
        email: "michael.brown@school.edu",
        phone: "555-0103",
        address: "789 Professor Blvd, Education City",
        bloodType: "O+",
        sex: "MALE",
        birthday: new Date("1975-11-30"),
        subjects: {
          connect: [{ id: subjects[3].id }], // History
        },
      },
    }),
  ]);

  // Create Parents (each will have 1-2 children)
  const parent1 = await clerk.users.createUser({
    username: "parent1",
    password: "SecureAdmin123!",
    firstName: "Robert",
    lastName: "Williams",
    emailAddress: ["robert.williams@example.com"],
    publicMetadata: { role: "parent" },
  });

  const parent2 = await clerk.users.createUser({
    username: "parent2",
    password: "SecureAdmin123!",
    firstName: "Jennifer",
    lastName: "Davis",
    emailAddress: ["jennifer.davis@example.com"],
    publicMetadata: { role: "parent" },
  });

  const parent3 = await clerk.users.createUser({
    username: "parent3",
    password: "SecureAdmin123!",
    firstName: "Thomas",
    lastName: "Miller",
    emailAddress: ["thomas.miller@example.com"],
    publicMetadata: { role: "parent" },
  });

  const parent4 = await clerk.users.createUser({
    username: "parent4",
    password: "SecureAdmin123!",
    firstName: "Lisa",
    lastName: "Wilson",
    emailAddress: ["lisa.wilson@example.com"],
    publicMetadata: { role: "parent" },
  });

  await prisma.$transaction([
    prisma.parent.create({
      data: {
        id: parent1.id,
        username: "parent1",
        name: "Robert",
        surname: "Williams",
        email: "robert.williams@example.com",
        phone: "555-0201",
        address: "101 Parent Lane, Family Town",
      },
    }),
    prisma.parent.create({
      data: {
        id: parent2.id,
        username: "parent2",
        name: "Jennifer",
        surname: "Davis",
        email: "jennifer.davis@example.com",
        phone: "555-0202",
        address: "202 Guardian Ave, Family Town",
      },
    }),
    prisma.parent.create({
      data: {
        id: parent3.id,
        username: "parent3",
        name: "Thomas",
        surname: "Miller",
        email: "thomas.miller@example.com",
        phone: "555-0203",
        address: "303 Caregiver St, Family Town",
      },
    }),
    prisma.parent.create({
      data: {
        id: parent4.id,
        username: "parent4",
        name: "Lisa",
        surname: "Wilson",
        email: "lisa.wilson@example.com",
        phone: "555-0204",
        address: "404 Family Rd, Family Town",
      },
    }),
  ]);

  // Create Classes (each supervised by one teacher)
  const classes = await prisma.$transaction([
    prisma.class.create({
      data: {
        name: "9-A",
        capacity: 30,
        supervisorId: teacher1.id, // Teacher 1 supervises this class
        gradeId: grades[0].id, // Grade 9
      },
    }),
    prisma.class.create({
      data: {
        name: "10-B",
        capacity: 25,
        supervisorId: teacher2.id, // Teacher 2 supervises this class
        gradeId: grades[1].id, // Grade 10
      },
    }),
    prisma.class.create({
      data: {
        name: "11-C",
        capacity: 20,
        supervisorId: teacher3.id, // Teacher 3 supervises this class
        gradeId: grades[2].id, // Grade 11
      },
    }),
  ]);

  // Create Students (ensuring each teacher has 2+ students and parents have 1-2 children)
  const student1 = await clerk.users.createUser({
    username: "student1",
    password: "SecureAdmin123!",
    firstName: "Emily",
    lastName: "Williams",
    emailAddress: ["emily.williams@school.edu"],
    publicMetadata: { role: "student" },
  });

  const student2 = await clerk.users.createUser({
    username: "student2",
    password: "SecureAdmin123!",
    firstName: "James",
    lastName: "Davis",
    emailAddress: ["james.davis@school.edu"],
    publicMetadata: { role: "student" },
  });

  const student3 = await clerk.users.createUser({
    username: "student3",
    password: "SecureAdmin123!",
    firstName: "Sophia",
    lastName: "Miller",
    emailAddress: ["sophia.miller@school.edu"],
    publicMetadata: { role: "student" },
  });

  const student4 = await clerk.users.createUser({
    username: "student4",
    password: "SecureAdmin123!",
    firstName: "Daniel",
    lastName: "Wilson",
    emailAddress: ["daniel.wilson@school.edu"],
    publicMetadata: { role: "student" },
  });

  const student5 = await clerk.users.createUser({
    username: "student5",
    password: "SecureAdmin123!",
    firstName: "Olivia",
    lastName: "Williams",
    emailAddress: ["olivia.williams@school.edu"],
    publicMetadata: { role: "student" },
  });

  const student6 = await clerk.users.createUser({
    username: "student6",
    password: "SecureAdmin123!",
    firstName: "Ethan",
    lastName: "Johnson",
    emailAddress: ["ethan.johnson@school.edu"],
    publicMetadata: { role: "student" },
  });

  await prisma.$transaction([
    // Teacher 1's students (3 students)
    prisma.student.create({
      data: {
        id: student1.id,
        username: "student1",
        name: "Emily",
        surname: "Williams",
        email: "emily.williams@school.edu",
        phone: "555-0301",
        address: "101 Student Lane, Education City",
        img: "https://example.com/student1.jpg",
        bloodType: "A+",
        sex: "FEMALE",
        birthday: new Date("2008-03-10"),
        classId: classes[0].id, // Class supervised by Teacher 1
        gradeId: grades[0].id,
        parentId: parent1.id, // Parent 1 has 2 children
        rollNo: 1,
      },
    }),
    prisma.student.create({
      data: {
        id: student5.id,
        username: "student5",
        name: "Olivia",
        surname: "Williams",
        email: "olivia.williams@school.edu",
        phone: "555-0305",
        address: "505 Student Ave, Education City",
        img: "https://example.com/student5.jpg",
        bloodType: "A-",
        sex: "FEMALE",
        birthday: new Date("2008-07-15"),
        classId: classes[0].id, // Class supervised by Teacher 1
        gradeId: grades[0].id,
        parentId: parent1.id, // Parent 1 has 2 children
        rollNo: 2,
      },
    }),
    prisma.student.create({
      data: {
        id: student2.id,
        username: "student2",
        name: "James",
        surname: "Davis",
        email: "james.davis@school.edu",
        phone: "555-0302",
        address: "202 Learner Ave, Education City",
        img: "https://example.com/student2.jpg",
        bloodType: "B+",
        sex: "MALE",
        birthday: new Date("2007-07-15"),
        classId: classes[0].id, // Class supervised by Teacher 1
        gradeId: grades[0].id,
        parentId: parent2.id, // Parent 2 has 1 child
        rollNo: 3,
      },
    }),

    // Teacher 2's students (2 students)
    prisma.student.create({
      data: {
        id: student3.id,
        username: "student3",
        name: "Sophia",
        surname: "Miller",
        email: "sophia.miller@school.edu",
        phone: "555-0303",
        address: "303 Scholar St, Education City",
        img: "https://example.com/student3.jpg",
        bloodType: "O+",
        sex: "FEMALE",
        birthday: new Date("2006-11-20"),
        classId: classes[1].id, // Class supervised by Teacher 2
        gradeId: grades[1].id,
        parentId: parent3.id, // Parent 3 has 1 child
        rollNo: 1,
      },
    }),
    prisma.student.create({
      data: {
        id: student6.id,
        username: "student6",
        name: "Ethan",
        surname: "Johnson",
        email: "ethan.johnson@school.edu",
        phone: "555-0306",
        address: "606 Learner Blvd, Education City",
        img: "https://example.com/student6.jpg",
        bloodType: "AB+",
        sex: "MALE",
        birthday: new Date("2006-05-22"),
        classId: classes[1].id, // Class supervised by Teacher 2
        gradeId: grades[1].id,
        parentId: parent4.id, // Parent 4 has 1 child
        rollNo: 2,
      },
    }),

    // Teacher 3's students (1 student)
    prisma.student.create({
      data: {
        id: student4.id,
        username: "student4",
        name: "Daniel",
        surname: "Wilson",
        email: "daniel.wilson@school.edu",
        phone: "555-0304",
        address: "404 Scholar Rd, Education City",
        img: "https://example.com/student4.jpg",
        bloodType: "B-",
        sex: "MALE",
        birthday: new Date("2005-09-05"),
        classId: classes[2].id, // Class supervised by Teacher 3
        gradeId: grades[2].id,
        parentId: parent4.id, // Parent 4 has 2 children
        rollNo: 1,
      },
    }),
  ]);

  // Create Fee Types
  const feeTypes = await prisma.$transaction([
    prisma.feeType.create({
      data: {
        name: "Tuition Fee",
        description: "Annual tuition fee",
        defaultAmount: 1000,
      },
    }),
    prisma.feeType.create({
      data: {
        name: "Library Fee",
        description: "Library access fee",
        defaultAmount: 50,
      },
    }),
    prisma.feeType.create({
      data: {
        name: "Sports Fee",
        description: "Sports activities fee",
        defaultAmount: 75,
      },
    }),
  ]);

  // Create Fees for Students
  await prisma.$transaction([
    prisma.fee.create({
      data: {
        studentId: student1.id,
        feeTypeId: feeTypes[0].id,
        amount: 1000,
        dueDate: new Date("2023-12-31"),
        academicYear: "2023-2024",
        semester: "1",
        status: "pending",
      },
    }),
    prisma.fee.create({
      data: {
        studentId: student2.id,
        feeTypeId: feeTypes[0].id,
        amount: 1000,
        dueDate: new Date("2023-12-31"),
        academicYear: "2023-2024",
        semester: "1",
        status: "paid",
        paidAmount: 1000,
        paidDate: new Date("2023-09-15"),
        paymentMethod: "credit_card",
      },
    }),
    prisma.fee.create({
      data: {
        studentId: student3.id,
        feeTypeId: feeTypes[1].id,
        amount: 50,
        dueDate: new Date("2023-12-31"),
        academicYear: "2023-2024",
        semester: "1",
        status: "partial",
        paidAmount: 25,
        paidDate: new Date("2023-10-01"),
        paymentMethod: "bank_transfer",
      },
    }),
    prisma.fee.create({
      data: {
        studentId: student4.id,
        feeTypeId: feeTypes[2].id,
        amount: 75,
        dueDate: new Date("2023-12-31"),
        academicYear: "2023-2024",
        semester: "1",
        status: "pending",
      },
    }),
    prisma.fee.create({
      data: {
        studentId: student5.id,
        feeTypeId: feeTypes[0].id,
        amount: 1000,
        dueDate: new Date("2023-12-31"),
        academicYear: "2023-2024",
        semester: "1",
        status: "paid",
        paidAmount: 1000,
        paidDate: new Date("2023-09-10"),
        paymentMethod: "credit_card",
      },
    }),
    prisma.fee.create({
      data: {
        studentId: student6.id,
        feeTypeId: feeTypes[1].id,
        amount: 50,
        dueDate: new Date("2023-12-31"),
        academicYear: "2023-2024",
        semester: "1",
        status: "paid",
        paidAmount: 50,
        paidDate: new Date("2023-09-05"),
        paymentMethod: "cash",
      },
    }),
  ]);

  // Create Lessons (each teacher teaches their own class)
  const lessons = await prisma.$transaction([
    // Teacher 1's lessons (Math and Science for Class 9-A)
    prisma.lesson.create({
      data: {
        name: "Math Class",
        day: "MONDAY",
        subjectId: subjects[0].id, // Math
        classId: classes[0].id, // Class 9-A
        teacherId: teacher1.id,
      },
    }),
    prisma.lesson.create({
      data: {
        name: "Science Class",
        day: "WEDNESDAY",
        subjectId: subjects[1].id, // Science
        classId: classes[0].id, // Class 9-A
        teacherId: teacher1.id,
      },
    }),

    // Teacher 2's lessons (English for Class 10-B)
    prisma.lesson.create({
      data: {
        name: "English Class",
        day: "TUESDAY",
        subjectId: subjects[2].id, // English
        classId: classes[1].id, // Class 10-B
        teacherId: teacher2.id,
      },
    }),

    // Teacher 3's lessons (History for Class 11-C)
    prisma.lesson.create({
      data: {
        name: "History Class",
        day: "THURSDAY",
        subjectId: subjects[3].id, // History
        classId: classes[2].id, // Class 11-C
        teacherId: teacher3.id,
      },
    }),
  ]);

  // Create Assignments
  const assignments = await prisma.$transaction([
    prisma.assignment.create({
      data: {
        title: "Math Homework 1",
        startDate: new Date("2023-09-01"),
        dueDate: new Date("2023-09-15"),
        lessonId: lessons[0].id, // Teacher 1's math lesson
      },
    }),
    prisma.assignment.create({
      data: {
        title: "English Essay",
        startDate: new Date("2023-09-05"),
        dueDate: new Date("2023-09-20"),
        lessonId: lessons[2].id, // Teacher 2's english lesson
      },
    }),
  ]);

  // Create Exams
  const exams = await prisma.$transaction([
    prisma.exam.create({
      data: {
        title: "Midterm Math Exam",
        startTime: new Date("2023-10-15T09:00:00"),
        endTime: new Date("2023-10-15T11:00:00"),
        lessonId: lessons[0].id, // Teacher 1's math lesson
      },
    }),
    prisma.exam.create({
      data: {
        title: "English Midterm",
        startTime: new Date("2023-10-16T09:00:00"),
        endTime: new Date("2023-10-16T11:00:00"),
        lessonId: lessons[2].id, // Teacher 2's english lesson
      },
    }),
  ]);

  // Create Results (for Teacher 1's and Teacher 2's students)
  await prisma.$transaction([
    // Results for Teacher 1's students
    prisma.result.create({
      data: {
        score: 85,
        assignmentId: assignments[0].id,
        studentId: student1.id,
      },
    }),
    prisma.result.create({
      data: {
        score: 92,
        assignmentId: assignments[0].id,
        studentId: student2.id,
      },
    }),
    prisma.result.create({
      data: {
        score: 78,
        examId: exams[0].id,
        studentId: student1.id,
      },
    }),
    prisma.result.create({
      data: {
        score: 88,
        examId: exams[0].id,
        studentId: student2.id,
      },
    }),

    // Results for Teacher 2's students
    prisma.result.create({
      data: {
        score: 95,
        assignmentId: assignments[1].id,
        studentId: student3.id,
      },
    }),
    prisma.result.create({
      data: {
        score: 90,
        examId: exams[1].id,
        studentId: student3.id,
      },
    }),
  ]);

  // Create Attendances
  await prisma.$transaction([
    // Attendances for Teacher 1's students
    prisma.attendance.create({
      data: {
        date: new Date("2023-09-01"),
        present: true,
        studentId: student1.id,
      },
    }),
    prisma.attendance.create({
      data: {
        date: new Date("2023-09-01"),
        present: false,
        studentId: student2.id,
      },
    }),
    prisma.attendance.create({
      data: {
        date: new Date("2023-09-02"),
        present: true,
        studentId: student1.id,
      },
    }),

    // Attendances for Teacher 2's students
    prisma.attendance.create({
      data: {
        date: new Date("2023-09-01"),
        present: true,
        studentId: student3.id,
      },
    }),

    // Attendances for Teacher 3's student
    prisma.attendance.create({
      data: {
        date: new Date("2023-09-01"),
        present: true,
        studentId: student4.id,
      },
    }),
  ]);

  // Create Behaviors
  const behaviors = await prisma.$transaction([
    prisma.behavior.create({
      data: {
        title: "Homework Completion",
        description: "Completed homework on time",
        point: 5,
        isNegative: false,
      },
    }),
    prisma.behavior.create({
      data: {
        title: "Tardiness",
        description: "Late to class",
        point: 2,
        isNegative: true,
      },
    }),
  ]);

  // Create Incidents (for Teacher 1's and Teacher 2's students)
  await prisma.$transaction([
    // Positive incident for Teacher 1's student
    prisma.incident.create({
      data: {
        date: new Date("2023-09-05"),
        givenById: teacher1.id,
        comment: "Excellent participation in class",
        studentId: student1.id,
        behaviorId: behaviors[0].id,
      },
    }),

    // Negative incident for Teacher 1's student
    prisma.incident.create({
      data: {
        date: new Date("2023-09-10"),
        givenById: teacher1.id,
        comment: "Late to class 3 times this week",
        studentId: student2.id,
        behaviorId: behaviors[1].id,
      },
    }),

    // Positive incident for Teacher 2's student
    prisma.incident.create({
      data: {
        date: new Date("2023-09-12"),
        givenById: teacher2.id,
        comment: "Excellent essay work",
        studentId: student3.id,
        behaviorId: behaviors[0].id,
      },
    }),
  ]);

  // Create Events
  await prisma.$transaction([
    // Event for Teacher 1's class
    prisma.event.create({
      data: {
        title: "Parent-Teacher Meeting",
        description: "Quarterly parent-teacher conference",
        startTime: new Date("2023-10-05T16:00:00"),
        endTime: new Date("2023-10-05T19:00:00"),
        classId: classes[0].id,
      },
    }),

    // School-wide event
    prisma.event.create({
      data: {
        title: "School Picnic",
        description: "Annual school picnic day",
        startTime: new Date("2023-10-15T09:00:00"),
        endTime: new Date("2023-10-15T15:00:00"),
      },
    }),
  ]);

  // Create Announcements
  const announcements = await prisma.$transaction([
    // Announcement for Teacher 1's class
    prisma.announcement.create({
      data: {
        title: "Welcome Back to School!",
        description: "Welcome to the new academic year 2023-2024",
        date: new Date("2023-09-01"),
        classId: classes[0].id,
      },
    }),

    // School-wide announcement
    prisma.announcement.create({
      data: {
        title: "School Closed on Monday",
        description: "School will be closed next Monday for maintenance",
        date: new Date("2023-09-15"),
      },
    }),
  ]);

  // Mark some announcements as viewed
  await prisma.announcementView.createMany({
    data: [
      // Teacher 1 views class announcement
      {
        userId: teacher1.id,
        announcementId: announcements[0].id,
      },

      // Student 1 views class announcement
      {
        userId: student1.id,
        announcementId: announcements[0].id,
      },

      // Teacher 1 views school-wide announcement
      {
        userId: teacher1.id,
        announcementId: announcements[1].id,
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("seed has error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });