import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button, TextField, InputAdornment } from '@mui/material';
import { Search, School, Psychology, TrendingUp } from '@mui/icons-material';

const ContentPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Content
      </Typography>
      
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search for courses, lessons, or content..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course {item}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Learn the fundamentals of this topic with hands-on exercises and real-world examples.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label="Beginner" size="small" color="success" />
                  <Chip label="2 hours" size="small" />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Progress: 0%
                  </Typography>
                  <Button variant="contained" size="small">
                    Start
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

export default ContentPage;


