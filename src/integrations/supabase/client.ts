// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wypektehlyzmewlpilpm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cGVrdGVobHl6bWV3bHBpbHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NDgwODcsImV4cCI6MjA1MTEyNDA4N30.U2RszY5J6KrBbGtUKE0vymsA_lAnCMzmKv9OQnprCmU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);