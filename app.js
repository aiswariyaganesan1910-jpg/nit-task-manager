const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const SECRET = "secret"; // use env in real apps

// ================= MIDDLEWARE =================

// Verify Token
function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return res.status(401).send("No token");

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

// Role check
function allowRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).send("Access denied");
    }
    next();
  };
}

// ================= REGISTER =================

app.post("/register", async (req, res) => {
  try {
    const { email, password, orgName, role } = req.body;

    // check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // create org
    const org = await prisma.organization.create({
      data: { name: orgName }
    });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: role || "USER", // default USER
        orgId: org.id
      }
    });

    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= LOGIN =================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return res.send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.send("Wrong password");

    const token = jwt.sign(
      {
        id: user.id,
        orgId: user.orgId,
        role: user.role
      },
        SECRET
    );

    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
 
});

// ================= CREATE TASK (ADMIN ONLY) =================

app.post("/tasks", verifyToken, allowRole("ADMIN"), async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send("Title is required");
    }

    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        createdBy: req.user.id,
        orgId: req.user.orgId
      }
    });

    res.json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= GET TASKS =================

app.get("/tasks", verifyToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        orgId: req.user.orgId
      }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= UPDATE TASK =================

app.put("/tasks/:id", verifyToken, async (req, res) => {
  try {
    const existing = await prisma.task.findUnique({
      where: { id: req.params.id }
    });

    if (!existing || existing.orgId !== req.user.orgId) {
      return res.status(403).send("Forbidden");
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { title: req.body.title }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= DELETE TASK =================

app.delete("/tasks/:id", verifyToken, async (req, res) => {
  try {
    const existing = await prisma.task.findUnique({
      where: { id: req.params.id }
    });

    if (!existing || existing.orgId !== req.user.orgId) {
      return res.status(403).send("Forbidden");
    }

    await prisma.task.delete({
      where: { id: req.params.id }
    });

    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= SERVER =================

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});