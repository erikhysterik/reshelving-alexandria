import mysql from 'mysql2/promise'

let connection = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PW,
      database: process.env.MYSQL_DB,
      port: process.env.MYSQL_PORT || 3306,
    })
  }
  return connection
}

export async function query(sql, params = []) {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(sql, params)
    return rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function closeConnection() {
  if (connection) {
    await connection.end()
    connection = null
  }
}