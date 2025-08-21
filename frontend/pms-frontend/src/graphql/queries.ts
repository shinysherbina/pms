// src/graphql/queries.ts

import { gql } from "@apollo/client";

export const GET_ORGANIZATIONS = gql`
  query {
    organizations {
      id
      name
    }
  }
`;

export const GET_PROJECTS_BY_ORG = gql`
  query ($organizationId: Int!) {
    projects(organizationId: $organizationId) {
      id
      name
      status
      description
      dueDate
      completedTasks
      taskCount
    }
  }
`;

export const GET_TASKS_BY_PROJECT = gql`
  query ($projectId: Int!) {
    tasks(projectId: $projectId) {
      id
      title
      status
      assigneeEmail
      comments {
        id
        content
        authorEmail
      }
    }
  }
`;

export const GET_TASK_BY_ID = gql`
  query ($taskId: Int!) {
    task(id: $taskId) {
      id
      title
      description
      status
      assigneeEmail
      comments {
        id
        content
        authorEmail
      }
    }
  }
`;

export const GET_COMMENTS_BY_TASK = gql`
  query GetCommentsByTask($taskId: Int!) {
    taskComment(taskId: $taskId) {
      id
      content
      authorEmail
      task {
        id
      }
    }
  }
`;

export const GET_PROJECT_STATUS_COUNTS = gql`
  query GetProjectStatusCounts($organizationId: Int!) {
    organizationProjectStatusCounts(organizationId: $organizationId) {
      active
      completed
      archived
    }
  }
`;

// Mutations
// ---------
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!
    $slug: String!
    $contactEmail: String!
  ) {
    createOrganization(name: $name, slug: $slug, contactEmail: $contactEmail) {
      organization {
        id
        name
        slug
        contactEmail
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
    $organizationId: Int!
  ) {
    createProject(
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
      organizationId: $organizationId
    ) {
      project {
        id
        name
        status
        description
        dueDate
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: Int!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        status
        description
        dueDate
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: Int!
    $title: String!
    $description: String
    $status: String
    $assigneeEmail: String!
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
    ) {
      task {
        id
        title
        status
        assigneeEmail
        description
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: Int!
    $title: String
    $description: String
    $status: String
    $assigneeEmail: String
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
    ) {
      task {
        id
        title
        status
        assigneeEmail
        description
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $taskId: Int!
    $content: String!
    $authorEmail: String!
  ) {
    createTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment {
        id
        content
        authorEmail
        task {
          id
        }
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: Int!, $content: String, $authorEmail: String) {
    updateTaskComment(id: $id, content: $content, authorEmail: $authorEmail) {
      comment {
        id
        content
        authorEmail
        task {
          id
        }
      }
    }
  }
`;
