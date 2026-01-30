import mysql from 'mysql2/promise';

console.log("--- STARTING DATABASE CONNECTION ---");

export const pool = mysql.createPool({
  host: '127.0.0.1',  // Using the IP address is more stable than 'localhost'
  user: 'root', 
  password: 'Beza102#', 
  database: 'team4mation',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✅ DB Pool initialized with user: root");