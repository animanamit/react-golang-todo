import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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

  return (
    <div className="h-screen mx-auto w-full flex items-center justify-center">
      <h1 className="text-2xl text-red-400">hi</h1>
      {isLoading ? <h1>loading</h1> : <></>}
      {data ? <h1>data</h1> : <></>}

      <button
        onClick={() => {
          mutation.mutate({
            body: "body",
            title: "Do Laundry",
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

export default App;
