interface CourseValidationDetailsProps {
  courseId: string;
  onBack: () => void;
}
const CourseValidationDetails = ({
  courseId,
  onBack,
}: CourseValidationDetailsProps) => {
  return (
    <div>
      <button onClick={onBack}>ATRAS</button>
      <p>validations courses detail</p>
    </div>
  );
};

export default CourseValidationDetails;
