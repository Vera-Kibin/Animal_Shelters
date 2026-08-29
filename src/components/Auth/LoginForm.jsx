// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import "./LoginForm.css";

// export default function LoginForm() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [haslo, setHaslo] = useState("");

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (!email.trim()) return;
//     login({ email: email.trim() });
//   }

//   return (
//     <form className="login" onSubmit={handleSubmit}>
//       <h3 className="login__title">Zaloguj się</h3>
//       <p className="login__hint">Aby wypełnić ankietę, musisz się zalogować.</p>

//       <input
//         type="email"
//         placeholder="E-mail"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Hasło"
//         value={haslo}
//         onChange={(e) => setHaslo(e.target.value)}
//       />

//       <button type="submit" className="modal__send">
//         Zaloguj →
//       </button>
//     </form>
//   );
// }
import { useAuth } from "../../context/AuthContext";
import "./LoginForm.css";

const ANIMALHELPER_LOGIN_URL = "https://zglos.animalhelper.pl/login";

export default function LoginForm() {
  const { login } = useAuth();

  function handleRedirect() {
    // TODO: SSO z Animal Helper (redirect + token po powrocie)

    window.open(ANIMALHELPER_LOGIN_URL, "_blank", "noopener,noreferrer");
  }

  function handleDemoLogin() {
    login({ email: "demo@animalhelper.pl" });
  }

  return (
    <div className="login">
      <h3 className="login__title">Zaloguj się</h3>
      <p className="login__hint">
        Aby wypełnić ankietę, zaloguj się przez konto Animal Helper.
      </p>

      <button type="button" className="modal__send" onClick={handleRedirect}>
        Zaloguj się przez Animal Helper →
      </button>

      <button type="button" className="login__demo" onClick={handleDemoLogin}>
        (demo) Kontynuuj jako zalogowany
      </button>
    </div>
  );
}
