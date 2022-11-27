import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export const ENDPOINT = "http://localhost:4000";

const getTodos = () => fetch(`${ENDPOINT}/api/todos`).then((r) => r.json());

const createTodo = (todo: { title: string; body: string }) => {
  return fetch(`${ENDPOINT}/api/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  }).then((r) => r.json());
};

const deleteTodo = (id: string) => {
  return fetch(`${ENDPOINT}/api/todos/${id}/delete`, {
    method: "DELETE",
  }).then((r) => r.json());
};

const completeTodo = (id: string) => {
  return fetch(`${ENDPOINT}/api/todos/${id}/done`, {
    method: "PATCH",
  }).then((r) => r.json());
};

function App() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deletion = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const markTodoAsComplete = useMutation({
    mutationFn: completeTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  if (data) {
    return (
      <div className="h-screen mx-auto w-full flex items-center justify-center flex-col space-y-3">
        <h1 className="text-2xl text-red-400">hi</h1>

        {data.map((todo: any) => (
          <div key={todo.id} className="flex flex-col p-2 space-y-2">
            <h1>{todo.title}</h1>
            <p>{todo.body}</p>
            {todo.done ? (
              <></>
            ) : (
              <button
                onClick={() => {
                  markTodoAsComplete.mutate(todo.id);
                }}
              >
                Complete?
              </button>
            )}
            <button onClick={() => deletion.mutate(todo.id)}>Delete</button>
          </div>
        ))}

        <div className="px-3 py-4 rounded-md flex flex-col justify-center bg-blue-300">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
          <label>Body</label>
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            type="text"
          />
          <button
            onClick={() => {
              mutation.mutate({
                body: body,
                title: title,
              });
              setBody("");
              setTitle("");
            }}
          >
            Add Todo
          </button>
        </div>
      </div>
    );
  }

  return <div>loading...</div>;
}

export default App;
