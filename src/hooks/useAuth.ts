import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FunctionsHttpError, type User } from "@supabase/supabase-js";

interface ExtendedUser extends User {
  brand_id?: string;
  verification_status?: string;
  is_admin?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user in localStorage first
    const demoUser = localStorage.getItem("demo_user");
    if (demoUser) {
      try {
        const parsedUser = JSON.parse(demoUser);
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("demo_user");
      }
    }

    // Get initial session from Supabase
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        // If Supabase fails, just set loading to false
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Attempting signup with:", { email, fullName });

      // Use custom verification service instead of Supabase's built-in email
      const { data, error } = await supabase.functions.invoke(
        "custom-auth-verification",
        {
          body: {
            action: "signup",
            email,
            password,
            fullName,
          },
        }
      );

      if (error) {
        // Supabase error wrapper (non-2xx)
        if (error instanceof FunctionsHttpError) {
          const errorBody = await error.context.json().catch(() => null);
          console.error("Edge function error body:", errorBody);
          throw new Error(
            errorBody?.error || "Signup failed. Please try again."
          );
        }

        throw error;
      }

      if (data.success === false) {
        throw new Error(data.error || "Signup failed. Please try again.");
      }

      console.log("Custom signup successful:", data);

      return {
        user: null,
        session: null,
        needsConfirmation: true,
        message: data.message,
      };
    } catch (err) {
      console.error("Signup catch block:", err);
      throw new Error(
        err.message ||
          "Network error. Please check your connection and try again."
      );
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting signin with:", { email });

      // Check if we're using demo credentials
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error:", error);
        throw new Error(error.message || "Sign in failed");
      }

      console.log("Signin successful:", data);
      return data;
    } catch (err) {
      console.error("Signin catch block:", err);
      throw err;
    }
  };

  const signOut = async () => {
    // Clear demo user from localStorage
    localStorage.removeItem("demo_user");
    setUser(null);

    // Also try to sign out from Supabase if connected
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn("Supabase signout warning:", error);
    } catch (e) {
      console.warn("Supabase signout failed:", e);
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
