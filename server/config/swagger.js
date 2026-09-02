import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Animal Shelters API",
      version: "1.0.0",
      description:
        "REST API for Animal Shelters application. Provides CRUD operations for user management and health monitoring.",
      contact: {
        name: "Animal Helper Team",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Health check and monitoring endpoints",
      },
      {
        name: "Users",
        description: "User management operations (CRUD)",
      },
      {
        name: "Auth",
        description: "Registration, login, and current user",
      },
      {
        name: "Animals",
        description: "Animal management operations (CRUD)",
      },
      {
        name: "Shelters",
        description: "Shelter management operations (CRUD)",
      },
      {
        name: "Adoptions",
        description: "Adoption request management operations (CRUD)",
      },
      {
        name: "Consent",
        description: "GDPR consent recording",
      },
      {
        name: "Surveys",
        description: "Shelter survey and feedback management",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique user identifier",
              example: "1",
            },
            name: {
              type: "string",
              description: "Full name of the user",
              example: "Jan Kowalski",
              minLength: 2,
              maxLength: 100,
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address (unique)",
              example: "jan@example.com",
            },
            role: {
              type: "string",
              enum: ["volunteer", "admin", "moderator"],
              description: "User role",
              example: "volunteer",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp (ISO 8601)",
              example: "2025-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp (ISO 8601)",
              example: "2025-01-15T10:30:00.000Z",
            },
          },
          required: ["id", "name", "email", "role", "createdAt", "updatedAt"],
        },
        UserCreate: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Full name of the user",
              minLength: 2,
              maxLength: 100,
              example: "Marta Zielińska",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address (must be unique)",
              example: "marta@example.com",
            },
            role: {
              type: "string",
              enum: ["volunteer", "admin", "moderator"],
              description: "User role (defaults to volunteer)",
              default: "volunteer",
              example: "volunteer",
            },
          },
          required: ["name", "email"],
        },
        UserUpdate: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              example: "Marta Kowalska",
            },
            email: {
              type: "string",
              format: "email",
              example: "marta.kowalska@example.com",
            },
            role: {
              type: "string",
              enum: ["volunteer", "admin", "moderator"],
              example: "moderator",
            },
          },
          minProperties: 1,
          description: "At least one field must be provided",
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "Human-readable error message",
                  example: "User with id \"999\" not found",
                },
                statusCode: {
                  type: "integer",
                  description: "HTTP status code",
                  example: 404,
                },
                details: {
                  type: "array",
                  description: "Detailed validation errors (only on 400)",
                  items: {
                    type: "object",
                    properties: {
                      field: {
                        type: "string",
                        example: "email",
                      },
                      message: {
                        type: "string",
                        example: "Email must be a valid email address",
                      },
                    },
                  },
                },
              },
            },
          },
          required: ["success", "error"],
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
          },
          required: ["success"],
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2025-06-20T12:00:00.000Z",
            },
            uptime: {
              type: "number",
              description: "Server uptime in seconds",
              example: 123.456,
            },
            memoryUsage: {
              type: "object",
              properties: {
                rss: {
                  type: "number",
                  description: "Resident Set Size in bytes",
                },
                heapUsed: {
                  type: "number",
                  description: "Heap used in bytes",
                },
                heapTotal: {
                  type: "number",
                  description: "Total heap in bytes",
                },
              },
            },
            system: {
              type: "object",
              properties: {
                platform: {
                  type: "string",
                  example: "linux",
                },
                nodeVersion: {
                  type: "string",
                  example: "v20.11.0",
                },
              },
            },
          },
        },
        Animal: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique animal identifier" },
            name: { type: "string", description: "Animal name", example: "Buddy" },
            species: { type: "string", description: "Animal species", example: "dog" },
            breed: { type: "string", description: "Animal breed", example: "Labrador" },
            age: { type: "integer", description: "Age in years", example: 3 },
            shelter_id: { type: "string", description: "Shelter this animal belongs to" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "species", "shelter_id", "createdAt", "updatedAt"],
        },
        AnimalCreate: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100, example: "Buddy" },
            species: { type: "string", minLength: 1, example: "dog" },
            breed: { type: "string", example: "Labrador" },
            age: { type: "integer", minimum: 0, example: 3 },
            shelter_id: { type: "string" },
          },
          required: ["name", "species", "shelter_id"],
        },
        AnimalUpdate: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            species: { type: "string", minLength: 1 },
            breed: { type: "string" },
            age: { type: "integer", minimum: 0 },
            shelter_id: { type: "string" },
          },
          minProperties: 1,
          description: "At least one field must be provided",
        },
        Shelter: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique shelter identifier" },
            name: { type: "string", description: "Shelter name", example: "Azyl Naděje" },
            city: { type: "string", description: "City", example: "Praha" },
            country: { type: "string", description: "Country", example: "Czechia" },
            contact_email: { type: "string", format: "email" },
            contact_phone: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "city", "country", "createdAt", "updatedAt"],
        },
        ShelterCreate: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100, example: "Azyl Naděje" },
            city: { type: "string", minLength: 1, example: "Praha" },
            country: { type: "string", minLength: 1, example: "Czechia" },
            contact_email: { type: "string", format: "email" },
            contact_phone: { type: "string" },
          },
          required: ["name", "city", "country"],
        },
        ShelterUpdate: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            city: { type: "string", minLength: 1 },
            country: { type: "string", minLength: 1 },
            contact_email: { type: "string", format: "email" },
            contact_phone: { type: "string" },
          },
          minProperties: 1,
          description: "At least one field must be provided",
        },
        Adoption: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique adoption request identifier" },
            user_id: { type: "string" },
            animal_id: { type: "string" },
            status: { type: "string", enum: ["pending", "approved", "rejected", "cancelled"] },
            notes: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "user_id", "animal_id", "status", "createdAt", "updatedAt"],
        },
        AdoptionCreate: {
          type: "object",
          properties: {
            user_id: { type: "string" },
            animal_id: { type: "string" },
            notes: { type: "string" },
          },
          required: ["user_id", "animal_id"],
        },
        AdoptionStatusUpdate: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["pending", "approved", "rejected", "cancelled"] },
          },
          required: ["status"],
        },
        Consent: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique consent record identifier" },
            user_id: { type: "string" },
            consent_type: { type: "string", enum: ["cookies", "analytics", "marketing", "data_processing"] },
            granted: { type: "boolean" },
            recordedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "user_id", "consent_type", "granted", "recordedAt"],
        },
        ConsentCreate: {
          type: "object",
          properties: {
            user_id: { type: "string" },
            consent_type: { type: "string", enum: ["cookies", "analytics", "marketing", "data_processing"] },
            granted: { type: "boolean" },
          },
          required: ["user_id", "consent_type", "granted"],
        },
        Survey: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique survey identifier" },
            user_id: { type: "string" },
            shelter_id: { type: "string" },
            ratings: {
              type: "object",
              properties: {
                cleanliness: { type: "integer", minimum: 1, maximum: 5 },
                animal_care: { type: "integer", minimum: 1, maximum: 5 },
                staff_friendliness: { type: "integer", minimum: 1, maximum: 5 },
                overall: { type: "integer", minimum: 1, maximum: 5 },
              },
            },
            comment: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "user_id", "shelter_id", "ratings", "createdAt", "updatedAt"],
        },
        SurveyCreate: {
          type: "object",
          properties: {
            user_id: { type: "string" },
            shelter_id: { type: "string" },
            ratings: {
              type: "object",
              properties: {
                cleanliness: { type: "integer", minimum: 1, maximum: 5 },
                animal_care: { type: "integer", minimum: 1, maximum: 5 },
                staff_friendliness: { type: "integer", minimum: 1, maximum: 5 },
                overall: { type: "integer", minimum: 1, maximum: 5 },
              },
            },
            comment: { type: "string" },
          },
          required: ["user_id", "shelter_id", "ratings"],
        },
        PaginationMeta: {
          type: "object",
          properties: {
            total: {
              type: "integer",
              description: "Total number of matching records",
              example: 3,
            },
            limit: {
              type: "integer",
              description: "Results per page",
              example: 10,
            },
            offset: {
              type: "integer",
              description: "Number of skipped results",
              example: 0,
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        Conflict: {
          description: "Resource already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./server/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
