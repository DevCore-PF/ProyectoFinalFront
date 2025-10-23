import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
const page = () => {
  const validateForm = () => {};
  const initialValuesForm = {
    name: "",
    email: "",
  };
  //   const formik = useFormik({
  //   validationSchema=validateForm,
  //     initialValues= initialValuesForm
  //   onSubmit=async()=>{
  //     try {
  //       const data={name:'user'};
  //     } catch (error) {

  //     }
  //   }
  // })
  return (
    <div>
      <Link href={"/"}>
        <span>LOGO</span>
      </Link>
      <section>
        <form>
          <h1>Registro</h1>
          <p>Creá una cuenta nueva en DevCore.</p>
          <span>
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" placeholder="Ingresá tu nombre" />
          </span>
          <span>
            <label htmlFor="name">Email</label>
            <input type="text" id="name" placeholder="Ingresá tu email" />
          </span>
          <span>
            <label htmlFor="name">Constraseña</label>
            <input type="text" id="name" placeholder="Creá tu contraseña" />
          </span>
          <span>
            <label htmlFor="name">Repetir contraseña</label>
            <input type="text" id="name" placeholder="Repetí tu contraseña" />
          </span>
          <span>
            <input type="checkbox" />
            <p>
              Acepto los <span className="underline">Términos de Uso</span> y
              las <span className="underline">Políticas de Privacidad</span>
            </p>
          </span>
          <button type="submit">Registar</button>
          <div>
            <div className="w-1.5 bg-gray-dark"></div>
            <p>o</p>
            <div className="w-1.5 bg-gray-dark"></div>
          </div>
          <button>
            <Image
              src={"./icons/googleIcon.svg"}
              width={100}
              height={100}
              alt="Ícono de google"
            ></Image>
          </button>
        </form>
      </section>
    </div>
  );
};

export default page;
