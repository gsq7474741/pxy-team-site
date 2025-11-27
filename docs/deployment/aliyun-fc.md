# 阿里云函数计算

项目部署在阿里云函数计算 (FC) 上。

## Serverless Devs 配置

### `s.ci.yaml`

```yaml
edition: 3.0.0
name: pxy-team-site-ci
access: "default"

vars:
  region: "cn-chengdu"
  feFunctionName: "pxy-site-frontend"
  beFunctionName: "pxy-site-backend"
```

## 前端函数配置

```yaml
resources:
  start_frontend:
    component: fc3
    props:
      region: ${vars.region}
      runtime: custom.debian10
      timeout: 60
      cpu: 0.35
      memorySize: 512
      diskSize: 512
      instanceConcurrency: 20
      provisionConfig:
        target: 1
        alwaysAllocateCPU: true
      layers:
        - acs:fc:${vars.region}:official:layers/Nodejs20/versions/1
      customRuntimeConfig:
        command:
          - npm
          - run
          - start
        port: 3000
      functionName: ${vars.feFunctionName}
      code: ./dist/deploy-frontend/
```

## 后端函数配置

```yaml
  start_backend:
    component: fc3
    props:
      region: ${vars.region}
      runtime: custom.debian10
      timeout: 120
      cpu: 1
      memorySize: 2048
      instanceConcurrency: 100
      provisionConfig:
        target: 1
        alwaysAllocateCPU: true
      customRuntimeConfig:
        command:
          - npm
          - run
          - start
        port: 1337
      functionName: ${vars.beFunctionName}
      code: ./dist/deploy-backend
```

## 域名配置

```yaml
  fc3_domain_fe:
    component: fc3-domain
    props:
      region: ${vars.region}
      domainName: prof-peng.team
      protocol: HTTP,HTTPS
      certConfig:
        certId: 21130608
      routeConfig:
        routes:
          - path: /*
            functionName: ${vars.feFunctionName}

  fc3_domain_be:
    component: fc3-domain
    props:
      domainName: cms.prof-peng.team
      protocol: HTTP,HTTPS
      routeConfig:
        routes:
          - path: /*
            functionName: ${vars.beFunctionName}
```

## 资源配置说明

| 配置 | 前端 | 后端 |
|------|------|------|
| CPU | 0.35 vCPU | 1 vCPU |
| 内存 | 512 MB | 2048 MB |
| 超时 | 60s | 120s |
| 并发 | 20 | 100 |
| 预留实例 | 1 | 1 |

## 预留实例

`alwaysAllocateCPU: true` 确保预留实例始终有 CPU 分配，避免冷启动。

## 常用命令

```bash
# 安装 Serverless Devs
npm i -g @serverless-devs/s

# 配置阿里云凭证
s config add --AccessKeyID xxx --AccessKeySecret xxx -a default

# 部署
s deploy -t s.ci.yaml -y

# 查看函数信息
s info -t s.ci.yaml
```
