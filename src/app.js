const express = require('express');
const bodyParser = require('body-parser');
const setRoutes = require('./routes/index');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Initialize routes
setRoutes(app);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
