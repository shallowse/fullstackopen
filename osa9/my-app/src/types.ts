export interface CourseName {
  name: string;
}

export interface Course {
  name: string;
  exerciseCount: number;
}

export interface Courses {
  courseParts: Array<Course>;
}
