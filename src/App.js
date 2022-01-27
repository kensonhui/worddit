import logo from './logo.svg';
import { useEffect, useState } from 'react';
import RICIBs from './components/ReactIndividualCharacterInputBoxes'
import { Button, Grid, Icon, SvgIcon, Toolbar, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { IconButton, Container} from '@mui/material';
import { dictionary } from './assets/dictionary';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppBar } from '@mui/material';
import './App.css';
import { green } from '@mui/material/colors';
import Worddit from './components/Worddit'
import bunnySVG from './assets/bunny.svg'

function App() {
  return (
    <div>
        <AppBar position="static" >
          
          <Typography variant="h4" color="inherit" m={2}>
            
            <Box  m={0} sx={{alignItems: "baseline"}}>
              Worddit
              <img style={{width: 50, height: 50}}src={bunnySVG}></img>
              
          </Box>
          </Typography>
          
        
        </AppBar>
        <Container>
        <Worddit />
      </Container>
    </div>
  )

}

export default App;
