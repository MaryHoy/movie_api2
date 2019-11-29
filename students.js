const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(bodyParser.json());

let Students = [
  {
    id: 1,
    name: "Jessica Drake",
    classes: {
      biology: 95,
      algebra: 92
    }
  },
  {
    id: 2,
    name: "Ben Cohen",
    classes: {
      biology: 95,
      algebra: 92
    }
  },
  {
    id: 3,
    name: "Lisa Downing",
    classes: {
      biology: 95,
      algebra: 92
    }
  }
];

app.get("/students", (req, res) => {
  res.json(Students);
});

app.get("/students/:name", (req, res) => {
  res.json(
    Students.find(student => {
      return student.name === req.params.name;
    })
  );
});
app.post("/students", (req, res) => {
  let newStudent = req.body;

  if (!newStudent.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    newStudent.id = uuid.v4();
    Students.push(newStudent);
    res.status(201).send(newStudent);
  }
});

app.delete("/students/:id", (req, res) => {
  let student = Students.find(student => {
    return student.id === req.params.id;
  });

  if (student) {
    Students.filter(function(obj) {
      return obj.id !== req.params.id;
    });
    res.status(201).send("Student " + req.params.id + " was deleted.");
  }
});

app.put("/students/:name/:class/:grade", (req, res) => {
  let student = Students.find(student => {
    return student.name === req.params.name;
  });

  if (student) {
    student.classes[req.params.class] = req.params.grade;
    res
      .status(201)
      .send(
        "Student " +
          req.params.name +
          " was assigned a grade of " +
          req.params.grade +
          " in " +
          req.params.class
      );
  } else {
    res
      .status(404)
      .send("Student with the name " + req.params.name + " was not found.");
  }
});

app.get("/students/:name/gpa", (req, res) => {
  let student = Students.find(student => {
    return student.name === req.params.name;
  });

  if (student) {
    let classesArray = Object.keys(student.classes);
    let sumOfGrades = classesArray.reduce(function(sum, key) {
      return sum + parseFloat(classesArray[key]);
    }, 0);
    let gpa = sumOfGrades / classesArray.length;
    console.log(sumOfGrades);
    console.log(classesArray.length);
    console.log(gpa);
    res.status(201).send("" + gpa);
  } else {
    res
      .status(404)
      .send("Student with the name " + req.params.name + " was not found.");
  }
});

app.listen(8080, () => {
  console.log(`Your app is listening on port 8080`);
});
