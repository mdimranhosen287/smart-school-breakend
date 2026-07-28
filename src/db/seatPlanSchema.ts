export interface SeatPlanStudent {
  studentId: number;
  rollNo: string;
  rowNumber: number;
  columnNumber: number;
}

export interface ExamSeatPlan {
  id: number;
  examTerm: string;
  class: string;
  section: string;
  roomNumber: string;
  layoutType: string;
  students: SeatPlanStudent[];
  createdAt: string;
}
