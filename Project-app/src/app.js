const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const questionRoutes = require('./routes/questions');
const contentRoutes = require('./routes/contents');
const scheduleRoutes = require('./routes/schedules');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);
app.use('/contents', contentRoutes);
app.use('/schedules', scheduleRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});