// src/lib/tracing.js
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base");

// Create an instance of the tracer provider
const provider = new NodeTracerProvider();

// Export spans to console (or other backends)
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register();

console.log("Tracing initialized");
