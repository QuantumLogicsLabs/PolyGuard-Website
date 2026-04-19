const SAMPLES = {
  python: `import sqlite3

def get_user(username):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # ⚠ SQL Injection vulnerability
    query = "SELECT * FROM users WHERE name = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchone()

def process_file(filename):
    f = open(filename, "r")
    data = f.read()
    f.close()
    return data

def format_greeting(name):
    return "Hello, %s!" % name`,

  javascript: `const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  const id = req.query.id;
  // ⚠ XSS vulnerability
  const html = '<h1>Welcome ' + id + '</h1>';
  res.send(html);
});

app.post('/login', (req, res) => {
  const { pass } = req.body;
  // ⚠ Hardcoded secret
  if (pass === "admin123") res.json({ token: "secret" });
});`,

  java: `import java.sql.*;

public class UserDAO {
    // ⚠ Hardcoded credentials
    private static final String DB_PASS = "root123";

    public User findUser(String name) throws Exception {
        Connection conn = DriverManager.getConnection(DB_URL, "root", DB_PASS);
        // ⚠ SQL Injection
        String sql = "SELECT * FROM users WHERE name = '" + name + "'";
        Statement stmt = conn.createStatement();
        return stmt.executeQuery(sql);
    }
}`,

  c: `#include <stdio.h>
#include <string.h>

void process_input(char* input) {
    char buffer[64];
    // ⚠ Buffer overflow — strcpy does no bounds check
    strcpy(buffer, input);
    printf("Input: %s\\n", buffer);
}

int main() {
    char* user_input = get_user_data();
    process_input(user_input);
    return 0;
}`,

  cpp: `#include <iostream>
#include <cstring>

class LoginManager {
    // ⚠ Hardcoded password in source
    const char* admin_pass = "secret123";

    bool authenticate(const char* pass) {
        char buffer[32];
        // ⚠ Buffer overflow
        strcpy(buffer, pass);
        return strcmp(buffer, admin_pass) == 0;
    }
};`,

  php: `<?php
$conn = mysqli_connect("localhost", "root", "root123", "mydb");

// ⚠ SQL Injection
$user = $_GET['user'];
$query = "SELECT * FROM users WHERE name = '$user'";
$result = mysqli_query($conn, $query);

// ⚠ XSS
echo "<h1>Hello " . $_GET['name'] . "</h1>";
?>`,

  ruby: `require 'sqlite3'

class UserService
  # ⚠ Hardcoded API key
  API_KEY = "sk-prod-abc123secret"

  def find_user(name)
    db = SQLite3::Database.new("users.db")
    # ⚠ SQL Injection via string interpolation
    rows = db.execute("SELECT * FROM users WHERE name = '#{name}'")
    rows.first
  end
end`,

  go: `package main

import (
    "database/sql"
    "fmt"
    "net/http"
)

// ⚠ Hardcoded credential
const dbPassword = "admin123"

func getUser(db *sql.DB, name string) {
    // ⚠ SQL Injection
    query := fmt.Sprintf("SELECT * FROM users WHERE name = '%s'", name)
    rows, _ := db.Query(query)
    defer rows.Close()
}`,
};
export default SAMPLES;
