import React from "react";
import { Button, Checkbox, Label, TextInput, Card } from "flowbite-react";
import { useRef, useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {mockLogin} from "../../data/mockLogin";

export default function Login() {
/*   const { setAuth } = useContext(AuthContext);
 */  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setpwd] = useState("");
  const [errors, setErrors] = useState([]);
  const [backError, setBackError] = useState("");
  const [success, setSuccess] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    const mockLoginData = mockLogin[0]; // Access the first element of the array
    let errorMessage = "<ul>";

    const loginData = new FormData(e.target);
    const email = loginData.get("email"); // Corrected: Use consistent variable names
    const password = loginData.get("password")
console.log(email,password)
  /*   const data = {
      email: loginData.get("email"),
      password: loginData.get("password"),
    }; */

    try {
/*       const response = await axios.post("/api/users/login", data);
 */
const username=mockLoginData.useremail
const pwd=mockLoginData.Password
console.log(username,pwd)
      //   setErrors([]);
      //   setBackError("");

      if (username===email && pwd===password) {
        ; // Store session ID in state

        setUser(username);
        console.log('sucess')
        setSuccess(true);
        // Display success message
         Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "You have successfully logged in.",
          customClass: {
            confirmButton: "btn-custom-class",
            title: "title-class",
          },
          buttonsStyling: false,
        }); 
        navigate("/dashboard");
      } else {
        // Handle other server response statuses
/*         console.error("Error logging in:", response.data.message);
 */
          Swal.fire({
              icon: "error",
              title: "Login Failed",
             text:   "An error occurred during login!",
              customClass: {
                confirmButton: "btn-custom-class",
                title: "title-class",
              },
              buttonsStyling: false,
            }); 
      }
    } catch (error) {
      setErrors([]);
      setBackError("");

      // Handle errors that occurred during the POST request
      /* if (error.response && error.response.status === 400) {
        setErrors('failed');

        let errorMessage = "<ul>";

        // Loop through error messages and append to the list
        error.response.data.errors.forEach((error) => {
          errorMessage += `<li>${error.msg}</li>`;
        }); */

/*         errorMessage += "</ul>";
 */
           Swal.fire({
              icon: "error",
              title: "Login Failed",
              html: errorMessage,
              customClass: {
                confirmButton: "btn-custom-class",
                title: "title-class",
              },
              buttonsStyling: false,
            }); 
      /*  else {
          Swal.fire({
              icon: "error",
              title: "Login Failed",
              text:"An error occurred during login!",
              customClass: {
                confirmButton: "btn-custom-class",
                title: "title-class",
              },
              buttonsStyling: false,
            }); 
      } */
    }
  };
 
  return (
    <>
    {success?(
      <section>
        <h1>youare loged in</h1>
      </section>
    ):(
   
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="custom-card ">
        <h1 className="flex flex-col items-center text-3xl  text-blue-950">Login</h1>
        <form className="flex max-w-lg flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <div className="mb-5 flex flex-row">
              <Label htmlFor="email1" value="Your email" />
            </div>
            <TextInput
              id="email"
              type="email"
              name="email"
              placeholder="user@gmail.com"
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />
          </div>
          <div>
            <div className="mb-2 flex flex-row">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput id="password" type="password" name="password"  onChange={(e) => setpwd(e.target.value)}
              value={pwd}required />
          </div>
       {/*    <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div> */}
          <Button type="submit" className="bg-blue-950 text-white-500">Submit</Button>
          <div className=" w-96">
            <div>
              <a href="/forgot" className="text-sm text-gray-900">
                Forgot password?
              </a>
             
            </div>
          </div>
        </form>
      </Card>
      {/*  {sessionId && (
        <div className="mt-4">
          <p>Session ID: {sessionId}</p>
        </div>
      )} */}
    </div> )}</>
  );
}
