const request = require("supertest");
const { app } = require("../app");
const { Task } = require("../models/tasks");

describe("Todo CRUD API", () => {
  test("Read Todos", async () => {
    const response = await request(app).get("/todo/all");
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("object");
    expect(Array.isArray(response.body)).toBe(true);
    expect(typeof response.body[0]).toBe("object");
    return;
  });
  test("Get One Todo", async () => {
    const todo = await Task.findOne();
    if (!todo) {
      return;
    }
    const response = await request(app).get(`/todo/one?id=${todo.id}`);
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("object");
    expect(todo.name).toStrictEqual(response.body.name);
    expect(String(todo._id)).toStrictEqual(response.body._id);
  });

  test("Get Non Existing Todo", async () => {
    let id = "5e8f3cdb40c3fd0ac01c308f";
    const response = await request(app).get(`/todo/one?id=${id}`);
    expect(response.status).toBe(404);
  });

  test("Post Todo", async () => {
    const now = Date.now();
    const data = {
      name: `My Test Todo Created ${now}`,
    };
    const response = await request(app).post("/todo/create").send(data);
    const todo = await Task.findOne({ name: data.name });
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("object");
    expect(todo.name).toStrictEqual(response.body.name);
    expect(todo.name).toStrictEqual(data.name);
    await todo.remove();
  });

  // Todo for students
  /*
        1. Add test for update todo
        2. Add test for delete todo
    */

  test("Update Todo", async () => {
    const todo = await Task.findByIdAndUpdate();
    if (!todo) {
      return;
    }
    const now = Date.now();
    const data = {
      name: `My Todo updated at ${now}`,
    };
    const response = await request(app)
      .patch(`/todo/update/${todo.id}`)
      .send(data);
    expect(response.status).toBe(201);
    expect(typeof response.body).toBe("object");
    expect(todo.name).toStrictEqual(response.body.name);
    expect(todo.name).toStrictEqual(data.name);
  });

  test("Delete One Todo", async () => {
    const todo = await Task.findByIdAndDelete();
    if (!todo) {
      return;
    }
    const response = await request(app).delete(`/todo/delete/${todo.id}`);
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("object");
    expect(response.body.message).toBe("Todo successfully deleted");
  });
});
