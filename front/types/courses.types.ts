import { courses } from '../helpers/moks';
export interface Course {
  id: string | number;
  title: string;
  students: number;
  rating: number;
  price: number;
  status: string;
  createdDate: string;
  lastUpdate: string;
  totalDuration: string;
  visibility: string;
}

export interface CourseCardProps {
  course: Course;
  viewDetails: (id: string | number) => void;
}

