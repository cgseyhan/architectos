/**
 * ArchitectOS Core Knowledge Graph & Domain Types
 */

/**
 * Node Types across layers:
 * - FILE: File node
 * - SYMBOL: Class, Interface, Function, Enum
 * - SERVICE: Microservice or Bounded Context module
 * - API: REST Endpoint, GraphQL, RPC
 * - DATABASE: Postgres, Prisma, Redis, Supabase
 * - QUEUE: Kafka, RabbitMQ, BullMQ
 * - CLOUD: AWS, Azure, GCP, Terraform resource
 */
const NodeType = {
  FILE: 'FILE',
  SYMBOL: 'SYMBOL',
  SERVICE: 'SERVICE',
  API: 'API',
  DATABASE: 'DATABASE',
  QUEUE: 'QUEUE',
  CLOUD: 'CLOUD'
};

const EdgeType = {
  IMPORTS: 'IMPORTS',
  CALLS: 'CALLS',
  EXPOSES_API: 'EXPOSES_API',
  QUERIES_DB: 'QUERIES_DB',
  PUBLISHES_EVENT: 'PUBLISHES_EVENT',
  CONTAINS: 'CONTAINS',
  VIOLATES_RULE: 'VIOLATES_RULE'
};

const ArchitecturalStyle = {
  CLEAN: 'clean',
  HEXAGONAL: 'hexagonal',
  DDD: 'ddd',
  LAYERED: 'layered',
  MODULAR_MONOLITH: 'modular-monolith'
};

module.exports = {
  NodeType,
  EdgeType,
  ArchitecturalStyle
};
