const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Route to create a new schedule
router.post('/', scheduleController.createSchedule);

// Route to list schedules for a specific user
router.get('/:userId', scheduleController.listSchedules);

module.exports = router;