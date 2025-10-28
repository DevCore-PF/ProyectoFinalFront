import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseCard = () => {
  return (
    <div className="flex flex-col bg-background2 rounded-xl gap-6 p-4 sm:p-6 md:p-8 max-w-[90%] md:max-w-4xl mx-auto">
      {/* seccion d titulo y descripcion */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex flex-col">
          <h4 className="text-base md:text-lg font-bold text-gray-100">
            (course.title)
          </h4>
          <p className="text-xs md:text-sm font-light text-gray-200">
            (course.description) Adquiere conocimientos en HTML, CSS y
            JavaScript para construir interfaces web. Aprende a utilizar React
            para crear aplicaciones atractivas y orientadas al usuario.
          </p>
        </div>
      </div>

      {/* seccion de imagenes , el src hay q cambiarlo por course.img1Url por ejemplo, el 2 por course.img2Url y asi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Image
          alt="LeftImageCourse"
          src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761496786/imagen1_kb3voz.webp"
          height={400}
          width={400}
          className="w-full h-60 object-cover rounded-md"
        />
        <Image
          alt="MiddleImageCourse"
          src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761496785/imagen2_hkp1uj.webp"
          height={400}
          width={400}
          className="w-full h-60 object-cover rounded-md"
        />
        <Image
          alt="RightImageCourse"
          src="https://res.cloudinary.com/dtbpi3bic/image/upload/v1761496785/imagen3_ddmwst.webp"
          height={400}
          width={400}
          className="w-full h-60 object-cover rounded-md"
        />
      </div>

      {/* seccion media abajo  */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <p className="bg-gray-light text-background2 rounded-sm px-3 py-1.5 text-xs font-medium">
            (course.duration) horas
          </p>
          <p className="bg-gray-light text-background2 rounded-sm px-3 py-1.5 text-xs font-medium">
            (course.difficulty)
          </p>
        </div>
        <p className="text-xs text-gray-300">By (teacher.name)</p>
      </div>

      {/* seccion de temario */}
      <div className="border border-gray-500 rounded-md overflow-hidden">
        <h3 className="font-bold p-3 text-sm md:text-base bg-background2 text-gray-100 border-b border-gray-500">
          Temario
        </h3>
        <div className="flex flex-wrap gap-4 bg-gray-light p-4 justify-center sm:justify-start">
          {[
            { num: "01", title: "(course.subject1.title)" },
            { num: "02", title: "(course.subject2.title)" },
            { num: "03", title: "(course.subject3.title)" },
            { num: "04", title: "(course.subject4.title)" },
            { num: "05", title: "(course.subject5.title)" },
          ].map((subject) => (
            <div
              key={subject.num}
              className="w-full sm:w-auto flex flex-col items-start 
                         sm:border-r border-gray-400 sm:pr-4 sm:last:border-none"
            >
              <h3 className="font-bold text-black text-lg md:text-xl">
                {subject.num}
              </h3>
              <p className="text-xs font-light text-background2">
                {subject.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* seccion 5= el boton */}
      <div className="flex justify-end">
        <Link
          href="aca va a ir el courseLink o como se llame"
          className="bg-gray-light text-background2  font-bold rounded-md px-4 py-2 text-sm hover:bg-button hover:text-gray-light transition-colors"
        >
          Ver curso
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
