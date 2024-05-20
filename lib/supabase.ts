import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iigdhrkfuqfbnxhqxogy.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZ2RocmtmdXFmYm54aHF4b2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NzMyNzYsImV4cCI6MjAzMTQ0OTI3Nn0.P_827l2ZjXgs_azYr3WERE9Y9KsihCRkFE82PWa9Plg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})