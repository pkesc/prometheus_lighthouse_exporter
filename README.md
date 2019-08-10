# Prometheus Lighthouse Exporter

This is an simple Prometheus Exporter for Lighthouse Performance Data. With this you monitor continuously the Lighthouse Score of your Webpage.

## Install
You can install it with npm. --unsafe-perm is needed because i use Puppeteer and without it you cannot install it globally.
```bash
sudo npm i -g prometheus_lighthouse_exporter --unsafe-perm
```

## Sample Prometheus Config
```yaml
global:
  scrape_interval: 5m
  evaluation_interval: 30s
  scrape_timeout: 1m

scrape_configs:
  - job_name: 'lighthouse'
    metrics_path: /probe
    static_configs:
      - targets:
        - https://philippkeschl.at
        - https://username:password@philippkeschl.at
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: 127.0.0.1:9593
```

If you want to Test and Page with HTTP Basic Authetication you can add the Username und Password to the URL of the Target as you can see in the Example above.

## Grafana Dashboard

![](assets/grafana-dashboard.png)