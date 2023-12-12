const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

// The Schema definitions

// schema for account
// used for login
const AccountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// schema for user
const UserSchema = mongoose.Schema({
  userID: {
    type: Number,
    required: [true, "userID is required"],
    unique: true
  },
  commentIDs: [{
    type: Number,
    unique: true
  }],
  favouriteIDs: [{
    type: Number,
    unique: true
  }],
});

// schema for events
const EventSchema = mongoose.Schema({
  eventID: {
    type: Number,
    required: [true, "eventID is required"],
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
          return value > 0;
      },
      message: () => "Please enter a valid quota",
      }
  },
  quota: {
    type: Number,
    required: true,
    validate: {
    validator: function (value) {
        return value > 0;
    },
    message: () => "Please enter a valid quota",
    }    
  },
  // An array of ObjectId references that refer to documents in the Location collection
  locationID: { type: Number },
});

const LocationSchema = mongoose.Schema({
    locationID: {
        type: Number,
        required: [true, "LocID is required"],
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    quota: {
        type: Number,
        validate: {
        validator: function (value) {
            return value > 0;
        },
        message: () => "Please enter a valid quota",
        }    
    },
    eventID: { type: Number },
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favourite' }]
});

const CommentSchema = mongoose.Schema({
  commentID: {
      type: Number,
      required: [true, "LocID is required"],
      unique: true
  },
  content: {
      type: String,
      required: true,
  },
  author: {
    type: String,
    required: true,
  },
  locationID: {
    type: Number,
    required: [true, "LocID is required"],
    unique: true
  }
});

const FavouriteSchema = mongoose.Schema({
  favouriteID: {
      type: Number,
      required: [true, "LocID is required"],
      unique: true
  },
  author: {
    type: String,
    required: true,
  },
  locationID: {
    type: Number,
    required: [true, "LocID is required"],
    unique: true
  }
});


// Schema Model initialization
const Account = mongoose.model("Account", AccountSchema);
const User = mongoose.model("User", UserSchema);
const Event = mongoose.model("Event", EventSchema);
const Location = mongoose.model("Location", LocationSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Favourite = mongoose.model("Favourite", FavouriteSchema);

// Function definition
async function displayAll(SchemaModel, req, res) {
  try{
    const allDocuments = await SchemaModel.find();
    res.setHeader('Content-Type', 'text/plain');
    res.send(allDocuments);
  }
  catch (error) {
    res.status(404);
    res.send(`Error getting Documents.`);
  }
};

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/project');
const db = mongoose.connection;

// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));

// Upon opening the database successfully
db.once('open', async function () {
  console.log("Connection is open...");

  // CRUD - Create

  // CRUD - Read

  // Read All
  // get all documents from Account Collection
  app.get('/account', async (req, res) => displayAll(Account, req, res));

  // get all documents from User Collection
  app.get('/user', async (req, res) => displayAll(User, req, res));

  // get all documents from Event Collection
  app.get('/event', async (req, res) => displayAll(Event, req, res));

  // get all documents from Location Collection
  app.get('/location', async (req, res) => displayAll(Location, req, res));

  // get all documents from Comment Collection
  app.get('/comment', async (req, res) => displayAll(Comment, req, res));

  // get all documents from Favourite Collection
  app.get('/favourite', async (req, res) => displayAll(Favourite, req, res));
  

  // CRUD - Update







  // CRUD - Delete








});

// listen to port 3000
const server = app.listen(3000);