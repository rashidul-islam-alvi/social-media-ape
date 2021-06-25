/** @format */

const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else return false;
};

const isEmail = (email) => {
  const emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else return false;
};

exports.validationSignUp = (Data) => {
  const errors = {};

  if (isEmpty(Data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(Data.email)) {
    errors.email = "Must be a valid email adress";
  }

  if (isEmpty(Data.password)) {
    errors.password = "Must not be empty";
  }
  if (isEmpty(Data.handle)) {
    errors.handle = "Must not be empty";
  }
  if (isEmpty(Data.confirmPassword)) {
    errors.confirmPassword = "Must not be empty";
  }

  if (Data.password !== Data.confirmPassword) {
    errors.confirmPassword = "Password must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validationLogIn = (Data) => {
  const errors = {};

  if (isEmpty(Data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(Data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (isEmpty(Data.password)) {
    errors.password = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  const userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website.trim();
  }

  if (!isEmpty(data.location.trim()))
    userDetails.loaction = data.location.trim();

  return userDetails;
};
