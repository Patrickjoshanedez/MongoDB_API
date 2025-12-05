/**
 * Database Seed Script
 * ====================
 * Populates MongoDB with sample data
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Import models
const Student = require('./models/Student');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Enrollment = require('./models/Enrollment');
const StudentSchedule = require('./models/StudentSchedule');

// Sample data
const studentsData = [
  {
    Student_ID: 1,
    Last_Name: 'Aranas',
    First_Name: 'Bennedict',
    Middle_Initial: 'S',
    City: 'Malaybalay',
    Province: 'Bukidnon',
    Postal_Code: '8700',
    Phone_Number: '09325462145'
  },
  {
    Student_ID: 2,
    Last_Name: 'Bautista',
    First_Name: 'David',
    Middle_Initial: 'A',
    City: 'Valencia',
    Province: 'Bukidnon',
    Postal_Code: '9000',
    Phone_Number: '09937783823'
  },
  {
    Student_ID: 3,
    Last_Name: 'Corales',
    First_Name: 'John',
    Middle_Initial: 'D',
    City: 'Malaybalay',
    Province: 'Bukidnon',
    Postal_Code: '8700',
    Phone_Number: '09058073523'
  },
  {
    Student_ID: 4,
    Last_Name: 'Dag-um',
    First_Name: 'Christopher',
    Middle_Initial: 'K',
    City: 'Cagayan de oro',
    Province: 'Misamis oriental',
    Postal_Code: '5600',
    Phone_Number: '09974415219'
  },
  {
    Student_ID: 5,
    Last_Name: 'Esteban',
    First_Name: 'Cedric',
    Middle_Initial: 'O',
    City: 'Tarlac',
    Province: 'Tarlac',
    Postal_Code: '7200',
    Phone_Number: '09694183691'
  }
];

const coursesData = [
  { Course_ID: 101, Name: 'Nursing', Department: 'Nursing' },
  { Course_ID: 102, Name: 'Information Technology', Department: 'Technology' },
  { Course_ID: 103, Name: 'Computer Science', Department: 'Technology' },
  { Course_ID: 107, Name: 'Secondary Education Major in Mathematics', Department: 'Education' }
];

// Seed database function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await StudentSchedule.deleteMany({});
    await Enrollment.deleteMany({});
    await Subject.deleteMany({});
    await Course.deleteMany({});
    await Student.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert Students
    console.log('👥 Inserting students...');
    const students = await Student.insertMany(studentsData);
    console.log(`✅ ${students.length} students inserted\n`);

    // Insert Courses
    console.log('📚 Inserting courses...');
    const courses = await Course.insertMany(coursesData);
    console.log(`✅ ${courses.length} courses inserted\n`);

    // Get course ObjectIds
    const itCourse = courses.find(c => c.Course_ID === 102);
    const nursingCourse = courses.find(c => c.Course_ID === 101);
    const csCourse = courses.find(c => c.Course_ID === 103);
    const edCourse = courses.find(c => c.Course_ID === 107);

    // Insert Subjects
    console.log('📖 Inserting subjects...');
    const subjectsData = [
      { Subject_Code: 'T125', Name: 'Intro To Computing', Units: 3, FK_Course_ID: itCourse._id },
      { Subject_Code: 'TE256', Name: 'Human Computer Interaction', Units: 3, FK_Course_ID: itCourse._id },
      { Subject_Code: 'GE340', Name: 'Mathematics in the modern World', Units: 2, FK_Course_ID: itCourse._id },
      { Subject_Code: 'T255', Name: 'Computer Programming', Units: 3, FK_Course_ID: itCourse._id },
      { Subject_Code: 'T254', Name: 'Information Management', Units: 3, FK_Course_ID: itCourse._id }
    ];
    const subjects = await Subject.insertMany(subjectsData);
    console.log(`✅ ${subjects.length} subjects inserted\n`);

    // Get student ObjectIds
    const student1 = students.find(s => s.Student_ID === 1);
    const student2 = students.find(s => s.Student_ID === 2);
    const student3 = students.find(s => s.Student_ID === 3);
    const student4 = students.find(s => s.Student_ID === 4);
    const student5 = students.find(s => s.Student_ID === 5);

    // Insert Enrollments
    console.log('📝 Inserting enrollments...');
    const enrollmentsData = [
      {
        Enrollment_ID: 61,
        Date_Enrolled: new Date('2025-08-19'),
        Year_Level: 1,
        FK_Course_ID: nursingCourse._id,
        FK_Student_ID: student1._id
      },
      {
        Enrollment_ID: 71,
        Date_Enrolled: new Date('2025-08-23'),
        Year_Level: 1,
        FK_Course_ID: edCourse._id,
        FK_Student_ID: student2._id
      },
      {
        Enrollment_ID: 62,
        Date_Enrolled: new Date('2025-08-23'),
        Year_Level: 2,
        FK_Course_ID: itCourse._id,
        FK_Student_ID: student3._id
      },
      {
        Enrollment_ID: 63,
        Date_Enrolled: new Date('2025-08-24'),
        Year_Level: 4,
        FK_Course_ID: itCourse._id,
        FK_Student_ID: student4._id
      },
      {
        Enrollment_ID: 64,
        Date_Enrolled: new Date('2025-08-25'),
        Year_Level: 3,
        FK_Course_ID: csCourse._id,
        FK_Student_ID: student5._id
      }
    ];
    const enrollments = await Enrollment.insertMany(enrollmentsData);
    console.log(`✅ ${enrollments.length} enrollments inserted\n`);

    // Get enrollment ObjectId for student 1
    const enrollment1 = enrollments.find(e => e.Enrollment_ID === 61);

    // Get subject ObjectIds
    const t125 = subjects.find(s => s.Subject_Code === 'T125');
    const te256 = subjects.find(s => s.Subject_Code === 'TE256');
    const ge340 = subjects.find(s => s.Subject_Code === 'GE340');
    const t255 = subjects.find(s => s.Subject_Code === 'T255');
    const t254 = subjects.find(s => s.Subject_Code === 'T254');

    // Insert Student Schedules
    console.log('🗓️  Inserting schedules...');
    const schedulesData = [
      { Schedule_ID: 1, FK_Enrollment_ID: enrollment1._id, FK_Subject_Code: t125._id, Room: '1', Class_Schedule: '7:30-9' },
      { Schedule_ID: 2, FK_Enrollment_ID: enrollment1._id, FK_Subject_Code: te256._id, Room: '2', Class_Schedule: '9:30-12' },
      { Schedule_ID: 3, FK_Enrollment_ID: enrollment1._id, FK_Subject_Code: ge340._id, Room: '3', Class_Schedule: '1:30-3' },
      { Schedule_ID: 4, FK_Enrollment_ID: enrollment1._id, FK_Subject_Code: t255._id, Room: '4', Class_Schedule: '3:30-5' },
      { Schedule_ID: 5, FK_Enrollment_ID: enrollment1._id, FK_Subject_Code: t254._id, Room: '5', Class_Schedule: '5:30-7' }
    ];
    const schedules = await StudentSchedule.insertMany(schedulesData);
    console.log(`✅ ${schedules.length} schedules inserted\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✅ DATABASE SEEDING COMPLETED!');
    console.log('═══════════════════════════════════════');
    console.log(`Students:    ${students.length}`);
    console.log(`Courses:     ${courses.length}`);
    console.log(`Subjects:    ${subjects.length}`);
    console.log(`Enrollments: ${enrollments.length}`);
    console.log(`Schedules:   ${schedules.length}`);
    console.log('═══════════════════════════════════════\n');

    // Display sample ObjectIds for testing
    console.log('📌 Sample ObjectIds for API Testing:');
    console.log('───────────────────────────────────────');
    console.log(`Student (Bennedict Aranas): ${student1._id}`);
    console.log(`Course (IT):                ${itCourse._id}`);
    console.log(`Subject (T125):             ${t125._id}`);
    console.log(`Enrollment (ID 61):         ${enrollment1._id}`);
    console.log(`Schedule (ID 1):            ${schedules[0]._id}`);
    console.log('───────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
