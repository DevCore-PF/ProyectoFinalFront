export interface Course {
  id: string;
  title: string;
  description: string;
  students: number;
  rating: number;
  price: number;
  status: string;
  difficulty: string;
  duration: string;
  createdDate: string;
  lastUpdate: string;
  totalDuration: string;
  visibility: string;
}

export interface CourseCardProps {
  course: Course;
  viewDetails: (id: string) => void;
}
