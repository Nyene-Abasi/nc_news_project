exports.forCustomErrors = (err, req, res, next) => {
    console.log("hce");
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  }

  exports.forPgErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
      console.log("I worked");
      res.status(400).send({ msg: "Invalid Input" });
    } else {
      next(err);
    }
  }