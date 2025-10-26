import React from 'react';
import { Box, Typography, Card, CardContent, Grid, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, School, Psychology } from '@mui/icons-material';

const ProgressPage = () => {
  const progressData = [
    { title: 'JavaScript Fundamentals', type: 'course', progress: 75, completed: false },
    { title: 'React Basics', type: 'course', progress: 45, completed: false },
    { title: 'Node.js Introduction', type: 'course', progress: 30, completed: false },
    { title: 'Python Programming', type: 'course', progress: 100, completed: true },
    { title: 'SQL Database', type: 'course', progress: 60, completed: false },
    { title: 'Git Version Control', type: 'course', progress: 70, completed: false },
  ];

  const stats = {
    totalCourses: 12,
    completedCourses: 3,
    inProgressCourses: 6,
    averageProgress: 65
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Progress
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <School color="primary" />
                <Box>
                  <Typography variant="h6">Total Courses</Typography>
                  <Typography variant="h4">{stats.totalCourses}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="success" />
                <Box>
                  <Typography variant="h6">Completed</Typography>
                  <Typography variant="h4">{stats.completedCourses}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Psychology color="warning" />
                <Box>
                  <Typography variant="h6">In Progress</Typography>
                  <Typography variant="h4">{stats.inProgressCourses}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="info" />
                <Box>
                  <Typography variant="h6">Avg Progress</Typography>
                  <Typography variant="h4">{stats.averageProgress}%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Course Progress
          </Typography>
          
          {progressData.map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip 
                    label={item.type} 
                    size="small" 
                    variant="outlined"
                  />
                  {item.completed && (
                    <Chip 
                      label="Completed" 
                      size="small" 
                      color="success"
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {item.progress}%
                  </Typography>
                </Box>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={item.progress} 
                sx={{ height: 8, borderRadius: 4 }}
                color={item.completed ? 'success' : 'primary'}
              />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProgressPage;


