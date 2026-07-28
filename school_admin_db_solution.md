# Production-Ready School Admin Database & API Solution

This documentation outlines the complete database schema modifications (PostgreSQL) and the secure backend API controller logic (Node.js/Express with Sequelize & Prisma ORM) designed to resolve:
1. **Class Teacher Issue**: Mapping teachers to specific `Section` and `Shift` combinations rather than the entire `Class`.
2. **Subject Input Issue**: Correctly establishing the junction/mapping relationship between `Class`, `Section`, `Shift`, and `Subject` tables inside a transaction-safe block.

---

## 1. Restructured PostgreSQL Database Schema

To support section/shift-specific teachers and section-specific subjects, we move `class_teacher_id` from the `classes` table to the `class_sections` or `class_section_assignments` table, and introduce a clear junction mapping table `class_section_subjects`.

### Database Schema Entity-Relationship Model (SQL DDL)

```sql
-- 1. Create Employees Table (Teachers)
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Classes Table (Base metadata for a grade, e.g., Class 6, Class 7)
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'class_6'
    name VARCHAR(100) NOT NULL, -- e.g., 'Class 6'
    level VARCHAR(50) NOT NULL, -- e.g., 'Secondary'
    student_count INT DEFAULT 0,
    attendance_avg INT DEFAULT 95,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Subjects Catalog (Base subjects pool)
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., '101', '107'
    name VARCHAR(255) NOT NULL, -- e.g., 'Bangla', 'English'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Class Section Assignments Table
-- This handles combinations of Class, Section, and Shift, assigning a specific Class Teacher to each.
CREATE TABLE IF NOT EXISTS class_section_assignments (
    id SERIAL PRIMARY KEY,
    class_id VARCHAR(50) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL, -- e.g., 'A', 'B'
    academic_shift VARCHAR(50) NOT NULL, -- e.g., 'Morning', 'Day'
    class_teacher_id INT REFERENCES employees(id) ON DELETE SET NULL, -- MOVE teacher here!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, section_name, academic_shift) -- Ensures unique Section + Shift combo per Class
);

-- 5. Create Junction Mapping Table for Subjects
-- Connects class_section_assignments with specific subjects (Syllabus mapping per section/shift)
CREATE TABLE IF NOT EXISTS class_section_subjects (
    assignment_id INT NOT NULL REFERENCES class_section_assignments(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (assignment_id, subject_id) -- Composite Primary Key prevents duplicate mapping
);
```

---

## 2. Backend Controller Logic (Node.js / Express / Sequelize)

This secure controller block handles the update requests from the UI. It accepts the `classId` and an array of section-shift configurations. It runs inside a **database transaction block** to guarantee rollback on any insertion error.

### Express Controller Implementation (`class.controller.ts`)

