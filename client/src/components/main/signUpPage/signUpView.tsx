import {
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    Link,
    Divider,
    Paper
  } from "@mui/material";
  import { useSignup } from "../../../hooks/useSignUp";
  import { VoidFunctionType } from "../../../types/functionTypes";
  
  interface SignupProps {
    handleLogin: VoidFunctionType;
  }
  
  const Signup = ({ handleLogin }: SignupProps) => {
    const {
      username,
      setUsername,
      email,
      setEmail,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
      usernameErr,
      emailErr,
      passwordErr,
      confirmPasswordErr,
      registerUser
    } = useSignup(handleLogin);
  
    return (
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 500,
          margin: 'auto',
          p: 4,
          mt: 3,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          gutterBottom 
          color="primary" 
          sx={{ mb: 3 }}
        >
          Create an Account
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Stack spacing={3}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameErr}
            helperText={usernameErr || "Choose a unique username (min 3 characters)"}
            id="signupUsernameInput"
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailErr}
            helperText={emailErr || "Enter a valid email address"}
            id="signupEmailInput"
            type="email"
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordErr}
            helperText={passwordErr || "At least 6 characters"}
            id="signupPasswordInput"
            type="password"
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="Confirm Password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordErr}
            helperText={confirmPasswordErr || ""}
            id="signupConfirmPasswordInput"
            type="password"
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              * indicates mandatory fields
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={registerUser}
              size="large"
              sx={{ 
                py: 1.5,
                fontWeight: 'medium',
                fontSize: '1rem'
              }}
            >
              Sign Up
            </Button>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link 
                component="button" 
                onClick={handleLogin}
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 'medium',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  };
  
  export default Signup;