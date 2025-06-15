const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchAllTodos = async () => {
  const response = await fetch(`${BASE_URL}/todos`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchTodoById = async (id) => {
  const response = await fetch(`${BASE_URL}/todos/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Todo not found');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createTodo = async (newTodoData) => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newTodoData.title,
      completed: false,
      userId: 1,
    }),
  });
  if (!response.ok) throw new Error('Failed to add todo');
  return response.json();
};

export const updateTodo = async (updatedTodoData) => {
  const response = await fetch(`${BASE_URL}/todos/${updatedTodoData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTodoData),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

export const deleteTodo = async (todoId) => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo');
  return true;
};