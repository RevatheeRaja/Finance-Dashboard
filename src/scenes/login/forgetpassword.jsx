import React, { useState } from "react";

import { Button, Checkbox, Label, TextInput, Card } from "flowbite-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Forgetpassword = () => {
  
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  let errorMessage = "<ul>";

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://fibutronwebapi.fibutron.de/api/account/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    
      if (response.ok) {
        // Email sent successfully, handle success
        Swal.fire({
          icon: "success",
          title: "Reset Password Email Sent!",
          text: "Please check your email for further instructions.",
        });
        navigate('/resetpassword')
      } else {
        // Email sending failed, handle error
        console.error("Failed to send reset password email.");
        Swal.fire({
          icon: "error",
          title: "Reset Password Email Failed",
          text: "An error occurred while sending the reset password email.",
        });
      }
    } catch (error) {
      // Network error or other fetch-related error
      console.error("An error occurred during fetch:", error);
      Swal.fire({
        icon: "error",
        title: "Reset Password Email Failed",
        text: "An error occurred while sending the reset password email. Please try again later.",
      });
    }
  }    

  const handleChange = (event) => {
    setEmail(event.target.value);
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card href="#" className="custom-card ">
        {" "}
      
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
          <div>
          <h1 className="flex flex-col items-center text-bold text-2xl  text-blue-950">
          Enter email ID to reset password
        </h1>
            <div className="mb-5 flex flex-row ">
              {/*               <Label htmlFor="email1" value="Your email" />
               */}
            </div>
            <TextInput
              id="email1"
              type="email"
              placeholder="User@gmail.com"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="bg-blue-950 text-white-500">Submit</Button>
          <div className="flex flex-row justify-between px-6 "></div>
        </form>{" "}
      </Card>
    </div>
  );
};

export default Forgetpassword;
