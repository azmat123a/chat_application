const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./_routes/users/users');
const imageRoutes = require('./_routes/uploads/uploads');

const app = express();

app.use(cors());
app.use(express.json());

// Replace the connection string below with the one you got from MongoDB Atlas
const uri = "mongodb+srv://chat_application_user:123456.a@chatapplication.wfq1c87.mongodb.net/chat_application?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Route for users
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
