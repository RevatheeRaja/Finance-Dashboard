import React, { useState } from "react";
import { Button, Label, TextInput, Card } from "flowbite-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from 'react-dom/server';

const Resetpassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  let errorMessage = "<ul>";
  const navigate = useNavigate();
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      const response = await fetch(
        "https://fibutronwebapi.fibutron.de/api/account/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );
      if (!newPassword.match(passwordRegex)) {
        const errorMessage = ReactDOMServer.renderToString(
          <ul>
            <li>at least 8 characters</li>
            <li>one capital letter</li>
            <li>one small letter</li>
            <li>one number</li>
            <li>one symbol</li>
          </ul>
        );
      
        Swal.fire({
          icon: "error",
          title: "Password should contain",
          html: errorMessage,
          customClass: {
            confirmButton: "btn-custom-class",
            title: "title-class",
          },
          buttonsStyling: false,
        });
      
      } else if (newPassword === confirmPassword) {
        // Passwords match, you can proceed with the reset logic here
        Swal.fire({
          icon: "success",
          title: "Password Changed!",
          text: "You have successfully changed the password .",
          customClass: {
            confirmButton: "btn-custom-class",
            title: "title-class",
          },
          buttonsStyling: false,
        });
        setPasswordsMatch(true);
        /*   navigate("/"); */
      } else {
        // Email sending failed, handle error
        console.error("Failed to send reset password email.");
        Swal.fire({
          icon: "error",
          title: "Password Doesn't Match",
          text: "An error occurred while sending the reset password email.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: " Password Doesn't Match",
        html: errorMessage,
        customClass: {
          confirmButton: "btn-custom-class",
          title: "title-class",
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="custom-card">
        <h1 className="flex flex-col items-center text-3xl text-blue-950">
          Reset Password
        </h1>
        <form className="flex max-w-lg flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-5 flex flex-row">
              <Label htmlFor="newpassword" value="New Password" />
            </div>
            <TextInput
              id="newpassword"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
          </div>
          <div>
            <div className="mb-2 flex flex-row">
              <Label htmlFor="confirmpassword" value="Confirm Password" />
            </div>
            <TextInput
              id="confirmpassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {!passwordsMatch && (
              <p className="text-red-500">Passwords do not match</p>
            )}
          </div>
          <Button type="submit" className="bg-blue-950 text-white-500">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Resetpassword;
