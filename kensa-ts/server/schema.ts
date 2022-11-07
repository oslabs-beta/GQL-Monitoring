import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    "Query to get one user "
    user(id: ID!): User
    "Query to get one user by username"
    username(username: String!): User
    "Query to get all users registered with the app"
    users: [User!]
    "Query to get all projects monitored by the app"
    projects: [Project!]
    "Query to get specific project monitored by the app"
    project(id: ID!): Project
    "Query to get all history log for Production"
    historyLog: [Log!]
    "Query to get all history log for development in Playground"
    historyLogDev: [Log!]
  }

  type Mutation {
    "Mutation to create a user"
    createUser(username: String!, password: String!): CreateUserResponse!
    "Mutation to add a project, history log is default to empty array"
    addProject(project: ProjectInput!): Project!
    "Mutation to delete a project given an ID"
    deleteProject(id: ID!): Project!
    "Mutation to update a project given ProjectInput"
    updateProject(id: ID!, project: ProjectInput!): Project!
    "Mutation to change password"
    changePassword(userInput: ChangePasswordInput!): User!
  }

  type CreateUserResponse {
    "Username that user submit when signing up"
    username: String!
    "JWT token that contain user's username info"
    token: String!
  }

  type User {
    id: ID!
    "User's username, which is unique"
    username: String!
    "User's password"
    password: String!
    "User's list of projects"
    projects: [Project!]
  }

  type Project {
    id: ID!
    project_name: String!
    "the API key of this project"
    api_key: String!
    "Server URL where this project is running at"
    server_url: String!
    "Owner of this project"
    user: User!
    "All history log associated with this project"
    history_log: [Log]
    "All history log associated with this project (development)"
    history_log_dev: [Log]
  }

  type Log {
    id: ID!
    "Operation name of query"
    operation_name: String
    "Query submitted to the backend server"
    query_string: String!
    "Project where this query is submitted"
    project: Project!
    "Total query execution time"
    execution_time: Int!
    "Time at which query was submitted to server"
    created_at: String!
    "Status of this query"
    success: Boolean!
  }

  input ProjectInput {
    project_name: String!
    api_key: String
    server_url: String!
    userId: String
  }

  input ChangePasswordInput {
    username: String!
    oldPassword: String!
    newPassword: String!
  }
`;

