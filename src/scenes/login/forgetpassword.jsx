import React from "react";
import { Button, Checkbox, Label, TextInput, Card } from "flowbite-react";
import { Link } from "react-router-dom";
const forgetpassword = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card href="#" className="custom-card ">
        {" "}
        <h1 className="flex flex-col items-center text-2xl  text-blue-950">
          Enter email ID to reset password 
        </h1>
        <form className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-5 flex flex-row ">
              <Label htmlFor="email1" value="Your email" />
            </div>
            <TextInput
              id="email1"
              type="email"
              placeholder="User@gmail.com"
              required
            />
          </div>

          <Button type="submit">Submit</Button>
          <div className="flex flex-row justify-between px-6 "></div>
        </form>{" "}
      </Card>
    </div>
  );
};

export default forgetpassword;
