/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Notice {
  id: string;
  title: string;
  category: 'academic' | 'exam' | 'event' | 'sports' | 'general';
  date: string;
  content: string;
  urgent: boolean;
  author: string;
}

export interface AcademicProgram {
  level: string;
  grades: string;
  description: string;
  subjects: string[];
  activities: string[];
  coordinator: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  department: string;
  image: string;
  qualification: string;
  email: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AdmissionFormInput {
  studentName: string;
  guardianName: string;
  relationship: string;
  email: string;
  phone: string;
  selectedClass: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  previousSchool: string;
  previousGPA: string;
  address: string;
  comments: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  roll: number;
  className: string;
  section: string;
  guardian: string;
  phone: string;
  bloodGroup: string;
  attendanceRate: number;
}

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
  description: string;
}

export interface ExamResult {
  subject: string;
  marks: number;
  grade: string;
  maxMarks: number;
}
