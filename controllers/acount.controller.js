const userModule = require("../modules/acount.module").UserModule;

const addUser = (req, res) => {
  let { passportId, cash, credit } = req.body;
  if (!(passportId && cash && credit)) {
    return res.status(403).send("all inputs are required");
  }
  cash = parseInt(cash);
  credit = parseInt(credit);
  const user = new userModule({
    passportId,
    cash,
    credit,
  });
  user.save((err, data) => {
    if (err) {
      return res.status(301).send("");
    }
    res.status(200).send("user add successfuly");
  });
};
const getUsers = (req, res) => {
  userModule.find({}, (err, data) => {
    if (err) {
      res.status(404).send("data is not found");
    }
    res.status(200).json(data);
  });
};
const getUserByPassportId = (req, res) => {
  userModule.find({ passportId: req.params.passportId }, (err, data) => {
    if (err) {
      res.status(404).send("user does not exist");
    }
    res.status(200).json(data);
  });
};
/**
 *
 * @param {*} type type of the transaction deposit or withdrow or update credit
 * @param {*} req request from the client
 * @param {*} res respons to the client
 * function handle the update of the user data
 */
function depositOrWithdrowOrUpdateCredit(type, req, res) {
  userModule.findById(req.body.id, (err, data) => {
    if (err) {
      res.status(404).json("user does not exist");
    }

    if (type === "deposit") {
      if (parseInt(req.body.amount) >= 0) {
        userModule.findByIdAndUpdate(
          data._id,
          { cash: data.cash + parseInt(req.body.amount) },
          (err, data) => {
            if (err) {
              res.status(500).json("bade request");
            }
            res.status(200).json(`success new cash amount is : ${data.cash}`);
          }
        );
      } else {
        return res.status(406).send("connot deposit a Negative Number");
      }
    } else if (type === "withdrow") {
      if (parseInt(req.body.amount) >= 0) {
        if (data.cash - parseInt(req.body.amount) >= -data.credit) {
          userModule.findByIdAndUpdate(
            data._id,
            { cash: data.cash - parseInt(req.body.amount) },
            (err, data) => {
              if (err) {
                res.status(500).json("bade request");
              }
              res.status(200).json(`success new cash amount is : ${data.cash}`);
            }
          );
        } else {
          return res.status(406).send("cannot withdrow credit too low");
        }
      } else {
        return res.status(406).send("connot withdrow a Negative Number");
      }
    } else if (type === "updateCredit") {
      if (parseInt(req.body.amount) >= 0) {
        if (data.cash >= -parseInt(req.body.amount)) {
          userModule.findByIdAndUpdate(
            data._id,
            { credit: parseInt(req.body.amount) },
            { new: true },
            (err, data) => {
              if (err) {
                res.status(500).json("bade request");
              }
              res
                .status(200)
                .json(`success new credit amount is : ${data.credit}`);
            }
          );
        } else {
          return res.status(406).send("credit connot be less then user cash");
        }
      } else {
        return res.status(406).send("credit connot be a Negative Number");
      }
    } else if (type === "transfer") {
      if (req.body.receiverPassportId) {
        userModule.findOne(
          { passportId: req.body.receiverPassportId },
          (err, receiverUser) => {
            if (err) {
              res
                .status(404)
                .json(
                  "the user with you transfered the cash to daes not exist"
                );
            }
            if (data.passportId === receiverUser.passportId) {
              return res
                .status(406)
                .send("connot transfer from user to the same user");
            }
            if (data.cash - parseInt(req.body.amount) >= -data.credit) {
              userModule.findByIdAndUpdate(
                data._id,
                { cash: data.cash - parseInt(req.body.amount) },
                (err, user) => {
                  if (err) {
                    res.status(306).json("error");
                  }
                }
              );
              userModule.findOne(
                { passportId: req.body.receiverPassportId },
                (err, user) => {
                  if (err) {
                    res.status(306).json("error");
                  }
                  userModule.findByIdAndUpdate(
                    user._id,
                    { cash: user.cash + parseInt(req.body.amount) },
                    (err, data) => {
                      if (err) {
                        res.status(306).json("error");
                      }
                      res.status(200).json("transfer success");
                    }
                  );
                }
              );
            } else {
              return res.status(406).send("cannot withdrow credit too low");
            }
          }
        );
      } else {
        return res
          .status(406)
          .send("transfered cash cannot be a Negative Number");
      }
    }
  });
}
module.exports = {
  addUser,
  getUsers,
  getUserByPassportId,
  depositOrWithdrowOrUpdateCredit,
};
