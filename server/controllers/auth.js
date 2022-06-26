const User = require("../models/user");

// exports.signup = (req, res) => {
//   // console.log("REQ BODY ON SIGNUP", req.body);
//
//   const { name, email, password } = req.body;
//
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is taken",
//       });
//     }
//   });
//
//   let newUser = new User({ name, email, password });
//
//   newUser.save((err, success) => {
//     if (err) {
//       console.log("SIGNUP ERROR", err);
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json({
//       message: "Signup success! Please sign in",
//     });
//   });
// };

const { sendEmailWithNodemailer } = require("../helpers/email");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const emailData = {
      from: process.env.MY_GMAIL, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
      subject: "ACCOUNT ACTIVATION LINK",
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>http://localhost:3000/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>http://localhost:3000</p>
            `,
    };

    sendEmailWithNodemailer(req, res, emailData);
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Expired link. Signup again",
          });
        }

        const { name, email, password } = jwt.decode(token);

        const user = new User({ name, email, password });

        user.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving user in database. Try signup again",
            });
          }
          return res.json({
            message: "Signup success. Please signin.",
          });
        });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};
