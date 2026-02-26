// import { NextResponse } from "next/server";
// import mysql from "mysql2/promise";

// export async function GET() {
//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       port: 3306,
//     });

//     const [rows] = await connection.query("SELECT 1 + 1 AS result");

//     return NextResponse.json({ rows });
//   } catch (error: any) {
//     console.error("DB ERROR:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }