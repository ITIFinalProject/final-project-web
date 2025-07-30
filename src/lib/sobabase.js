import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fibsnglrcxgjvbhytzvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYnNuZ2xyY3hnanZiaHl0enZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDY0NzAsImV4cCI6MjA2OTEyMjQ3MH0.Z7NTozQca44lJyCtkNmLY8XttKam78xWTqBYJaTrvJ4';

export const supabase = createClient(supabaseUrl, supabaseKey);
