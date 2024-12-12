import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import '@fontsource/roboto/500.css';
import { Box } from '@mui/material';

function Footer() {

    return (
        <Box position="static" sx={{ backgroundColor: '#054A91' }}>
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        padding: { xs: '16px 8px', sm: '16px' }, 
                        textAlign: 'center', 
                    }}
                >
                    <Typography
                        variant="caption"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            color: 'white',
                            textDecoration: 'none',
                            marginTop: { xs: '8px', sm: '0' }, 
                            width: '100%', 
                        }}
                    >
                        © Copyright 2020 - Melhor Celular - Todos os direitos reservados à Melhor Celular LTDA.
                    </Typography>
                </Toolbar>
            </Container>
        </Box>

    );
}
export default Footer;
