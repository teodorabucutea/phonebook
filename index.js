const express = require("express");
const cors = require("cors");
const app = express();
var morgan = require("morgan");
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
// app.use(morgan("tiny"));

morgan.token("postData", (request) => {
  if (request.method == "POST") return " " + JSON.stringify(request.body);
  else return " ";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello Frontend!</h1>");
});

app.get("/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  numberOfPeople = persons.length;

  const currentTime = new Date().toLocaleString();

  response.send(
    `<p>Phonebook has info for ${numberOfPeople} people</p><br/><p>${currentTime}</p>`
  );
});

app.get("/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(409).json({
      error: "Conflict, name already exist",
    });
  }

  console.log("llalalala");

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
