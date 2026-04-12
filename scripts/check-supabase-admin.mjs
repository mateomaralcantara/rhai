import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function mask(value) {
  if (!value) return "(vacío)";
  if (value.length <= 12) return value.slice(0, 2) + "****";
  return value.slice(0, 6) + "..." + value.slice(-6);
}

async function main() {
  console.log("=== Verificación Supabase Admin ===");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl || "(faltante)");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", mask(serviceRoleKey));

  if (!supabaseUrl) {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL en .env.local");
  }

  if (!serviceRoleKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en .env.local");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  console.log("\n1) Probando service role key...");
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  if (usersError) {
    console.error("❌ La service role key NO funciona.");
    console.error("Motivo:", usersError.message);
    process.exit(1);
  }

  console.log("✅ La service role key funciona.");
  console.log("Usuarios leídos por admin:", users?.users?.length ?? 0);

  console.log("\n2) Probando acceso a la tabla appointments...");
  const { data: rows, error: tableError } = await supabase
    .from("appointments")
    .select("id")
    .limit(1);

  if (tableError) {
    console.error("❌ La key funciona, pero la tabla appointments falla.");
    console.error("Motivo:", tableError.message);
    process.exit(2);
  }

  console.log("✅ La tabla appointments responde bien.");
  console.log("Filas devueltas en prueba:", Array.isArray(rows) ? rows.length : 0);

  console.log("\nTodo bien.");
}

main().catch((err) => {
  console.error("\n❌ Error fatal:");
  console.error(err.message || err);
  process.exit(99);
});