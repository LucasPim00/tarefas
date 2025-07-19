import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTodos = async (_req: Request, res: Response) => {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(todos);
};

export const createTodo = async (req: Request, res: Response) => {
  const { title } = req.body;
  const newTodo = await prisma.todo.create({ data: { title } });
  res.json(newTodo);
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const updated = await prisma.todo.update({
    where: { id: Number(id) },
    data: { title, completed },
  });
  res.json(updated);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id: Number(id) } });
  res.status(204).send();
};