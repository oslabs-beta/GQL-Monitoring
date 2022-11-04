import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Cookies from 'js-cookie';
import ProjectCard from "./ProjectCard";
import { Grid, GridItem } from "@chakra-ui/react";
import { Spinner, Alert, AlertIcon, Button, Heading, Box, Flex, Spacer, Center } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import AddProject from "./AddProject";

import { useDispatch, useSelector } from 'react-redux';
import { login } from "../features/auth/authSlice";


const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Log user in if they are already signed in
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      dispatch(login(user));
    }
  }, [user]);

  // const user = useSelector((state: RootState) => state.auth.user);
  console.log('userRedux in Projects', user);
  
  const { username } = useParams();

  // Prevent user from accessing Project by modifying URL
  if (username !== user.username) {
    return (
      <Center w='100%' h='100%'>
        <Alert status='error' h='100px' w='50%' borderRadius='10px'>
          <AlertIcon />
          Please login. You do not have access to this page
        </Alert>
      </Center>
    );
  }

  // Chakra Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
    
  const toAddProjectPage = ():void => {
    const path = 'new';
    navigate(path);
  };

  const GET_USER_PROJECT = gql`
    query GetUserProject($userName: String!) {
      username(username: $userName) {
        username
        projects {
          id
          project_name
          api_key       
        }
      }
    }
  `;

  const { error, data, loading } = useQuery(GET_USER_PROJECT, {
    variables: {
      userName: username
    }
  });
  
  if (loading) {
    return (
      <Center w='100%' h='100%'>
        <Spinner size='xl' />
      </Center>
    );
  }

  if (error) {
    return (
      <Center w='100%' h='100%'>
        <Alert status='error' h='100px' w='50%' borderRadius='10px'>
          <AlertIcon />
          There was an error processing your request
        </Alert>
      </Center>
    );
  }

  const projects = data.username.projects;
  const projectCards: Array<any> = [];

  for (let i = 0; i < projects.length; i++) {
    const projectName = projects[i]["project_name"];
    const projectId = projects[i]["id"];
    const apiKey = projects[i]["api_key"];

    projectCards.push(
      // <ProjectCard key={i} projectName={projectName} apiKey={apiKey} projectId={projectId} />
      <GridItem key={i} className='projects-grid-item'>
        <ProjectCard projectName={projectName} apiKey={apiKey} projectId={projectId} />
      </GridItem>
    );
  }

  return (
    <Box w='100%' h='100%' p={5}>
      <Flex align='center' justify='flex-end' marginBottom='30px'>
        <Heading id='welcome' >Welcome back, {data.username.username}</Heading>
        <Spacer />
        {/* Add Project Button */}
        <Button onClick={onOpen} colorScheme='facebook'>New Project</Button>
      </Flex>
      <AddProject isOpen={isOpen} onClose={onClose} />
      
      {/* Display Projects */}
      {/* <Flex gap={5} m={5} direction='column'>
        {projectCards}
      </Flex> */}
      <Grid id='projects-grid-container'>
        {projectCards}
      </Grid>     
    </Box>
  );
};

export default Projects;