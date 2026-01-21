---
sidebar_position: 1
---

# 身份验证概览 

下图展示了基础的身份验证工作流：

<img src="/img/Dubbing AI Auth Flow.png" alt="Authentication Flow Diagram" width="800" />

1. 客户端向用户服务器发送签名请求。

2. 用户服务器根据预定义规则生成签名并返回。

3. 客户端收到签名后，调用 Dubbing AI SDK 执行登录。

4. Dubbing AI 服务器验证 SDK 请求中包含的签名。

5. 客户端收到登录成功的响应并创建引擎。