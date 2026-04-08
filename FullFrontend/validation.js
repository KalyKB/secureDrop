const form = document.getElementById("form");
const firstname_input = document.getElementById("firstname-input");
const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const repassword_input = document.getElementById("repassword-input");
const error_message = document.getElementById("error-message");
const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let errors = [];
  clearErrors();

  // SIGNUP
  if (firstname_input !== null) {
    errors = getSignupFormErrors(
      firstname_input.value,
      email_input.value,
      password_input.value,
      repassword_input.value
    );

    if (errors.length > 0) {
      error_message.innerText = errors.join(", ");
      return;
    }

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstname: firstname_input.value,
        email: email_input.value,
        password: password_input.value
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "Login.html";
    } else {
      error_message.innerText = data.message;
    }

  } else {
    // LOGIN
    errors = getLoginFormErrors(
      email_input.value,
      password_input.value
    );

    if (errors.length > 0) {
      error_message.innerText = errors.join(", ");
      return;
    }

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email_input.value,
        password: password_input.value
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "Dashboard.html";
    } else {
      error_message.innerText = data.message;
    }
  }
});

function getSignupFormErrors(firstname, email, password, repassword) {
  let errors = [];

  if (!firstname || firstname.trim() === "") {
    errors.push("First name is required");
    markIncorrect(firstname_input);
  }

  if (!email || email.trim() === "") {
    errors.push("Email is required");
    markIncorrect(email_input);
  }

  if (!password || password.trim() === "") {
    errors.push("Password is required");
    markIncorrect(password_input);
  }

  if (password && repassword && password !== repassword) {
    errors.push("Passwords do not match");
    markIncorrect(password_input);
    markIncorrect(repassword_input);
  }

  return errors;
}

function getLoginFormErrors(email, password) {
  let errors = [];

  if (!email || email.trim() === "") {
    errors.push("Email is required");
    markIncorrect(email_input);
  }

  if (!password || password.trim() === "") {
    errors.push("Password is required");
    markIncorrect(password_input);
  }

  return errors;
}

function markIncorrect(inputEl) {
  if (!inputEl) return;
  inputEl.parentElement.classList.add("incorrect");
}

function clearErrors() {
  document.querySelectorAll(".incorrect").forEach(el => {
    el.classList.remove("incorrect");
  });
}

function setupEyeToggle(inputId, openId, closedId) {
  const input = document.getElementById(inputId);
  const open = document.getElementById(openId);
  const closed = document.getElementById(closedId);

  if (!input || !open || !closed) return;

  open.addEventListener("click", () => {
    input.type = "text";
    open.classList.add("hidden");
    closed.classList.remove("hidden");
  });

  closed.addEventListener("click", () => {
    input.type = "password";
    closed.classList.add("hidden");
    open.classList.remove("hidden");
  });
}


setupEyeToggle("password-input", "eye-open", "eye-closed");
setupEyeToggle("password-input", "eye-open-pw", "eye-closed-pw");
setupEyeToggle("repassword-input", "eye-open-rpw", "eye-closed-rpw");

