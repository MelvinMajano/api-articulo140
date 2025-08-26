import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API articulo-140",
      version: "1.0.0",
      description: "Documentación de la API articulo-140 usando swagger-jsdoc y swagger-ui-express",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    "./api/routes/*.js",
    "./api/routes/activitiesRoutes/*.js",
    "./server.js"
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;