import React from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Avatar, Chip } from '@mui/material';
import { Person, Email, Business, Psychology } from '@mui/icons-material';

const ProfilePage = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    role: 'Senior Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    learningGoals: ['Master React', 'Learn Machine Learning', 'Improve Leadership Skills']
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                  {user.name.charAt(0)}
                </Avatar>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user.role}</Typography>
                <Chip label={user.department} color="primary" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={user.name}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user.email}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={user.department}
                    InputProps={{
                      startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={user.role}
                    InputProps={{
                      startAdornment: <Psychology sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.skills.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Goals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Goals
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.learningGoals.map((goal, index) => (
                  <Chip key={index} label={goal} color="secondary" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;


