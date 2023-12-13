const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');


// Schema Definition
const AccountSchema = mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  userID: {
    type: Number,
    required: true,
    unique: true
  }
});

const UserSchema = mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique: true
  },
  commentIDs: [{
    type: Number,
    unique: true
  }],
  favouriteIDs: [{
    type: Number,
    unique: true
  }]
});

const EventSchema = mongoose.Schema({
  ID: {
    type: Number,
    required: true,
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
    ID: {
        type: Number,
        required: true,
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
  ID: {
      type: Number,
      required: true,
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
    required: true,
    unique: true
  }
});

const FavouriteSchema = mongoose.Schema({
  ID: {
      type: Number,
      required: true,
      unique: true
  },
  author: {
    type: String,
    required: true,
  },
  locationID: {
    type: Number,
    required: true,
    unique: true
  }
});


// Collection initialization
const Account = mongoose.model("Account", AccountSchema);
const User = mongoose.model("User", UserSchema);
const Event = mongoose.model("Event", EventSchema);
const Location = mongoose.model("Location", LocationSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Favourite = mongoose.model("Favourite", FavouriteSchema);


// Function definition



// Constant Definition
const SchemaToCollection = {
  account: Account,
  user: User,
  event: Event,
  location: Location,
  comment: Comment,
  favourite: Favourite
};

const SchemaToID = {
  account: 'username',
  user: 'userID',
  event: 'eventID',
  location: 'locationID',
  comment: 'commentID',
  favourite: 'favouriteID'
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
  // Create one document for the specified Collection
  app.post('/:schema/create', async (req, res) => {
    try{
      const Collection = SchemaToCollection[req.params.schema];
      const newDocument = new Collection(req.body);
      await newDocument.save();

      res.send();
    }
    catch (error) {
      res.send(error.message);
    }
  });


  // CRUD - Read
  // Read all documents from the specified Collection
  app.get('/:schema', async (req, res) => {
    try{
      const Collection = SchemaToCollection[req.params.schema];
      const allDocuments = await Collection.find();
      res.setHeader('Content-Type', 'text/plain');
      res.send(allDocuments);
    }
    catch (error) {
      res.status(404);
      res.send(`Error getting Documents.`);
    }
  });

  // Read the requested document from the specified Collection
  app.post('/:schema/find', async (req, res) => {
    try{
      const criterion = req.body;
      const Collection = SchemaToCollection[req.params.schema];
      const requestedDocuments = await Collection.find(criterion);
      res.setHeader('Content-Type', 'text/plain');
      res.send(requestedDocuments);
    }
    catch (error) {
      res.status(404);
      res.send(`Error getting Documents.`);
    }
  });

  // Check the ID and password against the database
  // If valid, return the user ID
  // Otherwise, return the reason for unsuccessful login
  app.post('/login', async (req, res) => {
    try{
      const ID = req.body.ID;
      const password = req.body.password;
      
      const account = await Account.findOne({ID: ID});
      if (!account) {
        throw new Error('User Name does not exist.');
      }
      if (account.password !== password) {
        throw new Error('Incorrect password.');
      }

      res.setHeader('Content-Type', 'text/plain');
      res.send(account.userID);
    }
    catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });

  // CRUD - Update

  // Update data for an account
  app.post('/update/:schema', async (req, res) => {
    try{
      const Collection = SchemaToCollection[req.params.schema];
      const findID = req.body.ID;
      console.log('Update ' + req.params.schema);
      Collection.findOneAndUpdate(
        {ID: { $eq: findID }},
        {$set: req.body}
      )
      .then((data) => {
        console.log("Your" + req.params.schema + "is updated");
      })
      .catch((error) => {
        console.log("Failed");
        throw new Error("Failed");
      });
    }
    catch (error) {
      res.status(404);
      res.send(error.message);
    }
  });






  // CRUD - Delete
  app.post('/:schema/delete', async (req, res) => {
    try{
      const criterion = req.body;
      const Collection = SchemaToCollection[req.params.schema];
      await Collection.findOneAndDelete(criterion);
      res.setHeader('Content-Type', 'text/plain');
      res.send(requestedDocuments);
    }
    catch (error) {
      res.status(404);
      res.send(`Error deleting Documents.`);
    }
  });







});

// listen to port 3000
const server = app.listen(3000);