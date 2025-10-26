import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button, LinearProgress } from '@mui/material';
import { Psychology, TrendingUp, School } from '@mui/icons-material';

const SkillsPage = () => {
  const skills = [
    { name: 'JavaScript', level: 'intermediate', progress: 75, category: 'Programming' },
    { name: 'React', level: 'beginner', progress: 45, category: 'Frontend' },
    { name: 'Node.js', level: 'beginner', progress: 30, category: 'Backend' },
    { name: 'Python', level: 'advanced', progress: 90, category: 'Programming' },
    { name: 'SQL', level: 'intermediate', progress: 60, category: 'Database' },
    { name: 'Git', level: 'intermediate', progress: 70, category: 'Tools' },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Skills Development
      </Typography>
      
      <Grid container spacing={3}>
        {skills.map((skill, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Psychology color="primary" />
                  <Box>
                    <Typography variant="h6">{skill.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {skill.category}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{skill.progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={skill.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={skill.level} 
                    size="small" 
                    color={getLevelColor(skill.level)}
                  />
                  <Button variant="outlined" size="small">
                    Learn More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SkillsPage;


