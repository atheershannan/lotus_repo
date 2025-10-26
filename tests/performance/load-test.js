import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'],     // Error rate should be below 10%
    errors: ['rate<0.1'],              // Custom error rate should be below 10%
  },
};

// Test data
const API_BASE_URL = __ENV.API_URL || 'http://localhost:3001/api';
const API_TOKEN = __ENV.API_TOKEN || 'test-token';

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
};

// Test scenarios
export default function() {
  // Scenario 1: Health Check
  const healthResponse = http.get(`${API_BASE_URL}/health`);
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(healthResponse.status !== 200);
  responseTime.add(healthResponse.timings.duration);

  sleep(1);

  // Scenario 2: Chat Message
  const chatPayload = {
    message: 'What skills should I learn for web development?',
    sessionId: `test-session-${__VU}-${__ITER}`,
    options: {
      matchThreshold: 0.7,
      matchCount: 5
    }
  };

  const chatResponse = http.post(`${API_BASE_URL}/chat/message`, JSON.stringify(chatPayload), {
    headers: headers,
  });

  check(chatResponse, {
    'chat message status is 200': (r) => r.status === 200,
    'chat message response time < 5s': (r) => r.timings.duration < 5000,
    'chat message has response': (r) => {
      const body = JSON.parse(r.body);
      return body.success && body.data.assistantResponse.content;
    },
  });
  errorRate.add(chatResponse.status !== 200);
  responseTime.add(chatResponse.timings.duration);

  sleep(2);

  // Scenario 3: Content Search
  const searchPayload = {
    query: 'JavaScript basics',
    type: 'hybrid',
    limit: 10
  };

  const searchResponse = http.post(`${API_BASE_URL}/search/content`, JSON.stringify(searchPayload), {
    headers: headers,
  });

  check(searchResponse, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 3s': (r) => r.timings.duration < 3000,
    'search has results': (r) => {
      const body = JSON.parse(r.body);
      return body.success && body.data.results.length > 0;
    },
  });
  errorRate.add(searchResponse.status !== 200);
  responseTime.add(searchResponse.timings.duration);

  sleep(1);

  // Scenario 4: Skills Search
  const skillsPayload = {
    query: 'programming',
    limit: 20
  };

  const skillsResponse = http.post(`${API_BASE_URL}/search/skills`, JSON.stringify(skillsPayload), {
    headers: headers,
  });

  check(skillsResponse, {
    'skills search status is 200': (r) => r.status === 200,
    'skills search response time < 2s': (r) => r.timings.duration < 2000,
    'skills search has results': (r) => {
      const body = JSON.parse(r.body);
      return body.success && body.data.skills.length > 0;
    },
  });
  errorRate.add(skillsResponse.status !== 200);
  responseTime.add(skillsResponse.timings.duration);

  sleep(1);

  // Scenario 5: Get Recommendations
  const recommendationsResponse = http.get(`${API_BASE_URL}/recommendations?limit=10`, {
    headers: headers,
  });

  check(recommendationsResponse, {
    'recommendations status is 200': (r) => r.status === 200,
    'recommendations response time < 2s': (r) => r.timings.duration < 2000,
    'recommendations has data': (r) => {
      const body = JSON.parse(r.body);
      return body.success && body.data.recommendations;
    },
  });
  errorRate.add(recommendationsResponse.status !== 200);
  responseTime.add(recommendationsResponse.timings.duration);

  sleep(1);
}

// Setup function (runs once at the beginning)
export function setup() {
  console.log('🚀 Starting Corporate Learning Assistant Performance Tests');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  
  // Test API connectivity
  const healthResponse = http.get(`${API_BASE_URL}/health`);
  if (healthResponse.status !== 200) {
    throw new Error(`API health check failed: ${healthResponse.status}`);
  }
  
  console.log('✅ API is healthy and ready for testing');
  return { apiUrl: API_BASE_URL };
}

// Teardown function (runs once at the end)
export function teardown(data) {
  console.log('🏁 Performance tests completed');
  console.log(`📊 Tested API: ${data.apiUrl}`);
}


