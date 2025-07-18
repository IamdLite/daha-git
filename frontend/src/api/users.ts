export interface User {
  id: number;
  username: string;
  first_name?: string;
}

export const registerUser = async (userData: {
  id: number;
  username: string;
  first_name?: string;
}): Promise<User> => {
  const response = await fetch("http://daha.linkpc.net/api/users", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Failed to register user: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const user: User = await response.json();
  return user;
};