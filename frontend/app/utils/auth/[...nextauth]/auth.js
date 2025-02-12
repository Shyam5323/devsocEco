export const isAuthenticated = async () => {
    try {
      const res = await fetch("/api/check-auth", { credentials: "include" });
      if (!res.ok) return false;
  
      const data = await res.json();
      return data.isAuthenticated;
    } catch (error) {
      return false;
    }
  };
  