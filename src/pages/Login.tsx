import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  // Use our new auth hook
  useAuth("/");

  return (
    <div className="min-h-screen bg-[#FAFBFD] py-8 px-4">
      <div className="container mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-[#403E43] mb-8 text-center">
          Welcome to Expense Tracker
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;