```typescript
import { Request, Response } from 'express';
import { Sequelize, Transaction } from 'sequelize';
// Assuming your models are imported here
import { Class, Employee, Subject, ClassSectionAssignment, ClassSectionSubject } from './models';

/**
 * Update academic configuration for a specific class (Shifts, Sections, Teachers, and Subjects).
 * Runs in a secure Sequelize database transaction block.
 */
export const updateClassConfiguration = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { configurations } = req.body; 
  /* 
    Expected schema for `configurations`:
    [
      {
        section: "A",
        shift: "Morning",
        teacherName: "Mrs. Rokeya Begum",
        subjectCodes: ["101", "107", "109"]
      },
      {
        section: "B",
        shift: "Day",
        teacherName: "Mr. Rafiqul Islam",
        subjectCodes: ["101", "107", "111"]
      }
    ]
  */

  if (!classId || !Array.isArray(configurations)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload. classId and configurations array are required.'
    });
  }

  // Initialize secure database transaction
  const sequelizeInstance: Sequelize = Class.sequelize!;
  const transaction: Transaction = await sequelizeInstance.transaction();

  try {
    // 1. Verify that the class exists
    const targetClass = await Class.findByPk(classId, { transaction });
    if (!targetClass) {
      throw new Error(`Class with ID "${classId}" does not exist.`);
    }

    // Process each section configuration sequentially within the transaction
    for (const config of configurations) {
      const { section, shift, teacherName, subjectCodes } = config;

      if (!section || !shift) {
        throw new Error('Section name and Academic shift are required for configuration.');
      }

      // Find teacher ID from teacherName if provided
      let teacherId: number | null = null;
      if (teacherName) {
        const teacher = await Employee.findOne({
          where: { name: teacherName },
          transaction
        });
        if (!teacher) {
          throw new Error(`Employee (Teacher) "${teacherName}" was not found.`);
        }
        teacherId = teacher.id;
      }

      // 2. Upsert (Find or Create) the Section + Shift Assignment
      const [assignment, created] = await ClassSectionAssignment.findOrCreate({
        where: {
          class_id: classId,
          section_name: section,
          academic_shift: shift
        },
        defaults: {
          class_teacher_id: teacherId
        },
        transaction
      });

      // If it already existed, update the teacher assignment
      if (!created) {
        assignment.class_teacher_id = teacherId;
        await assignment.save({ transaction });
      }

      // 3. Subject Mapping (Foreign Key Resolution & Junction Insertion)
      // Resolve subject codes to actual subject IDs from the catalog database
      const resolvedSubjects = await Subject.findAll({
        where: { code: subjectCodes },
        transaction
      });

      if (resolvedSubjects.length !== subjectCodes.length) {
        const foundCodes = resolvedSubjects.map(s => s.code);
        const missingCodes = subjectCodes.filter((c: string) => !foundCodes.includes(c));
        throw new Error(`Subjects with codes [${missingCodes.join(', ')}] were not found in database.`);
      }

      const resolvedSubjectIds = resolvedSubjects.map(s => s.id);

      // Delete existing mapped subjects for this assignment to refresh mappings
      await ClassSectionSubject.destroy({
        where: { assignment_id: assignment.id },
        transaction
      });

      // Insert new mappings safely
      const mappingRows = resolvedSubjectIds.map(subId => ({
        assignment_id: assignment.id,
        subject_id: subId
      }));

      await ClassSectionSubject.bulkCreate(mappingRows, { transaction });
    }

    // All operations succeeded. Commit transaction safely.
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: `Configuration for ${targetClass.name} successfully updated & synced.`,
    });

  } catch (error: any) {
    // If any database or mapping error occurs, abort and roll back all changes completely
    await transaction.rollback();
    console.error('Database transaction rolled back. Error details:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update configuration. Transaction rolled back safely.',
      error: error.message || error
    });
  }
};
```

---

## 3. Alternative Backend Controller Logic (Prisma ORM)

For modern setups utilizing Prisma ORM, here is the equivalent transaction-safe database logic:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const updateClassConfigurationPrisma = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { configurations } = req.body;

  try {
    // Use prisma.$transaction to group all queries as a single unit
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify class existence
      const targetClass = await tx.class.findUnique({
        where: { id: classId }
      });
      if (!targetClass) {
        throw new Error(`Class with ID "${classId}" does not exist.`);
      }

      for (const config of configurations) {
        const { section, shift, teacherName, subjectCodes } = config;

        // Find teacher by name
        let teacherId: number | null = null;
        if (teacherName) {
          const teacher = await tx.employee.findFirst({
            where: { name: teacherName }
          });
          if (!teacher) throw new Error(`Teacher "${teacherName}" not found.`);
          teacherId = teacher.id;
        }

        // Upsert section assignment
        const assignment = await tx.classSectionAssignment.upsert({
          where: {
            classId_sectionName_academicShift: {
              classId: classId,
              sectionName: section,
              academicShift: shift
            }
          },
          update: {
            classTeacherId: teacherId
          },
          create: {
            classId: classId,
            sectionName: section,
            academicShift: shift,
            classTeacherId: teacherId
          }
        });

        // Map subject codes to IDs
        const subjects = await tx.subject.findMany({
          where: { code: { in: subjectCodes } }
        });

        // Clear existing junction subject entries
        await tx.classSectionSubject.deleteMany({
          where: { assignmentId: assignment.id }
        });

        // Bulk insert new mapped subjects
        await tx.classSectionSubject.createMany({
          data: subjects.map(s => ({
            assignmentId: assignment.id,
            subjectId: s.id
          }))
        });
      }

      return targetClass;
    });

    return res.status(200).json({
      success: true,
      message: `Configuration for ${result.name} synchronized successfully using Prisma Transaction.`
    });

  } catch (error: any) {
    console.error('Prisma transaction failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update database schema configurations.',
      error: error.message
    });
  }
};
```
