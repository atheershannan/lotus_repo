import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { Analytics, TrendingUp, School, Psychology } from '@mui/icons-material';

const AnalyticsPage = () => {
  const analyticsData = {
    totalUsers: 150,
    activeUsers: 120,
    totalCourses: 25,
    completedCourses: 180,
    averageCompletionRate: 75,
    topSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL'],
    recentActivity: [
      { user: 'John Doe', action: 'completed', course: 'JavaScript Basics', time: '2 hours ago' },
      { user: 'Jane Smith', action: 'started', course: 'React Fundamentals', time: '3 hours ago' },
      { user: 'Mike Johnson', action: 'completed', course: 'Python Programming', time: '5 hours ago' },
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Analytics
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Analytics color="primary" />
                <Box>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">{analyticsData.totalUsers}</Typography>
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
                  <Typography variant="h6">Active Users</Typography>
                  <Typography variant="h4">{analyticsData.activeUsers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <School color="info" />
                <Box>
                  <Typography variant="h6">Total Courses</Typography>
                  <Typography variant="h4">{analyticsData.totalCourses}</Typography>
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
                  <Typography variant="h6">Completion Rate</Typography>
                  <Typography variant="h4">{analyticsData.averageCompletionRate}%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Skills */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analyticsData.topSkills.map((skill, index) => (
                  <Chip 
                    key={index}
                    label={skill} 
                    color="primary" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {analyticsData.recentActivity.map((activity, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {activity.user} {activity.action} {activity.course}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;


