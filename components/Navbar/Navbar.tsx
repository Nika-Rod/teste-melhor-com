import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Navbar() {

    return (
        <AppBar position="static" sx={{ backgroundColor: '#054A91' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: { xs: 'row', sm: 'row' },
                }}>
                    <Typography
                        variant="h2"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            display: 'flex', 
                            alignItems: 'center',
                            fontFamily: 'nunito',
                            letterSpacing: '.3rem',
                            color: '#DAE3ED',
                            textDecoration: 'none',
                            fontSize: { xs: '1.5rem', sm: '3rem' }, 
                        }}
                    >
                        M
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25px" 
                            height="50px" 
                            viewBox="0 0 100 150"
                            style={{
                                width: '25px', 
                                height: '50px', 
                            }}
                        >
                            <rect x="5" y="0" width="90" height="150" rx="20" ry="20" fill="white" />
                            <rect x="10" y="5" width="80" height="140" rx="15" ry="15" fill="black" />
                            <rect x="35" y="10" width="30" height="5" rx="2" ry="2" fill="gray" />
                            <rect x="30" y="125" width="40" height="5" rx="2" ry="2" fill="gray" />
                        </svg>
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
