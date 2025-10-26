import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Card, CardContent, Grid, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, School, Psychology, Chat } from '@mui/icons-material';

const DashboardPage = () => {
  const user = useSelector(state => state.auth.user);
  const progress = useSelector(state => state.progress.progress);
  const stats = useSelector(state => state.progress.stats);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <School color="primary" />
                <Box>
                  <Typography variant="h6">Courses</Typography>
                  <Typography variant="h4">12</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Psychology color="secondary" />
                <Box>
                  <Typography variant="h6">Skills</Typography>
                  <Typography variant="h4">8</Typography>
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
                  <Typography variant="h6">Progress</Typography>
                  <Typography variant="h4">75%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chat color="info" />
                <Box>
                  <Typography variant="h6">Chats</Typography>
                  <Typography variant="h4">24</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Progress
              </Typography>
              {progress.slice(0, 5).map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.content?.title || item.skill?.name}</Typography>
                    <Typography variant="body2">{item.completionPercentage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.completionPercentage} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Start New Course" color="primary" clickable />
                <Chip label="Ask Assistant" color="secondary" clickable />
                <Chip label="View Skills" color="success" clickable />
                <Chip label="Check Progress" color="info" clickable />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;


