import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const resolvers = {
  Query: {
    // Get all users
    users: async (_: any, __: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM users;');
      return result.rows;
    },
    // Get a single user by ID
    user: async (_: any, { id }: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    },
    // Get a single user by username
    username: async (_: any, { username }: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0];
    },
    // Get all projects
    projects: async (_: any, __: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM projects;');
      return result.rows;
    },
    // Get a single project by ID
    project: async (parent: any, args: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM projects WHERE id = $1', [args.id]);
      return result.rows[0];
    },
    // A history log of every project registered with Kensa
    historyLog: async (_: any, __: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM history_log;');
      return result.rows;
    },
    historyLogDev: async (_: any, __: any, { db }: any) => {
      const result = await db.query('SELECT * FROM history_log_dev;');
      return result.rows;
    }

    // test for mongodb migration
    testUser: async (_: any, __: any, { db }: any) => {
      const result = await db.
      return result;
    }
  },
  Mutation: {
    addProject: async (_: any, { project_name, api_key, server_url, user }: any, { db }: any) => {
      const result = await db.query('INSERT INTO projects(project_name, api_key, server_url, user_id) VALUES($1, $2, $3, $4) RETURNING *;', [project_name, api_key, server_url, user]);
      return result.rows[0];
    },
    deleteProject: async (_: any, { id }: any, { db }: any) => {
      const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *;', [id]);
      return result.rows[0];
    },
    createUser: async (_: any, { username, password }: any, { db }: any) => {
      // Check if there is a same username exists in the database. If yes, throw error
      const dbResult = await db.query('SELECT username FROM users WHERE username = $1', [username]);
      const existingUser = dbResult.rows[0];
      if (existingUser) {
        throw new GraphQLError('Please choose different username', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert new user into database
      await db.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING username;', [username, hashedPassword]);
      // Create token to send back to client
      const token = jwt.sign({ username: username }, process.env.JWT_KEY);

      return { username, token };
    },
  },
  User: {
    projects: async ({ id: user_id }: any, __: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM projects WHERE user_id = $1', [user_id]);
      return result.rows;
    }
  },
  Project: {
    user: async ({ user_id }: any, __: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
      return result.rows[0];
    },
    history_log: async ({ id: project_id }: any, __: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM history_log WHERE project_id = $1', [project_id]);
      return result.rows;
    },
    history_log_dev: async ({ id: project_id }: any, __: any, { db }: any) => {
      const result = await db.query('SELECT * FROM history_log_dev WHERE project_id = $1', [project_id]);
      return result.rows;
    }
  },
  Log: {
    project: async({ project_id }: any, __: any, { db }: any, info: any) => {
      const result = await db.query('SELECT * FROM projects WHERE id = $1', [project_id]);
      return result.rows[0];
    }
  }
};