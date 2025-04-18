import React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Divider,
  Link,
  FormControlLabel,
  Checkbox,
  Stack
} from '@mui/material';
import { useLogin } from "../../../hooks/useLogIn";
import { VoidFunctionType } from "../../../types/functionTypes";

// Type definition for props passed to Login component
interface LoginProps {
  handleSignUp: VoidFunctionType;
  handleBackToMain: VoidFunctionType;
}

/**
 * The component renders the form for user login.
 * It uses the useLogin hook to manage the state of the form and handle authentication.
 * After successful login, it returns to the main page.
 * @param props contains functions to handle redirection after login or to sign up
 * @returns the Login component.
 */
const Login = ({ handleSignUp, handleBackToMain }: LoginProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailErr,
    passwordErr,
    loginUser
  } = useLogin(handleBackToMain);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom 
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}
        >
          Log in to your Account
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Stack spacing={3}>
          <TextField
            fullWidth
            id="loginEmailInput"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailErr}
            helperText={emailErr || "Enter your registered email address"}
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            id="loginPasswordInput"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordErr}
            helperText={passwordErr}
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={<Checkbox id="rememberMe" />}
              label="Remember me"
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 2
          }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              onClick={loginUser}
              sx={{ 
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Log in
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start', mb: 2 }}>
              * indicates mandatory fields
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link 
              component="button"
              variant="body1"
              onClick={handleSignUp}
              sx={{ 
                fontWeight: 'medium',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;