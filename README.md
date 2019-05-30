# Prometheus Lighthouse Exporter

This is an simple Prometheus Exporter for Lighthouse Performance Data. With this you monitor continuously the Lighthouse Score of your Webpage.

## Sample Prometheus Config
```yaml
global:
  scrape_interval: 1h
  evaluation_interval: 30s
  scrape_timeout: 15s

scrape_configs:
  - job_name: 'lighthouse'
    metrics_path: /probe
    static_configs:
      - targets:
        - https://philippkeschl.at
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: 127.0.0.1:9593
```

## Grafana Dashboard

![](assets/grafana-dashboard.png)