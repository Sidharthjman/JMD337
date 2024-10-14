// frontend/src/components/Panels.jsx
import React from "react";
import loginImage from "../assets/images/login.svg";
import signupImage from "../assets/images/signup.svg";

const Panels = () => {
  return (
    <div className="panels-container">
      <div className="panel left-panel">
        <div className="content">
          <h3>New here?</h3>
          <p>Come join us. Improve yourself and sharpen your skills.</p>
          <button className="btn transparent" id="sign-up-btn">
            Sign up
          </button>
        </div>
        <img src={loginImage} className="image" alt="Login" />
      </div>
      <div className="panel right-panel">
        <div className="content">
          <h3>One of us?</h3>
          <p>Login and start learning, start improving yourself.</p>
          <button className="btn transparent" id="sign-in-btn">
            Sign in
          </button>
        </div>
        <img src={signupImage} className="image" alt="Signup" />
      </div>
    </div>
  );
};

export default Panels;
