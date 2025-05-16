  function a() {
    const u = document.getElementById("u").value.trim();
    const p = document.getElementById("p").value.trim();
    const errorMsg = document.getElementById("e");
    const myArray = ["a8fv", "dmqr", "4oaj0", "y7.h", "tm", "l"];

    // Validate fields
    if (u === "" || p === "") {
      errorMsg.textContent = "Please enter both username and password.";
      return false;
    }

    // Validate credentials (for demo)
    const vu = "admin";
    const vp = "pass";

    if (u === vu && p === vp) {
      // Redirect if credentials are correct
      window.location.href = myArray.join('');
      return false; // prevent actual form submission
    } else {
      errorMsg.textContent = "Invalid username or password.";
      return false;
    }
  }