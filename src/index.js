require("dotenv").config();
const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

//--------------------------------------CREATE DB--------------------------------------------

const sequelize = new Sequelize('database','username','password',{
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/bookstadium.sqlite'
});
//--------------------------------------CREATE TABLE------------------------------------------

// CREATE TABLE `sales_data`
const Sales = sequelize.define('sales_data',{
    SalesID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      TypeID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      StadiumID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      EnterTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      OutTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      SaleDate: {
        type: Sequelize.DATE ,
        allowNull: false
      }
});

 //CREATE TABLE `stadium`
const Stadium = sequelize.define('stadium',{
    StadiumID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      StadiumName: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      TypeID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      OpenTime: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      CloseTime: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Size: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
});

//CREATE TABLE `typestadium`
const Type = sequelize.define('type_stadium',{
    TypeID:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TypeName:{
        type: Sequelize.STRING(40),
        allowNull: false
    }
});

// CREATE TABLE `users` 
const User = sequelize.define('user',{
    UserID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      UserPassword: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      UserName: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      Gender: {
        type: Sequelize.STRING(1),
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      Tel: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      Credit: {
        type: Sequelize.STRING(13),
        allowNull: false
      },
      Address: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      FirstDate: {
        type: Sequelize.DATE,
        allowNull: false
      }
});

Type.hasMany(Stadium,{
    foreignKey: 'TypeID'
});
Stadium.belongsTo(Type,{
    foreignKey: 'TypeID'
});

Type.hasMany(Sales,{
    foreignKey: 'TypeID'
});
Sales.belongsTo(Type,{
    foreignKey: 'TypeID'
});

User.hasMany(Sales,{
    foreignKey: 'UserID'
});
Sales.belongsTo(User,{
    foreignKey: 'UserID'
});

Stadium.hasMany(Sales,{
    foreignKey: 'StadiumID'
});
Sales.belongsTo(Stadium,{
    foreignKey: 'StadiumID'
});

sequelize.sync();

//---------------------------------Get All-----------------------------------------------------

app.get("/type_stadiums",(req,res)=>{
    Type.findAll()
    .then((type_stadiums)=>{
        res.status(200).json(type_stadiums);
    })
    .catch((err)=>{
        res.status(500).send(err);
    })
});

app.get("/stadiums",(req,res)=>{
    Stadium.findAll({
        include: Type
    })
    .then((stadiums)=>{
        res.status(200).json(stadiums);
    })
    .catch((err)=>{
        res.status(500).send(err);
    })
});

app.get("/users",(req,res)=>{
    User.findAll()
    .then((users)=>{
        res.status(200).json(users);
    })
    .catch((err)=>{
        res.status(500).send(err);
    })
});

app.get("/sales_datas",(req,res)=>{
    Sales.findAll({
        include: Type,
        include: Stadium,
        include: User
    })
    .then((sales_datas)=>{
        res.status(200).json(sales_datas);
    })
    .catch((err)=>{
        res.status(500).send(err);
    })
})

//---------------------------------Get-----------------------------------------------------

app.get("/type_stadiums/:TypeID",(req,res)=>{
    Type.findByPk(req.params.id)
    .then((type_stadium)=>{
        if (!type_stadium) {
            res.send(404).json("Type not found!");
        } else {
            res.status(200).json(type_stadium);
        }
    })
    .catch((err)=>{
        res.status(500).send(err);
    })
});

//-------------------------------------------------------------------------------------------

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on ${port}`);
})