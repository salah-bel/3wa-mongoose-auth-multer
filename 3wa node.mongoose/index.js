const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => { console.log('Connected to mongodb') })
    .catch(err => console.log('Error connecting to mongodb'))

// definir le model 
const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: [5, 'Must be at least 6, got {VALUE}'] },
    author: String,
    tags: [String],
    isPublished: Boolean,
    date: { type: Date, default: new Date },
    price: Number,
});

const Course = mongoose.model('Course', CourseSchema);

// crrer une instence 
const createCourses = () => {
    const course = new Course({
        name: "C++",
        author: "Curl Pracis",
        tags: ["c", "backend"],
        isPublished: false,
        price: 10
    })

    course.save()
    console.log(course)
}
createCourses();

const findCourses = async() => {
        const courses = await Course
            .find()
            // .and([{ author: "David Prado" }, { price: { $eq: 25 } }])

        console.log(courses)
    }
    // findCourses();

/**
 * or
 * and
 */
const updateCourses = async(id) => {

    await Course.find({ _id: id }, { author: "jacky" }, () => {

    })

    console.log(course)
}

// updateCourses("6149a466ba9b9c62bf0c7853")