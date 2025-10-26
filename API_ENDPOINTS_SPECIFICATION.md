# 🔌 API ENDPOINTS SPECIFICATION

## 📋 Overview

**Project Name**: Contextual Corporate Assistant RAG/GRAPH
**API Version**: 1.0
**Base URL**: `https://your-project.supabase.co/functions/v1`
**Authentication**: JWT with Corporate SSO Integration via Supabase Auth
**Last Updated**: December 2024

---

## 🔐 Authentication

### Authentication Method
**JWT with Corporate SSO Integration**

### Authentication Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Corporate-ID: <corporate_user_id>
```

### Token Management
- **Token Type**: JWT with corporate claims
- **Expiration**: 15 minutes for access tokens
- **Refresh**: 7 days for refresh tokens
- **Revocation**: Corporate SSO integration for immediate revocation

---

## 📊 API Endpoints

### 1. Authentication Endpoints

#### POST /api/auth/login
**Description**: Authenticate user via corporate SSO and return access token

**Request Body**:
```json
{
  "corporate_id": "string",
  "sso_token": "string",
  "device_info": {
    "platform": "slack|teams|web|mobile",
    "version": "string"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "refresh_token": "string",
    "expires_in": 900,
    "user": {
      "id": "string",
      "corporate_id": "string",
      "name": "string",
      "email": "string",
      "role": "learner|hr_manager|trainer|admin",
      "department": "string",
      "skills": ["string"],
      "learning_progress": {
        "courses_completed": 0,
        "skills_acquired": 0,
        "learning_paths_active": 0
      }
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Invalid SSO token
- `403` - Corporate access denied
- `400` - Invalid request
- `500` - Server error

#### POST /api/auth/refresh
**Description**: Refresh access token using refresh token

**Request Body**:
```json
{
  "refresh_token": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "expires_in": 900
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Invalid refresh token
- `400` - Invalid request
- `500` - Server error

#### POST /api/auth/logout
**Description**: Logout user and invalidate tokens

**Request Body**:
```json
{
  "refresh_token": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid request
- `500` - Server error

### 2. RAG Query Endpoints

#### POST /api/rag/query
**Description**: Submit natural language query for AI-powered response

**Request Body**:
```json
{
  "query": "string",
  "context": {
    "platform": "slack|teams|web|mobile",
    "channel_id": "string",
    "thread_id": "string",
    "user_context": {
      "current_course": "string",
      "learning_goals": ["string"],
      "skill_level": "beginner|intermediate|advanced"
    }
  },
  "options": {
    "include_sources": true,
    "max_response_length": 500,
    "confidence_threshold": 0.8
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response": "string",
    "confidence_score": 0.95,
    "sources": [
      {
        "type": "course|lesson|skill|assessment",
        "id": "string",
        "title": "string",
        "relevance_score": 0.9,
        "url": "string"
      }
    ],
    "recommendations": [
      {
        "type": "course|learning_path|skill|assessment",
        "id": "string",
        "title": "string",
        "reason": "string",
        "priority": "high|medium|low"
      }
    ],
    "query_id": "string",
    "processing_time_ms": 1250
  }
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid query or context
- `401` - Unauthorized
- `429` - Rate limit exceeded
- `500` - Server error

#### GET /api/rag/query/:query_id
**Description**: Get details about a specific query and its response

**Path Parameters**:
- `query_id`: Unique query identifier

**Response**:
```json
{
  "success": true,
  "data": {
    "query": {
      "id": "string",
      "text": "string",
      "timestamp": "2024-12-01T10:30:00Z",
      "user_id": "string",
      "platform": "slack|teams|web|mobile",
      "response": "string",
      "confidence_score": 0.95,
      "sources": [],
      "recommendations": [],
      "feedback": {
        "rating": 5,
        "comment": "string"
      }
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `404` - Query not found
- `500` - Server error

#### POST /api/rag/feedback
**Description**: Submit feedback on RAG response quality

**Request Body**:
```json
{
  "query_id": "string",
  "rating": 1-5,
  "comment": "string",
  "accuracy": "accurate|partially_accurate|inaccurate",
  "helpfulness": "helpful|somewhat_helpful|not_helpful"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid feedback data
- `401` - Unauthorized
- `404` - Query not found
- `500` - Server error

### 3. Knowledge Graph Endpoints

#### GET /api/knowledge-graph/entities
**Description**: Get entities from knowledge graph with relationships

**Query Parameters**:
- `type` (optional): Entity type (course, skill, lesson, trainer, etc.)
- `search` (optional): Search term for entity names
- `limit` (optional): Maximum number of entities (default: 50)
- `include_relationships` (optional): Include relationship data (default: false)

**Response**:
```json
{
  "success": true,
  "data": {
    "entities": [
      {
        "id": "string",
        "type": "course|skill|lesson|trainer|assessment",
        "name": "string",
        "description": "string",
        "properties": {
          "difficulty_level": "beginner|intermediate|advanced",
          "duration_minutes": 120,
          "prerequisites": ["string"],
          "learning_objectives": ["string"]
        },
        "relationships": [
          {
            "type": "prerequisite|related_to|taught_by|assesses",
            "target_entity": {
              "id": "string",
              "name": "string",
              "type": "string"
            },
            "strength": 0.8
          }
        ]
      }
    ],
    "total_count": 150,
    "has_more": true
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `400` - Invalid parameters
- `500` - Server error

#### GET /api/knowledge-graph/relationships
**Description**: Get relationships between entities

**Query Parameters**:
- `source_entity_id` (optional): Source entity ID
- `target_entity_id` (optional): Target entity ID
- `relationship_type` (optional): Type of relationship
- `min_strength` (optional): Minimum relationship strength (0.0-1.0)

**Response**:
```json
{
  "success": true,
  "data": {
    "relationships": [
      {
        "id": "string",
        "type": "prerequisite|related_to|taught_by|assesses",
        "source_entity": {
          "id": "string",
          "name": "string",
          "type": "string"
        },
        "target_entity": {
          "id": "string",
          "name": "string",
          "type": "string"
        },
        "strength": 0.8,
        "properties": {
          "created_at": "2024-12-01T10:30:00Z",
          "confidence": 0.95
        }
      }
    ]
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `400` - Invalid parameters
- `500` - Server error

### 4. Personalization Endpoints

#### GET /api/personalization/profile
**Description**: Get user's personalized learning profile

**Response**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "user_id": "string",
      "learning_style": "visual|auditory|kinesthetic|reading",
      "skill_gaps": [
        {
          "skill_id": "string",
          "skill_name": "string",
          "current_level": 2,
          "target_level": 4,
          "priority": "high|medium|low"
        }
      ],
      "learning_preferences": {
        "preferred_duration": "short|medium|long",
        "preferred_format": "video|text|interactive|hands-on",
        "difficulty_preference": "beginner|intermediate|advanced"
      },
      "career_goals": [
        {
          "goal": "string",
          "timeline": "3_months|6_months|1_year|2_years",
          "required_skills": ["string"]
        }
      ],
      "learning_history": {
        "courses_completed": 15,
        "skills_acquired": 8,
        "average_rating": 4.2,
        "preferred_trainers": ["string"]
      }
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `404` - Profile not found
- `500` - Server error

#### GET /api/personalization/recommendations
**Description**: Get personalized learning recommendations

**Query Parameters**:
- `type` (optional): Recommendation type (course, skill, learning_path, trainer)
- `limit` (optional): Maximum recommendations (default: 10)
- `priority` (optional): Priority filter (high, medium, low)

**Response**:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "string",
        "type": "course|skill|learning_path|trainer",
        "title": "string",
        "description": "string",
        "reason": "string",
        "priority": "high|medium|low",
        "confidence": 0.9,
        "estimated_time": "2_hours",
        "difficulty": "beginner|intermediate|advanced",
        "prerequisites": ["string"],
        "learning_objectives": ["string"],
        "metadata": {
          "rating": 4.5,
          "completion_rate": 0.85,
          "user_satisfaction": 0.92
        }
      }
    ],
    "generated_at": "2024-12-01T10:30:00Z",
    "next_update": "2024-12-02T10:30:00Z"
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `400` - Invalid parameters
- `500` - Server error

#### POST /api/personalization/feedback
**Description**: Submit feedback on recommendations

**Request Body**:
```json
{
  "recommendation_id": "string",
  "action": "accepted|rejected|completed|started",
  "rating": 1-5,
  "comment": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Feedback recorded successfully"
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid feedback data
- `401` - Unauthorized
- `404` - Recommendation not found
- `500` - Server error

### 5. Corporate Tool Integration Endpoints

#### POST /api/integrations/slack/message
**Description**: Handle incoming Slack messages

**Request Body**:
```json
{
  "event": {
    "type": "message",
    "text": "string",
    "user": "string",
    "channel": "string",
    "thread_ts": "string",
    "ts": "string"
  },
  "team_id": "string",
  "api_app_id": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response": "string",
    "attachments": [
      {
        "color": "good|warning|danger",
        "title": "string",
        "text": "string",
        "actions": [
          {
            "type": "button",
            "text": "string",
            "value": "string"
          }
        ]
      }
    ],
    "thread_ts": "string"
  }
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid Slack payload
- `401` - Invalid Slack token
- `500` - Server error

#### POST /api/integrations/teams/message
**Description**: Handle incoming Teams messages

**Request Body**:
```json
{
  "type": "message",
  "text": "string",
  "from": {
    "id": "string",
    "name": "string"
  },
  "conversation": {
    "id": "string"
  },
  "channelData": {
    "tenant": {
      "id": "string"
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "type": "message",
    "text": "string",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
          "type": "AdaptiveCard",
          "body": [
            {
              "type": "TextBlock",
              "text": "string"
            }
          ]
        }
      }
    ]
  }
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid Teams payload
- `401` - Invalid Teams token
- `500` - Server error

#### POST /api/integrations/email/process
**Description**: Process incoming email queries

**Request Body**:
```json
{
  "from": "string",
  "to": "string",
  "subject": "string",
  "body": "string",
  "attachments": [
    {
      "filename": "string",
      "content_type": "string",
      "content": "base64_string"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response_subject": "string",
    "response_body": "string",
    "attachments": [
      {
        "filename": "string",
        "content_type": "string",
        "content": "base64_string"
      }
    ]
  }
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid email format
- `401` - Unauthorized
- `500` - Server error

### 6. Microservice Integration Endpoints

#### GET /api/integrations/microservices/status
**Description**: Get status of all integrated microservices

**Response**:
```json
{
  "success": true,
  "data": {
    "microservices": [
      {
        "name": "course_builder",
        "status": "healthy|degraded|down",
        "last_sync": "2024-12-01T10:30:00Z",
        "data_count": {
          "courses": 150,
          "lessons": 1200,
          "updated_today": 5
        },
        "response_time_ms": 250,
        "error_rate": 0.01
      }
    ],
    "overall_status": "healthy|degraded|down",
    "last_full_sync": "2024-12-01T09:00:00Z"
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

#### POST /api/integrations/microservices/sync
**Description**: Trigger manual sync with microservices

**Request Body**:
```json
{
  "microservices": ["course_builder", "skills_engine"],
  "force_full_sync": false
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sync_id": "string",
    "status": "started|in_progress|completed|failed",
    "estimated_duration": "5_minutes",
    "progress": {
      "completed": 0,
      "total": 100,
      "percentage": 0
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid sync request
- `401` - Unauthorized
- `500` - Server error

#### GET /api/integrations/microservices/sync/:sync_id
**Description**: Get sync status and progress

**Path Parameters**:
- `sync_id`: Sync operation identifier

**Response**:
```json
{
  "success": true,
  "data": {
    "sync_id": "string",
    "status": "started|in_progress|completed|failed",
    "started_at": "2024-12-01T10:30:00Z",
    "completed_at": "2024-12-01T10:35:00Z",
    "progress": {
      "completed": 100,
      "total": 100,
      "percentage": 100
    },
    "results": {
      "courses_updated": 5,
      "lessons_updated": 25,
      "skills_updated": 3,
      "errors": []
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `404` - Sync not found
- `500` - Server error

### 7. Analytics and Reporting Endpoints

#### GET /api/analytics/usage
**Description**: Get usage analytics and metrics

**Query Parameters**:
- `period` (optional): Time period (day, week, month, quarter)
- `start_date` (optional): Start date (ISO 8601)
- `end_date` (optional): End date (ISO 8601)
- `group_by` (optional): Group by (user, department, platform)

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "start_date": "2024-11-01",
    "end_date": "2024-11-30",
    "metrics": {
      "total_queries": 15000,
      "unique_users": 450,
      "average_response_time_ms": 1200,
      "accuracy_rate": 0.87,
      "user_satisfaction": 4.2,
      "platform_breakdown": {
        "slack": 8000,
        "teams": 5000,
        "web": 1500,
        "mobile": 500
      },
      "department_breakdown": {
        "engineering": 6000,
        "marketing": 4000,
        "sales": 3000,
        "hr": 2000
      }
    },
    "trends": {
      "queries_per_day": [100, 120, 110, 130],
      "accuracy_over_time": [0.85, 0.87, 0.89, 0.87],
      "user_adoption": [50, 75, 100, 125]
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `403` - Insufficient permissions
- `400` - Invalid parameters
- `500` - Server error

#### GET /api/analytics/learning-impact
**Description**: Get learning impact analytics

**Query Parameters**:
- `period` (optional): Time period (month, quarter, year)
- `department` (optional): Department filter
- `skill_category` (optional): Skill category filter

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "quarter",
    "learning_metrics": {
      "courses_started": 250,
      "courses_completed": 180,
      "completion_rate": 0.72,
      "skills_acquired": 95,
      "learning_paths_active": 45,
      "average_learning_time_hours": 12.5
    },
    "impact_metrics": {
      "skill_gap_reduction": 0.15,
      "career_progression": 8,
      "performance_improvement": 0.12,
      "user_engagement_increase": 0.25
    },
    "recommendations": [
      {
        "type": "skill_gap",
        "description": "Focus on Python programming skills",
        "impact": "high",
        "effort": "medium"
      }
    ]
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `403` - Insufficient permissions
- `400` - Invalid parameters
- `500` - Server error

### 8. Admin Endpoints

#### GET /api/admin/system/health
**Description**: Get comprehensive system health status

**Response**:
```json
{
  "success": true,
  "data": {
    "overall_status": "healthy|degraded|down",
    "timestamp": "2024-12-01T10:30:00Z",
    "components": {
      "api_gateway": {
        "status": "healthy",
        "response_time_ms": 50,
        "uptime": "99.9%"
      },
      "rag_service": {
        "status": "healthy",
        "response_time_ms": 1200,
        "accuracy_rate": 0.87,
        "queue_size": 5
      },
      "knowledge_graph": {
        "status": "healthy",
        "response_time_ms": 200,
        "node_count": 15000,
        "relationship_count": 45000
      },
      "microservices": {
        "status": "healthy",
        "connected_services": 8,
        "failed_services": 0,
        "last_sync": "2024-12-01T10:00:00Z"
      }
    },
    "alerts": [
      {
        "level": "warning",
        "component": "rag_service",
        "message": "Response time above threshold",
        "timestamp": "2024-12-01T10:25:00Z"
      }
    ]
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `403` - Admin access required
- `500` - Server error

#### POST /api/admin/system/maintenance
**Description**: Trigger system maintenance operations

**Request Body**:
```json
{
  "operation": "cache_clear|knowledge_graph_rebuild|model_update",
  "parameters": {
    "cache_type": "all|query|user|recommendation",
    "force": false
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "operation_id": "string",
    "status": "started|in_progress|completed|failed",
    "estimated_duration": "10_minutes",
    "progress": {
      "completed": 0,
      "total": 100,
      "percentage": 0
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid operation
- `401` - Unauthorized
- `403` - Admin access required
- `500` - Server error

---

## 🔄 Real-time Endpoints

### WebSocket Connection
**Endpoint**: `wss://api.corporate-assistant.company.com/ws`
**Description**: WebSocket connection for real-time updates

**Connection Headers**:
```
Authorization: Bearer <jwt_token>
X-Corporate-ID: <corporate_user_id>
```

**Message Types**:
- `subscribe`: Subscribe to updates
- `unsubscribe`: Unsubscribe from updates
- `query_update`: Real-time query processing updates
- `recommendation_update`: New personalized recommendations
- `system_notification`: System-wide notifications

**Example Messages**:
```json
{
  "type": "subscribe",
  "channel": "user_recommendations",
  "data": {
    "user_id": "string"
  }
}
```

```json
{
  "type": "query_update",
  "data": {
    "query_id": "string",
    "status": "processing|completed|failed",
    "progress": 75,
    "response": "string"
  }
}
```

---

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details",
    "timestamp": "2024-12-01T10:30:00Z",
    "request_id": "string"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - Authorization failed
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `RAG_PROCESSING_ERROR` - RAG processing failed
- `KNOWLEDGE_GRAPH_ERROR` - Knowledge graph operation failed
- `MICROSERVICE_ERROR` - Microservice integration failed
- `INTERNAL_SERVER_ERROR` - Internal server error

---

## 📊 Rate Limiting

### Rate Limits
- **Authentication endpoints**: 10 requests per minute per IP
- **RAG query endpoints**: 100 requests per minute per user
- **Knowledge graph endpoints**: 200 requests per minute per user
- **Personalization endpoints**: 50 requests per minute per user
- **Admin endpoints**: 20 requests per minute per user
- **WebSocket connections**: 5 concurrent connections per user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

---

## 🔒 Security Considerations

### Input Validation
- All input data validated with JSON schemas
- SQL injection prevention with parameterized queries
- XSS protection with content sanitization
- CSRF protection with token validation
- File upload validation and virus scanning

### Authentication
- JWT tokens with short expiration (15 minutes)
- Refresh token rotation for security
- Corporate SSO integration for centralized authentication
- Multi-factor authentication support
- Rate limiting on authentication endpoints

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- API key validation for microservice integration
- Request signing for sensitive operations
- Audit logging for all access attempts

### Data Protection
- Encryption at rest and in transit
- PII data anonymization
- GDPR compliance with data retention policies
- Secure data sharing between microservices
- Regular security audits and penetration testing

---

## 📚 API Documentation

### OpenAPI Specification
- OpenAPI 3.0 compliant specification
- Interactive documentation with Swagger UI
- Request/response examples for all endpoints
- Error code documentation with examples
- Authentication flow documentation

### Postman Collection
- Complete API collection with all endpoints
- Environment variables for different stages
- Automated test scripts for API validation
- Comprehensive documentation and examples
- Mock server for development and testing

### SDKs and Libraries
- Python SDK for backend integration
- JavaScript SDK for frontend integration
- Slack Bot SDK for Slack integration
- Teams Bot SDK for Microsoft Teams integration
- Mobile SDKs for iOS and Android

---

**Document Status**: Draft
**Last Updated**: December 2024
**Next Review**: [Date]
**Approved By**: [Name and Title]
