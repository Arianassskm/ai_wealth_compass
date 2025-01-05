from prometheus_client import Counter, Histogram
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# 定义监控指标
AI_REQUEST_COUNTER = Counter(
    'ai_requests_total',          # 指标名称
    'Total number of AI requests made'  # 指标描述
)

AI_REQUEST_DURATION = Histogram(
    'ai_request_duration_seconds',     # 指标名称
    'AI request duration in seconds'   # 指标描述
)

# 设置分布式追踪
tracer_provider = TracerProvider()  # 创建追踪提供者
jaeger_exporter = JaegerExporter(   # 配置Jaeger导出器
    agent_host_name="localhost",     # Jaeger代理主机
    agent_port=6831,                 # Jaeger代理端口
)
tracer_provider.add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)
trace.set_tracer_provider(tracer_provider)
tracer = trace.get_tracer(__name__) 