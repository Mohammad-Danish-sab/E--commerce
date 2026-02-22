import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
    });

    alert("Registration successful");
    navigate("/login");
  };

  return (
    <form onSubmit={registerHandler} style={styles.form}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Register</button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "300px",
    margin: "50px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default Register;
