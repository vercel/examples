import os

config_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "litellm_config.yaml"
)
os.environ.setdefault("LITELLM_CONFIG_FILE_PATH", config_path)

from litellm.proxy import proxy_server

app = proxy_server.app
