import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true)
    await login({email, password}) 
    toast.success("Successfully logged in!");
    setLoading(false)

    navigate("/");
  };

  return (
<Container
  maxWidth="xs"
  sx={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Box
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      p: 3,
    }}
  >
    <Typography variant="h4">Login</Typography>

    {error && <Alert severity="error">{error}</Alert>}

    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <TextField
        label="Email"
        type="email"
        size="small"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        size="small"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button 
      type="submit"
      variant="contained"
      loading={loading}
      loadingPosition="end" 
      fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  </Box>
</Container>

  );
};

export default Login;
