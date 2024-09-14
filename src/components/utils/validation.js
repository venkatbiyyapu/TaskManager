  function validatePassword(password,confirmPassword='') {
    const passwordPattern = /^[a-zA-Z0-9]+$/;
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
    }

    if (!passwordPattern.test(password)) {
        throw new Error("Password must be alphanumeric");
    }
    if (confirmPassword){
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }
  }
    
  }


  export default validatePassword;
