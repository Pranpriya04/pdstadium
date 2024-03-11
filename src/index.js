require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const app = express();
var cors = require("cors");
app.use(express.json());
app.use(cors());
//--------------------------------------CREATE DB--------------------------------------------

const db_url =
  "postgres://webadmin:FAQnco56985@node60133-pj2547.proen.app.ruk-com.cloud:11652/bookstadium";
const sequelize = new Sequelize(db_url);
// const sequelize = new Sequelize("database", "username", "password", {
//   host: "localhost",
//   dialect: "sqlite",
//   storage: "./Database/bookstadium.sqlite",
// });
//--------------------------------------CREATE TABLE------------------------------------------

// CREATE TABLE `sales_data`
const Sales = sequelize.define("sales_data", {
  SalesID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TypeID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  StadiumID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  UserID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Time: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  SaleDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

//CREATE TABLE `stadium`
const Stadium = sequelize.define("stadiums", {
  StadiumID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  StadiumName: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  TypeID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Size: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

//CREATE TABLE `typestadium`
const Type = sequelize.define("type_stadiums", {
  TypeID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  TypeName: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
});

// CREATE TABLE `users`
const User = sequelize.define("user", {
  UserID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserPassword: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
  UserName: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  Gender: {
    type: Sequelize.STRING(1),
    allowNull: false,
  },
  Email: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  Tel: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
  Credit: {
    type: Sequelize.STRING(13),
    allowNull: false,
  },
  Address: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
});

Type.hasMany(Stadium, {
  foreignKey: "TypeID",
});
Stadium.belongsTo(Type, {
  foreignKey: "TypeID",
});

Type.hasMany(Sales, {
  foreignKey: "TypeID",
});
Sales.belongsTo(Type, {
  foreignKey: "TypeID",
});

User.hasMany(Sales, {
  foreignKey: "UserID",
});
Sales.belongsTo(User, {
  foreignKey: "UserID",
});

Stadium.hasMany(Sales, {
  foreignKey: "StadiumID",
});
Sales.belongsTo(Stadium, {
  foreignKey: "StadiumID",
});

(async () => {
  await sequelize.sync({ alter: true });
})();

//---------------------------------type_stadiums-----------------------------------------------------

app.get("/type_stadiums", (req, res) => {
  Type.findAll()
    .then((type_stadiums) => {
      res.status(200).json(type_stadiums);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/type_stadiums/:TypeID", (req, res) => {
  Type.findByPk(req.params.TypeID)
    .then((type_stadium) => {
      if (!type_stadium) {
        res.status(404).json("Type not found!");
      } else {
        res.status(200).json(type_stadium);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/type_stadiums", (req, res) => {
  Type.create(req.body)
    .then((type_stadium) => {
      res.status(200).json(type_stadium);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.put("/type_stadiums/:TypeID", (req, res) => {
  Type.findByPk(req.params.TypeID)
    .then((type_stadium) => {
      if (!type_stadium) {
        res.send(404).json("Type not found!");
      } else {
        type_stadium.update(req.body).then((type_stadium) => {
          res.status(200).json(type_stadium);
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.delete("/type_stadiums/:TypeID", (req, res) => {
  Type.findByPk(req.params.TypeID)
    .then((type_stadium) => {
      if (!type_stadium) {
        res.send(404).json("Type not found!");
      } else {
        type_stadium
          .destroy()
          .then(() => {
            res.send({});
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//---------------------------------stadiums-----------------------------------------------------

app.get("/stadiums", (req, res) => {
  Stadium.findAll({
    include: Type,
  })
    .then((stadiums) => {
      res.status(200).json(stadiums);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/stadiums/:StadiumID", (req, res) => {
  Stadium.findOne({
    include: Type,
    where: {
      StadiumID: req.params.StadiumID,
    },
  })
    .then((stadiums) => {
      res.status(200).json(stadiums);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/stadiums/:StadiumID", (req, res) => {
  Stadium.findByPk(req.params.StadiumID)
    .then((stadium) => {
      if (!stadium) {
        res.send(404).json("stadium not found!");
      } else {
        res.status(200).json(stadium);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/stadiums", (req, res) => {
  Stadium.create(req.body)
    .then((stadium) => {
      res.status(200).json(stadium);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.put("/stadiums/:StadiumID", (req, res) => {
  Stadium.findByPk(req.params.StadiumID)
    .then((stadium) => {
      if (!stadium) {
        res.send(404).json("Type not found!");
      } else {
        stadium.update(req.body).then((stadium) => {
          res.status(200).json(stadium);
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.delete("/stadiums/:StadiumID", (req, res) => {
  Stadium.findByPk(req.params.StadiumID)
    .then((stadium) => {
      if (!stadium) {
        res.send(404).json("stadium not found!");
      } else {
        stadium
          .destroy()
          .then(() => {
            res.send(true);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/basketball", (req, res) => {
  Stadium.findAll({
    include: Type,
    where: {
      TypeID: 1,
    },
  })
    .then((basketball) => {
      res.status(200).json(basketball);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/football", (req, res) => {
  Stadium.findAll({
    include: Type,
    where: {
      TypeID: 2,
    },
  })
    .then((football) => {
      res.status(200).json(football);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/futsal", (req, res) => {
  Stadium.findAll({
    include: Type,
    where: {
      TypeID: 3,
    },
  })
    .then((futsal) => {
      res.status(200).json(futsal);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/Bat", (req, res) => {
  Stadium.findAll({
    include: Type,
    where: {
      TypeID: 4,
    },
  })
    .then((Bat) => {
      res.status(200).json(Bat);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//---------------------------------sales_data-----------------------------------------------------

app.get("/sales_datas/:SalesID", (req, res) => {
  Sales.findByPk(req.params.SalesID)
    .then((sales_data) => {
      if (!sales_data) {
        res.send(404).json("Sale not found!");
      } else {
        res.status(200).json(sales_data);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/sales_data", (req, res) => {
  Sales.findAll({
    include: [
      {
        model: Stadium,
        include: [
          {
            model: Type,
            attributes: ["TypeName"],
          },
        ],
      },
      {
        model: User,
        attributes: ["UserName"],
      },
    ],
  })
    .then((sales_data) => {
      res.status(200).json(sales_data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/sales_data", (req, res) => {
  console.log(req.body);
  Sales.create(req.body)
    .then((sales_data) => {
      res.status(200).json(sales_data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.put("/sales_datas/:SalesID", (req, res) => {
  Sales.findByPk(req.params.SalesID)
    .then((sales_data) => {
      if (!sales_data) {
        res.send(404).json("Type not found!");
      } else {
        sales_data.update(req.body).then((sales_data) => {
          res.status(200).json(sales_data);
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.delete("/sales_datas/:SalesID", (req, res) => {
  Sales.findByPk(req.params.SalesID)
    .then((sales_data) => {
      if (!sales_data) {
        res.send(404).json("sales_data not found!");
      } else {
        sales_data
          .destroy()
          .then(() => {
            res.send({});
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//---------------------------------User -----------------------------------------------------

app.get("/users", (req, res) => {
  User.findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/history/:UserID", (req, res) => {
  Sales.findAll({
    include: [
      {
        model: Stadium,
        include: [
          {
            model: Type,
            attributes: ["TypeName"],
          },
        ],
      },
    ],
    where: {
      UserID: req.params.UserID,
    },
  })
    .then((stadiums) => {
      res.status(200).json(stadiums);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/users/:UserID", (req, res) => {
  User.findByPk(req.params.UserID)
    .then((user) => {
      if (!user) {
        res.send(404).json("user not found!");
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/users", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/login", (req, res) => {
  User.findOne({
    where: {
      UserName: req.body.username,
      UserPassword: req.body.password,
    },
  })
    .then((user) => {
      let status = false;
      let role = 0;
      if (user) {
        status = true;
        if (user.UserName == "admin") role = 1;
        console.log(user);
        res.status(200).json({
          status,
          role,
          user,
        });
      } else {
        res.status(200).json({
          status,
          role,
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/changPassword/:UserID", (req, res) => {
  User.findOne({
    where: {
      UserID: req.params.UserID,
    },
  })
    .then((user) => {
      user
        .update({
          UserPassword: req.body.newpassword,
        })
        .then(() => {
          res.status(200).send(true);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/forget", (req, res) => {
  User.findOne({
    where: {
      UserName: req.body.UserName,
      Email: req.body.Email,
    },
  })
    .then((user) => {
      if (user) {
        res.status(200).send({
          status: true,
          UserID: user.UserID,
        });
      } else {
        res.status(200).send({
          status: false,
          UserID: 0,
        });
      }
      console.log(user);
      // res.status(200).send("HI")
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.put("/users", (req, res) => {
  User.findByPk(req.body.UserID)
    .then((user) => {
      if (!user) {
        res.send(404).json("Type not found!");
      } else {
        user.update(req.body).then((user) => {
          res.status(200).json(user);
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.delete("users/:UserID", (req, res) => {
  User.findByPk(req.params.UserID)
    .then((User) => {
      if (!User) {
        res.send(404).json("User not found!");
      } else {
        User.destroy()
          .then(() => {
            res.send({});
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//-------------------------------------------------------------------------------------------

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
