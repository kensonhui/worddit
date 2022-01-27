
import { Container, Typography, Box } from '@mui/material';
import { AppBar } from '@mui/material';
import Worddit from './components/Worddit'
import bunnySVG from './assets/bunny.svg'
import './App.css';

function App() {
  return (
    <div>
        <AppBar position="static" >
          <Typography variant="h4" color="inherit" m={2}>
            <Box  m={0} sx={{alignItems: "baseline"}}>
              Worddit
              <img style={{width: 50, height: 50}} alt="bunny" src={bunnySVG}></img>
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
