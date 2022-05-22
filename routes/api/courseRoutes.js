const router = require('express').Router();
const {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addStudentToCourse,
} = require('../../controllers/courseController.js');

// /api/courses
router.route('/').get(getCourses).post(createCourse);

// /api/courses/:courseId
router
  .route('/:courseId')
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);

  router
  .route('/addStudent/:courseId')
  .put(addStudentToCourse);

module.exports = router;
